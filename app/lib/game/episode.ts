import { seededRng, shuffle } from "./rng";
import { WORLDS, WORLD_IDS, type WorldId } from "./worlds";
import type { RoundSpec, TemplateId, Twist } from "./types";

/**
 * The episode engine. Every game is one episode of a series: a world (chosen
 * by the team's vote, never one they have already played if avoidable), a
 * premise inside it, a round sequence sampled for this episode, and one or
 * two twists that change the conditions of a round. Everything here is
 * deterministic from the game id plus the inputs, so a retried generation
 * plans exactly the same episode.
 *
 * What is generated at game time by the model (titles, cold open, scenes,
 * reactions, in-world names) lives in game-master.ts; this file only decides
 * the structure, and the structure is all code.
 */

/** A finished game that shares at least one player with this one. */
export type PastEpisode = {
  worldId: WorldId;
  premise: number;
  title: string;
  number: number;
  endedAt: string;
  /** Exactly the same set of players: this is the same series. */
  sameTeam: boolean;
};

export const SURPRISE = "surprise" as const;
export type WorldVote = WorldId | typeof SURPRISE;

export const OFFER_SIZE = 3;

/* ── The vote ───────────────────────────────────────────────────────────── */

/**
 * Worlds offered in the lobby: ones nobody on this team has played first
 * (in a seeded order), then the ones played longest ago.
 */
export function offerWorlds(gameId: string, history: PastEpisode[]): WorldId[] {
  const rng = seededRng(`${gameId}:offer`);
  const lastPlayed = new Map<WorldId, number>();
  for (const h of history) lastPlayed.set(h.worldId, Math.max(lastPlayed.get(h.worldId) ?? 0, Date.parse(h.endedAt) || 0));
  const fresh = shuffle(rng, WORLD_IDS.filter((w) => !lastPlayed.has(w)));
  const played = WORLD_IDS.filter((w) => lastPlayed.has(w)).sort((a, b) => lastPlayed.get(a)! - lastPlayed.get(b)!);
  return [...fresh, ...played].slice(0, OFFER_SIZE);
}

/** Most votes wins; a tie goes to the host's pick if it is tied, else a seeded pick. No votes = surprise. */
export function tallyVotes(gameId: string, offer: WorldId[], votes: Record<string, WorldVote>, hostId: string | null): WorldId {
  const counts = new Map<WorldId, number>(offer.map((w) => [w, 0]));
  for (const v of Object.values(votes)) if (v !== SURPRISE && counts.has(v)) counts.set(v, counts.get(v)! + 1);
  const max = Math.max(...counts.values());
  const tied = max > 0 ? offer.filter((w) => counts.get(w) === max) : offer;
  const hostVote = hostId ? votes[hostId] : undefined;
  if (tied.length > 1 && hostVote && hostVote !== SURPRISE && tied.includes(hostVote) && max > 0) return hostVote;
  const rng = seededRng(`${gameId}:world`);
  return tied[Math.floor(rng() * tied.length)] ?? offer[0] ?? "office";
}

/* ── The plan ───────────────────────────────────────────────────────────── */

export type EpisodePlan = {
  worldId: WorldId;
  premise: number;
  /** Episode number in this team's series (1 for a new team). */
  number: number;
  previous: { worldId: WorldId; title: string; number: number } | null;
  schedule: RoundSpec[];
  detailHolderId: string;
};

/** The detail catch (sticky note) is always planted in round 2 and recalled in the last round. */
export const DETAIL_ROUND_INDEX = 1;

/** Talk rounds carry the episode: describing and listening, not arithmetic. */
const TALK: ReadonlySet<TemplateId> = new Set<TemplateId>(["common", "lineup", "blueprint", "replyall"]);
/** Rounds that produce a fact the key ceremony can ask for. */
const FACT_ROUNDS: ReadonlySet<TemplateId> = new Set<TemplateId>(["snack", "wifi", "desks", "lineup"]);
const WEIGHTS: Partial<Record<TemplateId, number>> = { common: 3, lineup: 3, blueprint: 3, replyall: 2, snack: 2, wifi: 1, desks: 1 };
const MAX_USES: Partial<Record<TemplateId, number>> = { common: 2, lineup: 2, blueprint: 2, replyall: 1, snack: 1, wifi: 1, desks: 1 };
/** Rounds 2..n-1 where a sticky note can be planted without getting in the way. */
const DETAIL_HOSTS: TemplateId[] = ["snack", "common", "replyall"];

/** Used only if sampling somehow fails its constraints 200 times. */
const FALLBACK: Record<number, TemplateId[]> = {
  3: ["slot", "common", "lineup", "blueprint", "snack", "callback"],
  4: ["slot", "snack", "common", "lineup", "replyall", "blueprint", "wifi", "callback"],
  5: ["slot", "common", "lineup", "snack", "blueprint", "replyall", "common", "wifi", "lineup", "callback"],
};

