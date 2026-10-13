import { seededRng, shuffle } from "./rng";
import type { RoundSpec, TemplateId } from "./types";

/**
 * Round plan per team size: everyone solves exactly twice (2n rounds). The
 * detail catch is planted in round 2 (a snack round) on a non-solver, and the
 * final round is the memory callback, solved by someone other than the
 * detail holder so the recall has to cross players.
 */
// Difficulty arc: two warm-ups, a letter puzzle, a sequencing one, a real deduction, then memory.
const SEQUENCES: Record<number, TemplateId[]> = {
  3: ["slot", "snack", "wifi", "replyall", "desks", "callback"],
  4: ["slot", "snack", "wifi", "replyall", "desks", "snack", "wifi", "callback"],
  5: ["slot", "snack", "wifi", "replyall", "desks", "snack", "wifi", "replyall", "desks", "callback"],
};

export const DETAIL_ROUND_INDEX = 1;

export function buildSchedule(gameId: string, playerIds: string[]): { schedule: RoundSpec[]; detailHolderId: string } {
  const templates = SEQUENCES[playerIds.length];
  if (!templates) throw new Error(`Unsupported team size ${playerIds.length}`);
  const rng = seededRng(`${gameId}:schedule`);
  const order = [...shuffle(rng, playerIds), ...shuffle(rng, playerIds)];
  const schedule: RoundSpec[] = templates.map((template, index) => ({
    index,
    template,
    solverPlayerId: order[index],
    detail: index === DETAIL_ROUND_INDEX,
  }));
  // Detail holder: a non-solver of the detail round who is not the callback solver.
  const callbackSolver = schedule[schedule.length - 1].solverPlayerId;
  const detailSolver = schedule[DETAIL_ROUND_INDEX].solverPlayerId;
  const candidates = playerIds.filter((id) => id !== detailSolver && id !== callbackSolver);
  const detailHolderId = candidates.length ? candidates[Math.floor(rng() * candidates.length)] : playerIds.find((id) => id !== detailSolver)!;
  return { schedule, detailHolderId };
}
