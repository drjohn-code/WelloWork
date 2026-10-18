import type { PathNode, RoundSpec } from "./types";

/** The round columns the path needs: no pieces, prompts or answers. */
export type RoundSummaryRow = { round_index: number; status: string; wrong_attempts: number; hint_used: boolean };

/** One node per scheduled round, in order. Rounds without a row yet are pending. */
export function buildEpisodePath(schedule: RoundSpec[], rows: RoundSummaryRow[]): PathNode[] {
  const byIndex = new Map(rows.map((r) => [r.round_index, r]));
  return [...schedule]
    .sort((a, b) => a.index - b.index)
    .map((spec) => {
      const row = byIndex.get(spec.index);
      const status: PathNode["status"] = row?.status === "solved" || row?.status === "failed" || row?.status === "active" ? row.status : "pending";
      return { template: spec.template, twist: spec.twist ?? null, status, clean: status === "solved" && row!.wrong_attempts === 0 && !row!.hint_used };
    });
}

/** Solved rounds in a row, counted back from the latest finished round; a miss resets it to 0. */
export function teamStreak(path: PathNode[]): number {
  let streak = 0;
  for (let i = path.length - 1; i >= 0; i--) {
    const s = path[i].status;
    if (s === "pending" || s === "active") continue;
    if (s === "failed") break;
    streak++;
  }
  return streak;
}
