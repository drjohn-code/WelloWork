import { computePoolSplit, type TeamSize } from "../cognitive-rewards-order";
import { ROUND_DIFFICULTY } from "./templates";
import { seededRng } from "./rng";
import { TITLE_IDS, type PlayerScore, type ScoreComponents, type TemplateId, type TitleId } from "./types";

/**
 * Scoring (design §6). Inputs are the round outcomes and the contribution
 * ledger; everything is normalised against what was achievable in THIS game,
 * so a tough generation never shrinks the pool. The language model is not an
 * input anywhere here.
 */

export type RoundOutcome = {
  index: number;
  template: TemplateId;
  solverPlayerId: string;
  solved: boolean;
  solvedByReveal: boolean;
  wrongAttempts: number;
  hintUsed: boolean;
  stuck: boolean;
  acknowledged: string[];
  /** Players whose piece was auto-revealed because they disconnected (no assist credit). */
  disconnected: string[];
  durationSec: number;
};

export type Contribution = { roundIndex: number; playerId: string; solverPlayerId: string; kind: "assist" | "rescue" | "callback_source" | "detail" };

/**
 * Communication first: sharing your piece and helping the team carry 70% of a
 * score, solving and recall 30%. Companies buy this game for how people talk
 * and work together; the cognitive part only serves that.
 */
const WEIGHTS: ScoreComponents = { dataTransfer: 0.35, teamwork: 0.35, problemSolving: 0.15, focus: 0.075, memory: 0.075 };

