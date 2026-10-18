import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEpisodePath, teamStreak, type RoundSummaryRow } from "./path";
import { planEpisode } from "./episode";

const schedule = planEpisode({ gameId: "path-test", playerIds: ["p0", "p1", "p2", "p3", "p4"], worldId: "office", history: [] }).schedule;

function row(index: number, status: string, wrong = 0, hint = false): RoundSummaryRow {
  return { round_index: index, status, wrong_attempts: wrong, hint_used: hint };
}

test("path has one node per scheduled round, with its template and twist", () => {
  const path = buildEpisodePath(schedule, []);
  assert.equal(path.length, 10);
  path.forEach((node, i) => {
    assert.equal(node.template, schedule[i].template);
    assert.equal(node.twist, schedule[i].twist ?? null);
    assert.equal(node.status, "pending");
    assert.equal(node.clean, false);
  });
  assert.ok(path.some((n) => n.twist), "a 10-round episode has twists to mark");
});

test("path statuses and clean solves follow the round rows", () => {
  const path = buildEpisodePath(schedule, [row(0, "solved"), row(1, "solved", 1), row(2, "solved", 0, true), row(3, "failed"), row(4, "active"), row(5, "pending")]);
  assert.deepEqual(
    path.slice(0, 6).map((n) => [n.status, n.clean]),
    [["solved", true], ["solved", false], ["solved", false], ["failed", false], ["active", false], ["pending", false]]
  );
});

test("path nodes carry no pieces, prompts or answers", () => {
  const path = buildEpisodePath(schedule, [row(0, "solved")]);
  for (const node of path) assert.deepEqual(Object.keys(node).sort(), ["clean", "status", "template", "twist"]);
});

test("streak counts solved rounds back from the latest finished one", () => {
  const p = (rows: RoundSummaryRow[]) => teamStreak(buildEpisodePath(schedule, rows));
  assert.equal(p([]), 0);
  assert.equal(p([row(0, "active")]), 0);
  assert.equal(p([row(0, "solved"), row(1, "active")]), 1);
  assert.equal(p([row(0, "solved"), row(1, "solved")]), 2);
  assert.equal(p([row(0, "solved"), row(1, "failed"), row(2, "active")]), 0);
  assert.equal(p([row(0, "solved"), row(1, "failed"), row(2, "solved"), row(3, "solved", 3, true), row(4, "active")]), 2);
});
