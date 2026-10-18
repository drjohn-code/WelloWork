import { test } from "node:test";
import assert from "node:assert/strict";
import { DETAIL_ROUND_INDEX, offerWorlds, planEpisode, tallyVotes } from "./episode";
import { generateRound, hintFor, normalizeAnswer } from "./templates";
import { talkReveal } from "./talk";
import { TEXTS } from "./texts";
import { WORLD_IDS } from "./worlds";
import { CONTENT_LANGUAGES, INTAKE_QUESTIONS, type Fact, type IntakeSummary, type Piece, type RoundSpec } from "./types";

const SIZES = [3, 4, 5] as const;
const GAMES = 150;
const TALK = new Set(["common", "lineup", "blueprint", "replyall"]);
const FACT_ROUNDS = new Set(["snack", "wifi", "desks", "lineup"]);
const FLASHABLE = new Set(["common", "lineup", "blueprint", "snack"]);
const KEY_ORDER = ["hour", "snackTotal", "wifi", "lineup", "desks"];
const NAMES = ["Anna", "Björn", "Chiara", "Dovydas", "Eva"];
const SKIN = {
  codeName: "the airlock keypad",
  shelves: ["Cargo bay", "Galley", "Airlock locker", "Lab fridge", "Docking bay"],
  decoys: ["dried peas", "vacuum tea", "freeze-dried soup", "space crackers"],
  thread: ["Docking moved again.", "Who opened the galley hatch?", "Stop replying all on the intercom.", "Is the computer down?", "Found it behind the panel.", "Take this to the airlock?", "Mission control says hi."],
  note: "Taped to the airlock window: spare oxygen in locker {n}",
};

function ids(n: number) {
  return Array.from({ length: n }, (_, i) => `p${i}`);
}

function intakeFor(lang: (typeof CONTENT_LANGUAGES)[number]): IntakeSummary {
  const d = TEXTS[lang].intakeDefaults;
  return {
    canonical: Object.fromEntries(INTAKE_QUESTIONS.map((k) => [k, d[k]])) as IntakeSummary["canonical"],
    all: Object.fromEntries(INTAKE_QUESTIONS.map((k) => [k, [d[k]]])) as IntakeSummary["all"],
  };
}

/** Solves a talk round using nothing but the pieces, the way a team talking would. */
function solveFromPieces(spec: RoundSpec, pieces: Record<string, Piece>, players: string[]): string | null {
  switch (spec.template) {
    case "common": {
      const hands = players.map((id) => (pieces[id].kind === "cards" ? (pieces[id] as { cards: string[] }).cards : []));
      const inAll = hands[0].filter((c) => hands.every((h) => h.includes(c)));
      return inAll.length === 1 ? inAll[0] : "AMBIGUOUS";
    }
    case "lineup": {
      const lp = pieces[spec.solverPlayerId];
      if (lp.kind !== "lineup") return "BAD";
      const clues = players.filter((id) => id !== spec.solverPlayerId).flatMap((id) => (pieces[id].kind === "witness" ? [pieces[id] as { feature: string; value: string }] : []));
      const m = lp.faces.map((f, i) => ({ f, i })).filter(({ f }) => clues.every((c) => (f as Record<string, string>)[c.feature] === c.value));
      return m.length === 1 ? String(m[0].i + 1) : "AMBIGUOUS";
    }
    case "blueprint": {
      const rows = new Map<number, number[]>();
      for (const id of players) {
        const p = pieces[id];
        if (p.kind === "tiles") for (const r of p.rows) rows.set(r.row, r.tiles);
      }
      return [...rows.keys()].sort((a, b) => a - b).map((k) => rows.get(k)!.join("")).join("");
    }
    default:
      return null;
  }
}

test("episode plans keep their structural promises (3/4/5 players, every world)", () => {
  for (const n of SIZES) {
    for (let g = 0; g < GAMES; g++) {
      const plan = planEpisode({ gameId: `plan-${n}-${g}`, playerIds: ids(n), worldId: WORLD_IDS[g % WORLD_IDS.length], history: [] });
      const s = plan.schedule;
      assert.equal(s.length, 2 * n);
      assert.equal(s[0].template, "slot");
      assert.equal(s[s.length - 1].template, "callback");
      for (const id of ids(n)) assert.equal(s.filter((r) => r.solverPlayerId === id).length, 2, "everyone solves twice");
      for (let i = 1; i < s.length; i++) assert.notEqual(s[i].template, s[i - 1].template, "no back-to-back repeats");
      const middle = s.slice(1, -1).map((r) => r.template);
      assert.ok(middle.filter((t) => TALK.has(t)).length / middle.length >= 2 / 3, "at least two-thirds talk rounds");
      assert.ok(new Set(s.map((r) => r.template).filter((t) => FACT_ROUNDS.has(t))).size >= 2, "enough key facts");
      assert.ok(s.filter((r) => r.template === "desks").length <= (2 * n >= 8 ? 1 : 0), "at most one deduction round");
      const twists = s.filter((r) => r.twist);
      assert.equal(twists.length, 2 * n <= 6 ? 1 : 2);
      for (const r of twists) {
        assert.ok(r.index > DETAIL_ROUND_INDEX && r.index < s.length - 1, "twists stay off the opener, sticky note and memory round");
        if (r.twist === "flash") assert.ok(FLASHABLE.has(r.template), "flash only on picture rounds");
      }
      assert.notEqual(plan.detailHolderId, s[DETAIL_ROUND_INDEX].solverPlayerId);
      assert.notEqual(plan.detailHolderId, s[s.length - 1].solverPlayerId);
    }
  }
});