export function planEpisode(args: { gameId: string; playerIds: string[]; worldId: WorldId; history: PastEpisode[] }): EpisodePlan {
  const { gameId, playerIds, worldId, history } = args;
  const n = playerIds.length;
  const total = 2 * n; // everyone solves twice
  if (!FALLBACK[n]) throw new Error(`Unsupported team size ${n}`);
  const rng = seededRng(`${gameId}:episode`);

  const templates = sampleSequence(rng, total) ?? FALLBACK[n];

  // Solvers: everyone twice, in two shuffled passes.
  const order = [...shuffle(rng, playerIds), ...shuffle(rng, playerIds)];
  const schedule: RoundSpec[] = templates.map((template, index) => ({ index, template, solverPlayerId: order[index], detail: index === DETAIL_ROUND_INDEX }));

  // Twists: one in a 6-round episode, two (one of each) in longer ones. Never
  // on the opener, the sticky-note round or the memory round.
  const eligible = schedule.filter((r) => r.index > DETAIL_ROUND_INDEX && r.index < total - 1);
  const twists: Twist[] = total <= 6 ? [rng() < 0.5 ? "flash" : "rush"] : shuffle(rng, ["flash", "rush"] as Twist[]);
  const used = new Set<number>();
  for (const twist of twists) {
    const fits = eligible.filter((r) => !used.has(r.index) && (twist !== "flash" || FLASHABLE.has(r.template)));
    if (!fits.length) continue;
    const r = fits[Math.floor(rng() * fits.length)];
    r.twist = twist;
    used.add(r.index);
  }

  // Detail holder: a non-solver of the detail round who is not the memory-round solver.
  const callbackSolver = schedule[total - 1].solverPlayerId;
  const detailSolver = schedule[DETAIL_ROUND_INDEX].solverPlayerId;
  const candidates = playerIds.filter((id) => id !== detailSolver && id !== callbackSolver);
  const detailHolderId = candidates.length ? candidates[Math.floor(rng() * candidates.length)] : playerIds.find((id) => id !== detailSolver)!;

  // Premise: one this group has not had in this world yet.
  const premiseCount = WORLDS[worldId].premises.length;
  const seen = new Set(history.filter((h) => h.worldId === worldId).map((h) => h.premise));
  const unseen = Array.from({ length: premiseCount }, (_, i) => i).filter((i) => !seen.has(i));
  const premisePool = unseen.length ? unseen : Array.from({ length: premiseCount }, (_, i) => i);
  const premise = premisePool[Math.floor(rng() * premisePool.length)];

  const series = history.filter((h) => h.sameTeam).sort((a, b) => Date.parse(b.endedAt) - Date.parse(a.endedAt));
  const number = series.reduce((m, h) => Math.max(m, h.number), 0) + 1;
  const previous = series[0] ? { worldId: series[0].worldId, title: series[0].title, number: series[0].number } : null;

  return { worldId, premise, number, previous, schedule, detailHolderId };
}

/** Rounds whose pieces are pictures you can memorise and then describe (the flash twist hides them). */
const FLASHABLE: ReadonlySet<TemplateId> = new Set<TemplateId>(["common", "lineup", "blueprint", "snack"]);

/**
 * slot first (its hour feeds the memory round and the key), a light round
 * second (it carries the sticky note), memory last; the middle is sampled.
 */
function sampleSequence(rng: () => number, total: number): TemplateId[] | null {
  const middleCount = total - 3;
  for (let attempt = 0; attempt < 200; attempt++) {
    const uses = new Map<TemplateId, number>();
    const bump = (t: TemplateId) => uses.set(t, (uses.get(t) ?? 0) + 1);
    const seq: TemplateId[] = ["slot"];
    const second = DETAIL_HOSTS[Math.floor(rng() * DETAIL_HOSTS.length)];
    seq.push(second);
    bump(second);
    let ok = true;
    for (let i = 0; i < middleCount; i++) {
      const prev = seq[seq.length - 1];
      const options = (Object.keys(WEIGHTS) as TemplateId[]).filter(
        (t) => t !== prev && (uses.get(t) ?? 0) < (MAX_USES[t] ?? 1) && !(t === "desks" && total < 8)
      );
      if (!options.length) {
        ok = false;
        break;
      }
      const sum = options.reduce((a, t) => a + (WEIGHTS[t] ?? 0), 0);
      let r = rng() * sum;
      let chosen = options[0];
      for (const t of options) {
        r -= WEIGHTS[t] ?? 0;
        if (r <= 0) {
          chosen = t;
          break;
        }
      }
      seq.push(chosen);
      bump(chosen);
    }
    if (!ok) continue;
    seq.push("callback");
    const middle = seq.slice(1, -1);
    const talkShare = middle.filter((t) => TALK.has(t)).length / middle.length;
    const facts = new Set(seq.filter((t) => FACT_ROUNDS.has(t)));
    // At least two-thirds talk, at least two distinct key facts besides the hour,
    // and at least two different talk mechanics so episodes don't feel samey.
    const talkKinds = new Set(middle.filter((t) => TALK.has(t))).size;
    if (talkShare >= 2 / 3 && facts.size >= 2 && talkKinds >= 2) return seq;
  }
  return null;
}

/** Twist timings (seconds). */
export const TWIST = {
  /** Sources see their piece for this long, then have to describe it from memory. */
  flashSec: 30,
  /** Shorter round, earlier hint. */
  rushCapSec: 150,
  rushHintSec: 50,
} as const;
