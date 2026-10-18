import { test } from "node:test";
import assert from "node:assert/strict";
import { computePoolSplit, type TeamSize } from "../cognitive-rewards-order";
import { computeScores, type Contribution, type RoundOutcome } from "./scoring";
import { buildScorecardResult } from "./scorecard-view";
import { planEpisode } from "./episode";
import { seededRng } from "./rng";
import { TITLE_IDS } from "./types";

const SIZES = [3, 4, 5] as const;
const POOL = 737;

function playerIds(n: number) {
  return Array.from({ length: n }, (_, i) => `p${i}`);
}

/** A game where nothing was solved and nobody contributed: every signal is zero. */
function zeroGame(n: number, gameId: string) {
  const ids = playerIds(n);
  const rounds: RoundOutcome[] = planEpisode({ gameId: gameId, playerIds: ids, worldId: "office", history: [] }).schedule.map((r) => ({
    index: r.index,
    template: r.template,
    solverPlayerId: r.solverPlayerId,
    solved: false,
    solvedByReveal: true,
    wrongAttempts: 5,
    hintUsed: true,
    stuck: false,
    acknowledged: [],
    disconnected: [],
    durationSec: 270,
  }));
  return { playerIds: ids, rounds, contributions: [] as Contribution[] };
}

/** A plausible game: most rounds solved, most pieces passed on, the odd rescue, detail catch and callback. */
function randomGame(n: number, gameId: string) {
  const ids = playerIds(n);
  const rng = seededRng(`${gameId}:test`);
  const { schedule, detailHolderId } = planEpisode({ gameId: gameId, playerIds: ids, worldId: "office", history: [] });
  const rounds: RoundOutcome[] = [];
  const contributions: Contribution[] = [];
  for (const r of schedule) {
    const others = ids.filter((id) => id !== r.solverPlayerId);
    const solved = rng() < 0.8;
    const stuck = rng() < 0.25;
    const acknowledged = stuck ? others.filter(() => rng() < 0.5) : [];
    rounds.push({
      index: r.index,
      template: r.template,
      solverPlayerId: r.solverPlayerId,
      solved,
      solvedByReveal: !solved,
      wrongAttempts: Math.floor(rng() * 4),
      hintUsed: rng() < 0.3,
      stuck,
      acknowledged,
      disconnected: [],
      durationSec: 30 + Math.floor(rng() * 240),
    });
    if (!solved) continue;
    if (r.template === "callback") {
      if (rng() < 0.7) contributions.push({ roundIndex: r.index, playerId: detailHolderId, solverPlayerId: r.solverPlayerId, kind: "callback_source" });
      continue;
    }
    for (const id of others) if (rng() < 0.85) contributions.push({ roundIndex: r.index, playerId: id, solverPlayerId: r.solverPlayerId, kind: "assist" });
    if (acknowledged.length && rng() < 0.6) contributions.push({ roundIndex: r.index, playerId: acknowledged[0], solverPlayerId: r.solverPlayerId, kind: "rescue" });
    if (r.detail && rng() < 0.7) contributions.push({ roundIndex: r.index, playerId: detailHolderId, solverPlayerId: r.solverPlayerId, kind: "detail" });
  }
  return { playerIds: ids, rounds, contributions };
}

function score(game: ReturnType<typeof zeroGame>, seed: string) {
  return computeScores({ ...game, keyAttempts: 1, poolEur: POOL, seed });
}

function assertOneUniqueTitleEach(scores: ReturnType<typeof score>, n: number, label: string) {
  assert.equal(scores.length, n, label);
  const titles = scores.map((s) => s.title);
  for (const t of titles) assert.ok((TITLE_IDS as readonly string[]).includes(t), `${label}: unknown title ${t}`);
  assert.equal(new Set(titles).size, n, `${label}: duplicate title in ${titles.join(", ")}`);
}

function assertSplitUnchanged(scores: ReturnType<typeof score>, n: number, label: string) {
  const { minPerPlayer } = computePoolSplit(n as TeamSize, POOL);
  assert.equal(scores.reduce((a, s) => a + s.shareEur, 0), POOL, `${label}: shares must add up to the pool`);
  for (const s of scores) assert.ok(s.shareEur >= minPerPlayer, `${label}: share below the guaranteed minimum`);
  assert.deepEqual(scores.map((s) => s.rank).sort(), playerIds(n).map((_, i) => i + 1), `${label}: ranks must be 1..n`);
}