test("every round generates, validates and is solvable from the pieces alone (all languages, all worlds)", () => {
  for (const n of SIZES) {
    const players = ids(n).map((id, i) => ({ id, name: NAMES[i] }));
    for (let g = 0; g < GAMES; g++) {
      const gameId = `gen-${n}-${g}`;
      const worldId = WORLD_IDS[g % WORLD_IDS.length];
      const lang = CONTENT_LANGUAGES[g % CONTENT_LANGUAGES.length];
      const skin = worldId === "station" ? SKIN : undefined;
      const plan = planEpisode({ gameId, playerIds: ids(n), worldId, history: [] });
      const priorFacts: Array<Fact & { roundIndex: number; holderId?: string }> = [];
      for (const spec of plan.schedule) {
        const round = generateRound(spec.template, {
          gameId,
          roundIndex: spec.index,
          language: lang,
          players,
          solverId: spec.solverPlayerId,
          intake: intakeFor(lang),
          priorFacts,
          detailHolderId: spec.detail ? plan.detailHolderId : undefined,
          worldId,
          skin,
        });
        assert.ok(normalizeAnswer(round.answer));
        for (const f of round.params.facts) if (!priorFacts.some((pf) => pf.key === f.key)) priorFacts.push({ ...f, roundIndex: spec.index });
        if (round.params.detail) {
          assert.equal(spec.index, DETAIL_ROUND_INDEX);
          if (skin) assert.match(round.params.detail.text, /locker \d{3}$/);
          priorFacts.push({ key: "note", label: "note", value: String(round.params.detail.value), roundIndex: spec.index, holderId: round.params.detail.playerId });
        }
        const solved = solveFromPieces(spec, round.pieces, ids(n));
        if (solved !== null) {
          assert.equal(normalizeAnswer(solved), normalizeAnswer(round.answer), `${gameId} round ${spec.index} (${spec.template})`);
          const hint = hintFor(spec.template, lang, round.answer, round.params as Record<string, unknown>);
          assert.ok(hint && !hint.includes("{"), "hint fully filled");
          assert.doesNotMatch(talkReveal(spec.template as "common", lang, round.params as Record<string, unknown>, round.answer), /undefined/);
        }
        if (skin && spec.template === "wifi") assert.ok(round.publicPrompt.text.includes(SKIN.codeName));
      }
      assert.ok(KEY_ORDER.filter((k) => priorFacts.some((f) => f.key === k)).length >= 3, "the key ceremony has three facts");
    }
  }
});

test("the vote: offers unplayed worlds first, majority wins, host breaks ties", () => {
  const offer = offerWorlds("vote-1", []);
  assert.equal(new Set(offer).size, 3);
  const later = offerWorlds("vote-1", [{ worldId: offer[0], premise: 0, title: "x", number: 1, endedAt: "2026-10-01T00:00:00Z", sameTeam: true }]);
  assert.ok(!later.slice(0, WORLD_IDS.length - 1).includes(offer[0]), "a played world is only offered once the unplayed ones run out");
  assert.equal(tallyVotes("vote-1", offer, { a: offer[1], b: offer[1], c: offer[2] }, "c"), offer[1]);
  assert.equal(tallyVotes("vote-1", offer, { a: offer[1], c: offer[2] }, "c"), offer[2]);
  assert.ok(offer.includes(tallyVotes("vote-1", offer, { a: "surprise" }, "a")));
});

test("a returning team continues its series with a premise it hasn't had", () => {
  const plan = planEpisode({
    gameId: "series-1",
    playerIds: ids(3),
    worldId: "heist",
    history: [
      { worldId: "heist", premise: 0, title: "The Coffee Job", number: 1, endedAt: "2026-10-01T00:00:00Z", sameTeam: true },
      { worldId: "heist", premise: 1, title: "Trophy Night", number: 2, endedAt: "2026-10-08T00:00:00Z", sameTeam: true },
      { worldId: "studio", premise: 2, title: "Someone else's show", number: 4, endedAt: "2026-10-09T00:00:00Z", sameTeam: false },
    ],
  });
  assert.equal(plan.number, 3);
  assert.equal(plan.previous?.title, "Trophy Night");
  assert.ok(![0, 1].includes(plan.premise));
});
