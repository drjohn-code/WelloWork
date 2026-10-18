import { isTitleId, type ScoreComponents, type ScorecardResult } from "./types";

const COMPONENT_KEYS: Array<keyof ScoreComponents> = ["dataTransfer", "teamwork", "problemSolving", "focus", "memory"];

type ScoreRow = { player_id: string; share_eur: number; components: unknown; highlights: unknown };

/**
 * Shapes stored scores for one player. Everyone receives the same `team`
 * (names + titles, in seat order) and `teamAverage`; only the requesting
 * player's own amount and components are included, in `mine`. Ranks and
 * totals are never sent.
 */
export function buildScorecardResult(args: { meId: string; players: Array<{ id: string; name: string }>; scores: ScoreRow[] }): ScorecardResult {
  const byPlayer = new Map(args.scores.map((s) => [s.player_id, s]));
  // Older rows may hold retired medal keys; anything that isn't a current title is dropped.
  const titleOf = (row: ScoreRow | undefined) => (Array.isArray(row?.highlights) ? (row.highlights.find(isTitleId) ?? null) : null);
  const componentsOf = (row: ScoreRow) => row.components as ScoreComponents;

  const rows = args.scores;
  const teamAverage = Object.fromEntries(
    COMPONENT_KEYS.map((k) => [k, rows.length ? Math.round((10 * rows.reduce((a, r) => a + (Number(componentsOf(r)?.[k]) || 0), 0)) / rows.length) / 10 : 0])
  ) as ScoreComponents;

  const mine = byPlayer.get(args.meId);
  return {
    team: args.players.filter((p) => byPlayer.has(p.id)).map((p) => ({ id: p.id, name: p.name, title: titleOf(byPlayer.get(p.id)) })),
    teamAverage,
    mine: mine ? { shareEur: mine.share_eur, components: componentsOf(mine), title: titleOf(mine) } : null,
  };
}
