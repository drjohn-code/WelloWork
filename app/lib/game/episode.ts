import { seededRng, shuffle } from "./rng";
import { WORLDS, WORLD_IDS, type WorldId } from "./worlds";
import type { Fact, RoundSpec, TemplateId, Twist } from "./types";

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
/**
 * Rounds whose answer the whole team hears and can bring to the key ceremony.
 * (A line-up answer is a position only the solver saw, so it never counts.)
 */
export const KEY_FACT_ROUNDS: ReadonlySet<TemplateId> = new Set<TemplateId>(["snack", "wifi", "desks"]);
const WEIGHTS: Partial<Record<TemplateId, number>> = { common: 3, lineup: 3, blueprint: 3, replyall: 2, snack: 2, wifi: 1, desks: 1 };
/** 10-round episodes have more talk slots than there are talk mechanics, so a few may repeat. */
const MAX_REPEATS_LONG = 2;
const MIN_REPEAT_GAP = 3;
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

  // Solvers: everyone twice, in two shuffled passes, never the same person twice in a row.
  const first = shuffle(rng, playerIds);
  const second = shuffle(rng, playerIds);
  if (second[0] === first[first.length - 1]) [second[0], second[1]] = [second[1], second[0]];
  const order = [...first, ...second];
  const schedule: RoundSpec[] = templates.map((template, index) => ({ index, template, solverPlayerId: order[index], detail: index === DETAIL_ROUND_INDEX }));

  // Twists: one in a 6-round episode, two (one of each) in longer ones. Never
  // on the opener, the sticky-note round or the memory round.
  const eligible = schedule.filter((r) => r.index > DETAIL_ROUND_INDEX && r.index < total - 1);
  // If the preferred kind has no round it fits (flash needs a line-up or card round), use the other.
  const twists = shuffle(rng, ["flash", "rush"] as Twist[]);
  const wanted = total <= 6 ? 1 : 2;
  const used = new Set<number>();
  for (const twist of twists) {
    if (used.size >= wanted) break;
    const fits = eligible.filter((r) => !used.has(r.index) && twistFits(twist, r.template, n));
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

/**
 * Flash only where a piece is a picture you can take in at a glance (a hand of
 * cards, one face detail); a grid of tiles from memory frustrates more than it
 * thrills. Rush never on a 5-player card round: about thirty cards to compare.
 */
const FLASHABLE: ReadonlySet<TemplateId> = new Set<TemplateId>(["common", "lineup"]);
export function twistFits(twist: Twist, template: TemplateId, teamSize: number): boolean {
  if (twist === "flash") return FLASHABLE.has(template);
  return !(template === "common" && teamSize >= 5);
}

/**
 * slot first (its hour feeds the memory round and the key), a light round
 * second (it carries the sticky note), memory last; the middle is sampled.
 */
function sampleSequence(rng: () => number, total: number): TemplateId[] | null {
  const middleCount = total - 3;
  // 6 and 8 rounds: every mechanic at most once. 10 rounds: a talk mechanic may come back, spaced out.
  const maxUses = (t: TemplateId) => (total > 8 && TALK.has(t) ? 2 : 1);
  for (let attempt = 0; attempt < 2000; attempt++) {
    const uses = new Map<TemplateId, number>();
    const lastAt = new Map<TemplateId, number>();
    const seq: TemplateId[] = ["slot"];
    const push = (t: TemplateId) => {
      uses.set(t, (uses.get(t) ?? 0) + 1);
      lastAt.set(t, seq.length);
      seq.push(t);
    };
    push(DETAIL_HOSTS[Math.floor(rng() * DETAIL_HOSTS.length)]);
    let ok = true;
    for (let i = 0; i < middleCount; i++) {
      const at = seq.length;
      const options = (Object.keys(WEIGHTS) as TemplateId[]).filter(
        (t) =>
          (uses.get(t) ?? 0) < maxUses(t) &&
          (!lastAt.has(t) || at - lastAt.get(t)! >= MIN_REPEAT_GAP) &&
          !(t === "desks" && total < 8)
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
      push(chosen);
    }
    if (!ok) continue;
    seq.push("callback");
    const middle = seq.slice(1, -1);
    const talkShare = middle.filter((t) => TALK.has(t)).length / middle.length;
    const repeats = middle.length - new Set(middle).size;
    const talkKinds = new Set(middle.filter((t) => TALK.has(t))).size;
    // At least two-thirds talk, at least two different talk mechanics, a round the
    // whole team can bring to the key ceremony, and few, well-spaced repeats.
    if (talkShare >= 2 / 3 && talkKinds >= 2 && middle.some((t) => KEY_FACT_ROUNDS.has(t)) && repeats <= (total > 8 ? MAX_REPEATS_LONG : 0)) return seq;
  }
  return null;
}

/**
 * The three key-ceremony facts, in the order the blanks are shown: the free
 * hour (round 1), one counted or rebuilt answer the team heard, and the
 * sticky-note number read out in the memory round. A line-up position is never
 * used: only the solver ever saw those numbers.
 */
export function buildKeyFacts(priorFacts: Fact[], memoryLabel: string): Fact[] {
  const find = (key: string) => priorFacts.find((f) => f.key === key);
  const hour = find("hour");
  const note = find("note");
  const middle =
    ["snackTotal", "wifi", "desks"].map(find).find((f): f is Fact => Boolean(f)) ??
    (hour && note ? { key: "memory", label: memoryLabel, value: String(Number(hour.value) + Number(note.value)) } : undefined);
  return [hour, middle, note].filter((f): f is Fact => Boolean(f));
}

/** Twist timings (seconds). */
export const TWIST = {
  /** Sources see their piece for this long, then have to describe it from memory. */
  flashSec: 30,
  /** Shorter round, earlier hint. */
  rushCapSec: 150,
  rushHintSec: 50,
} as const;