test("every player gets exactly one title and no title repeats (3/4/5 players, 300 games each)", () => {
  for (const n of SIZES) {
    for (let g = 0; g < 300; g++) {
      const id = `game-${n}-${g}`;
      const scores = score(randomGame(n, id), id);
      assertOneUniqueTitleEach(scores, n, id);
      assertSplitUnchanged(scores, n, id);
    }
  }
});

test("the all-zero game still gives everyone one unique title", () => {
  for (const n of SIZES) {
    for (let g = 0; g < 50; g++) {
      const id = `zero-${n}-${g}`;
      const scores = score(zeroGame(n, id), id);
      assertOneUniqueTitleEach(scores, n, id);
      assertSplitUnchanged(scores, n, id);
    }
  }
});

test("titles are deterministic for a game, and ties don't always go to the same seat", () => {
  for (const n of SIZES) {
    const game = zeroGame(n, "fixed-schedule");
    assert.deepEqual(
      score(game, "same-seed").map((s) => s.title),
      score(game, "same-seed").map((s) => s.title)
    );
    // All-zero means every pair ties; the seed alone decides. Seat 0 must not get the same title every time.
    const seen = new Set(Array.from({ length: 40 }, (_, i) => score(game, `seed-${i}`)[0].title));
    assert.ok(seen.size > 1, `${n} players: seat 0 always got ${[...seen][0]}`);
  }
});

test("a player with evidence for a title gets one they have evidence for", () => {
  for (const n of SIZES) {
    const game = zeroGame(n, "evidence");
    // Only p1 caught the sticky note; everything else is zero.
    game.contributions.push({ roundIndex: 1, playerId: "p1", solverPlayerId: game.rounds[1].solverPlayerId, kind: "detail" });
    for (let i = 0; i < 20; i++) {
      const scores = score(game, `ev-${i}`);
      assert.equal(scores.find((s) => s.playerId === "p1")!.title, "eagleEye");
      assertOneUniqueTitleEach(scores, n, `evidence-${n}-${i}`);
    }
  }
});

test("the scorecard payload carries no other player's money, rank or components", () => {
  for (const n of SIZES) {
    const id = `payload-${n}`;
    const game = randomGame(n, id);
    const scores = score(game, id);
    const rows = scores.map((s) => ({ player_id: s.playerId, share_eur: s.shareEur, components: s.components, highlights: [s.title], total: s.total, rank: s.rank }));
    const players = game.playerIds.map((pid) => ({ id: pid, name: `Player ${pid}` }));
    for (const me of scores) {
      const result = buildScorecardResult({ meId: me.playerId, players, scores: rows });
      // Shared part: names + titles only, in seat order.
      assert.deepEqual(result.team.map((p) => p.id), game.playerIds);
      for (const p of result.team) assert.deepEqual(Object.keys(p).sort(), ["id", "name", "title"]);
      assert.deepEqual(result.team.map((p) => p.title), game.playerIds.map((pid) => scores.find((s) => s.playerId === pid)!.title));
      // Personal part: mine only.
      assert.deepEqual(result.mine, { shareEur: me.shareEur, components: me.components, title: me.title });
      const json = JSON.stringify(result);
      assert.ok(!/"rank"|"total"/.test(json), "rank or total leaked");
      assert.equal(json.match(/"shareEur"/g)?.length, 1, "exactly one shareEur (mine)");
      assert.equal(json.match(/"components"/g)?.length, 1, "exactly one components object (mine)");
    }
  }
});

test("retired medal keys in older score rows are dropped, current ones kept", () => {
  const players = [{ id: "a", name: "A" }, { id: "b", name: "B" }];
  const comps = { dataTransfer: 50, teamwork: 40, problemSolving: 30, focus: 20, memory: 10 };
  const result = buildScorecardResult({
    meId: "a",
    players,
    scores: [
      { player_id: "a", share_eur: 60, components: comps, highlights: ["mvp", "helper"] },
      { player_id: "b", share_eur: 40, components: { ...comps, memory: 30 }, highlights: ["rescuer"] },
    ],
  });
  assert.deepEqual(result.team, [{ id: "a", name: "A", title: null }, { id: "b", name: "B", title: "rescuer" }]);
  assert.equal(result.teamAverage.memory, 20);
  assert.equal(result.mine?.title, null);
});