export function computeScores(args: {
  playerIds: string[];
  rounds: RoundOutcome[];
  contributions: Contribution[];
  keyAttempts: number;
  poolEur: number;
  /** The game id: seeds the title tie-breaks so they differ between games. */
  seed: string;
}): PlayerScore[] {
  const { playerIds, rounds, contributions } = args;
  const n = playerIds.length;
  const by = <T>(init: () => T) => Object.fromEntries(playerIds.map((id) => [id, init()])) as Record<string, T>;

  // ── Raw signals ──
  const assists = by(() => 0);
  const reach = by(() => new Set<string>());
  const clear = by(() => 0); // assists on rounds solved with ≤1 wrong attempt
  const rescues = by(() => 0);
  const acks = by(() => 0);
  const received = by(() => 0); // assists received as solver
  const solveScore = by(() => 0);
  const solveMax = by(() => 0);
  const detail = by(() => 0);
  const memory = by(() => 0);
  const memoryMax = by(() => 0);

  const roundByIndex = new Map(rounds.map((r) => [r.index, r]));

  for (const c of contributions) {
    const r = roundByIndex.get(c.roundIndex);
    if (!r) continue;
    if (c.kind === "assist") {
      assists[c.playerId]++;
      reach[c.playerId].add(c.solverPlayerId);
      received[c.solverPlayerId]++;
      if (r.wrongAttempts <= 1) clear[c.playerId]++;
    } else if (c.kind === "rescue") rescues[c.playerId]++;
    else if (c.kind === "detail") detail[c.playerId]++;
    else if (c.kind === "callback_source") memory[c.playerId] += 0.5;
  }

  for (const r of rounds) {
    for (const id of r.acknowledged) acks[id]++;
    const w = ROUND_DIFFICULTY[r.template];
    solveMax[r.solverPlayerId] += w;
    if (r.solved && !r.solvedByReveal) {
      const accuracy = 1 / (1 + 0.25 * r.wrongAttempts);
      const hint = r.hintUsed ? 0.8 : 1;
      solveScore[r.solverPlayerId] += w * accuracy * hint;
    }
    if (r.template === "callback") {
      memoryMax[r.solverPlayerId] += 1;
      if (r.solved && !r.solvedByReveal) memory[r.solverPlayerId] += 1;
    }
  }

  // Maximums achievable in this game, per player.
  const sourceRounds = by(() => 0);
  for (const r of rounds) for (const id of playerIds) if (id !== r.solverPlayerId && r.template !== "callback") sourceRounds[id]++;
  const stuckRounds = rounds.filter((r) => r.stuck).length;

  // ── Team multiplier (0.7–1.3) ──
  const assistValues = playerIds.map((id) => assists[id]);
  const meanA = assistValues.reduce((a, b) => a + b, 0) / n || 0;
  const spread = meanA ? assistValues.reduce((a, v) => a + Math.abs(v - meanA), 0) / n / meanA : 0; // 0 = perfectly balanced
  const coverage = assistValues.every((v) => v > 0) ? 1 : 0.6;
  const convergence = args.keyAttempts <= 1 ? 1 : args.keyAttempts <= 3 ? 0.9 : 0.8;
  const teamMultiplier = Math.min(1.3, Math.max(0.7, (1 - Math.min(0.4, spread * 0.5)) * coverage * convergence + 0.3));

  // ── Components 0–100 ──
  const pct = (v: number, max: number) => (max > 0 ? Math.max(0, Math.min(100, (100 * v) / max)) : 0);
  const scores: PlayerScore[] = playerIds.map((id) => {
    const dataTransfer = 0.6 * pct(assists[id], sourceRounds[id]) + 0.2 * pct(reach[id].size, Math.min(n - 1, sourceRounds[id])) + 0.2 * pct(clear[id], sourceRounds[id]);
    const give = assists[id];
    const take = received[id];
    const balance = give + take > 0 ? 1 - Math.abs(give - take) / (give + take) : 0.5;
    const teamworkRaw = 0.5 * pct(rescues[id] + acks[id], Math.max(1, stuckRounds)) + 0.3 * balance * 100 + 0.2 * pct(assists[id], sourceRounds[id]);
    const teamwork = Math.min(100, teamworkRaw * teamMultiplier);
    const problemSolving = pct(solveScore[id], solveMax[id]);
    const focus = contributions.some((c) => c.kind === "detail") ? pct(detail[id], 1) : pct(assists[id], sourceRounds[id]) * 0.5 + (solveScore[id] > 0 ? 25 : 0);
    const mem = memoryMax[id] > 0 ? pct(memory[id], memoryMax[id]) : pct(memory[id], 0.5);
    const components: ScoreComponents = {
      dataTransfer: round1(dataTransfer),
      teamwork: round1(teamwork),
      problemSolving: round1(problemSolving),
      focus: round1(focus),
      memory: round1(mem),
    };
    const total = round1(
      components.dataTransfer * WEIGHTS.dataTransfer +
        components.teamwork * WEIGHTS.teamwork +
        components.problemSolving * WEIGHTS.problemSolving +
        components.focus * WEIGHTS.focus +
        components.memory * WEIGHTS.memory
    );
    return { playerId: id, components, total, shareEur: 0, rank: 0, title: TITLE_IDS[0] };
  });

  // ── Ranks ──
  const sorted = scores.slice().sort((a, b) => b.total - a.total);
  sorted.forEach((s, i) => (s.rank = i + 1));

  // ── Split: floors + remainder by score (design §6.3) ──
  const split = computePoolSplit(n as TeamSize, args.poolEur);
  const totalScore = scores.reduce((a, s) => a + s.total, 0);
  let distributed = 0;
  for (const s of scores) {
    const share = totalScore > 0 ? Math.floor((split.performancePart * s.total) / totalScore) : Math.floor(split.performancePart / n);
    s.shareEur = split.minPerPlayer + share;
    distributed += share;
  }
  const leftover = split.performancePart - distributed;
  if (leftover > 0) sorted[0].shareEur += leftover;

  // ── Titles: exactly one per player, none used twice ──
  // Each signal is normalised within this game (÷ the team's best), and every
  // player takes the title where they stand out most against the team mean.
  // Titles a player has some evidence for come before ones they have none for.
  // Ties are broken by a draw seeded with the game id, so no seat always wins.
  const solveTimes = by(() => [] as number[]);
  for (const r of rounds) if (r.solved && !r.solvedByReveal) solveTimes[r.solverPlayerId].push(Math.max(1, r.durationSec));
  const ratio = (v: number, max: number) => (max > 0 ? v / max : 0);
  const signals: Record<TitleId, (id: string) => number> = {
    connector: (id) => ratio(assists[id], sourceRounds[id]),
    clarity: (id) => ratio(clear[id], sourceRounds[id]),
    bridge: (id) => ratio(reach[id].size, Math.min(n - 1, sourceRounds[id])),
    rescuer: (id) => rescues[id] + acks[id],
    solver: (id) => ratio(solveScore[id], solveMax[id]),
    pace: (id) => ratio(solveTimes[id].length, solveTimes[id].reduce((a, b) => a + b, 0)), // 1 / mean solve time
    eagleEye: (id) => detail[id],
    memory: (id) => memory[id],
    glue: (id) => (assists[id] + received[id] > 0 ? 1 - Math.abs(assists[id] - received[id]) / (assists[id] + received[id]) : 0), // give/take balance
  };
  const rng = seededRng(`${args.seed}:titles`);
  const pairs: Array<{ playerId: string; title: TitleId; evidence: boolean; margin: number; draw: number }> = [];
  for (const title of TITLE_IDS) {
    const raw = playerIds.map((id) => Math.max(0, signals[title](id)));
    const best = Math.max(...raw);
    const norm = raw.map((v) => ratio(v, best));
    const mean = norm.reduce((a, b) => a + b, 0) / n;
    // Rounded so float noise doesn't decide what should be a seeded tie-break.
    playerIds.forEach((playerId, i) => pairs.push({ playerId, title, evidence: raw[i] > 0, margin: Math.round((norm[i] - mean) * 1e6), draw: rng() }));
  }
  pairs.sort((a, b) => Number(b.evidence) - Number(a.evidence) || b.margin - a.margin || a.draw - b.draw);
  const titled = new Set<string>();
  const used = new Set<TitleId>();
  for (const p of pairs) {
    if (titled.has(p.playerId) || used.has(p.title)) continue;
    scores.find((s) => s.playerId === p.playerId)!.title = p.title;
    titled.add(p.playerId);
    used.add(p.title);
  }

  return scores;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
