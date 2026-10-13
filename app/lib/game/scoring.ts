import { computePoolSplit, type TeamSize } from "../cognitive-rewards-order";
import { ROUND_DIFFICULTY } from "./templates";
import type { PlayerScore, ScoreComponents, TemplateId } from "./types";

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

const WEIGHTS: ScoreComponents = { dataTransfer: 0.3, teamwork: 0.3, problemSolving: 0.2, focus: 0.1, memory: 0.1 };

export function computeScores(args: {
  playerIds: string[];
  rounds: RoundOutcome[];
  contributions: Contribution[];
  keyAttempts: number;
  poolEur: number;
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
    return { playerId: id, components, total, shareEur: 0, rank: 0, highlights: [] };
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

  // ── Highlights ──
  // First place always gets the MVP crown; category medals go to the top raw count (ties → higher total).
  sorted[0].highlights.push("mvp");
  const most = (key: (s: PlayerScore) => number) => sorted.slice().sort((a, b) => key(b) - key(a))[0];
  most((s) => assists[s.playerId]).highlights.push("helper");
  most((s) => s.components.problemSolving).highlights.push("solver");
  const rescuer = most((s) => rescues[s.playerId]);
  if (rescues[rescuer.playerId] > 0) rescuer.highlights.push("rescuer");
  const rememberer = most((s) => memory[s.playerId]);
  if (memory[rememberer.playerId] >= 1) rememberer.highlights.push("memory");

  return scores;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
