import { test } from "node:test";
import assert from "node:assert/strict";
import { DETAIL_ROUND_INDEX, KEY_FACT_ROUNDS, buildKeyFacts, offerWorlds, planEpisode, tallyVotes } from "./episode";
import { generateRound, hintFor, normalizeAnswer } from "./templates";
import { LINEUP_SIZE, talkReveal } from "./talk";
import { TEXTS } from "./texts";
import { WORLD_IDS } from "./worlds";
import { CONTENT_LANGUAGES, INTAKE_QUESTIONS, type Fact, type IntakeSummary, type Piece, type RoundSpec } from "./types";

const SIZES = [3, 4, 5] as const;
const GAMES = 150;
const TALK = new Set(["common", "lineup", "blueprint", "replyall"]);
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

/**
 * Solves a round using nothing but what each seat's screen shows, the way a
 * team talking would. Returns null for rounds this helper does not model.
 */
function solveFromPieces(spec: RoundSpec, pieces: Record<string, Piece>, players: string[], snackName: string): string | null {
  const sources = players.filter((id) => id !== spec.solverPlayerId);
  switch (spec.template) {
    case "common": {
      const hands = sources.map((id) => pieces[id]).map((p) => (p.kind === "cards" ? p.cards : []));
      const inAll = hands[0].filter((c) => hands.every((h) => h.includes(c)));
      const board = pieces[spec.solverPlayerId];
      return inAll.length === 1 && board.kind === "board" && board.cards.includes(inAll[0]) ? inAll[0] : "AMBIGUOUS";
    }
    case "lineup": {
      const lp = pieces[spec.solverPlayerId];
      if (lp.kind !== "lineup") return "BAD";
      const clues = sources.flatMap((id) => {
        const p = pieces[id];
        return p.kind === "witness" ? p.features : [];
      });
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
    case "snack": {
      const own = pieces[spec.solverPlayerId];
      if (own.kind !== "shelf" || own.today === undefined) return "NO_TODAY";
      const today = own.today;
      return String(
        players.reduce((sum, id) => {
          const p = pieces[id];
          return sum + (p.kind === "shelf" ? p.items.filter((it) => it.name === snackName && it.bestBefore >= today).reduce((a, it) => a + it.count, 0) : 0);
        }, 0)
      );
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
      const middle = s.slice(1, -1).map((r) => r.template);
      assert.ok(middle.filter((t) => TALK.has(t)).length / middle.length >= 2 / 3, "at least two-thirds talk rounds");
      assert.ok(middle.some((t) => KEY_FACT_ROUNDS.has(t)), "a round the whole team can bring to the key ceremony");
      assert.ok(s.filter((r) => r.template === "desks").length <= (2 * n >= 8 ? 1 : 0), "at most one deduction round");
      const twists = s.filter((r) => r.twist);
      // One twist in 6 rounds; in longer episodes one of each kind where a round fits it.
      if (2 * n <= 6) assert.equal(twists.length, 1);
      else assert.ok(twists.length >= 1 && twists.length <= 2 && new Set(twists.map((r) => r.twist)).size === twists.length);
      for (const r of twists) assert.ok(r.index > DETAIL_ROUND_INDEX && r.index < s.length - 1, "twists stay off the opener, sticky note and memory round");
      assert.notEqual(plan.detailHolderId, s[DETAIL_ROUND_INDEX].solverPlayerId);
      assert.notEqual(plan.detailHolderId, s[s.length - 1].solverPlayerId);
    }
  }
});

test("QA fix 1: nobody solves two rounds in a row", () => {
  for (const n of SIZES) {
    for (let g = 0; g < 1000; g++) {
      const s = planEpisode({ gameId: `b2b-${n}-${g}`, playerIds: ids(n), worldId: "office", history: [] }).schedule;
      for (let i = 1; i < s.length; i++) assert.notEqual(s[i].solverPlayerId, s[i - 1].solverPlayerId, `game ${g}, rounds ${i} and ${i + 1}`);
    }
  }
});

test("QA fix 3: no repeated mechanic in 6- and 8-round episodes; in 10 rounds at most two, spaced apart", () => {
  for (const n of SIZES) {
    for (let g = 0; g < 1000; g++) {
      const middle = planEpisode({ gameId: `rep-${n}-${g}`, playerIds: ids(n), worldId: "office", history: [] }).schedule.slice(1, -1);
      const byTemplate = new Map<string, number[]>();
      middle.forEach((r) => byTemplate.set(r.template, [...(byTemplate.get(r.template) ?? []), r.index]));
      const repeated = [...byTemplate.entries()].filter(([, at]) => at.length > 1);
      if (n < 5) assert.equal(repeated.length, 0, `${n} players: ${middle.map((r) => r.template)}`);
      else {
        assert.ok(repeated.length <= 2, "at most two repeats");
        for (const [t, at] of repeated) {
          assert.equal(at.length, 2, `${t} used at most twice`);
          assert.ok(TALK.has(t), `${t} is a talk mechanic`);
          assert.ok(at[1] - at[0] >= 3, `${t} repeats at least three rounds apart`);
        }
      }
    }
  }
});

test("QA fixes 6 and 7: flash only on line-up and card rounds; no rush on a 5-player card round", () => {
  for (const n of SIZES) {
    for (let g = 0; g < 1000; g++) {
      for (const r of planEpisode({ gameId: `tw-${n}-${g}`, playerIds: ids(n), worldId: "office", history: [] }).schedule) {
        if (r.twist === "flash") assert.ok(r.template === "common" || r.template === "lineup", `flash on ${r.template}`);
        if (r.twist === "rush" && n === 5) assert.notEqual(r.template, "common");
      }
    }
  }
});

test("every round generates, validates and is solvable from the screens alone (all languages, all worlds)", () => {
  for (const n of SIZES) {
    const players = ids(n).map((id, i) => ({ id, name: NAMES[i] }));
    for (let g = 0; g < GAMES; g++) {
      const gameId = `gen-${n}-${g}`;
      const worldId = WORLD_IDS[g % WORLD_IDS.length];
      const lang = CONTENT_LANGUAGES[g % CONTENT_LANGUAGES.length];
      const skin = worldId === "station" ? SKIN : undefined;
      const intake = intakeFor(lang);
      const plan = planEpisode({ gameId, playerIds: ids(n), worldId, history: [] });
      const priorFacts: Array<Fact & { roundIndex: number; holderId?: string }> = [];
      for (const spec of plan.schedule) {
        const round = generateRound(spec.template, {
          gameId,
          roundIndex: spec.index,
          language: lang,
          players,
          solverId: spec.solverPlayerId,
          intake,
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
          priorFacts.push({ key: "note", label: TEXTS[lang].facts.note, value: String(round.params.detail.value), roundIndex: spec.index, holderId: round.params.detail.playerId });
        }
        const solved = solveFromPieces(spec, round.pieces, ids(n), intake.canonical.q2);
        if (solved !== null) assert.equal(normalizeAnswer(solved), normalizeAnswer(round.answer), `${gameId} round ${spec.index} (${spec.template})`);
        if (spec.template === "common" || spec.template === "lineup" || spec.template === "blueprint") {
          const hint = hintFor(spec.template, lang, round.answer, round.params as Record<string, unknown>);
          assert.ok(hint && !hint.includes("{"), "hint fully filled");
          assert.doesNotMatch(talkReveal(spec.template, lang, round.params as Record<string, unknown>, round.answer), /undefined/);
        }
        if (skin && spec.template === "wifi") assert.ok(round.publicPrompt.text.includes(SKIN.codeName));
      }
      // QA fix 2: three key facts the whole team heard, never a line-up position.
      const key = buildKeyFacts(priorFacts, TEXTS[lang].facts.memory);
      assert.equal(key.length, 3);
      assert.equal(key[0].key, "hour");
      assert.ok(["snackTotal", "wifi", "desks", "memory"].includes(key[1].key));
      assert.equal(key[2].key, "note");
      assert.ok(key.every((f) => f.key !== "lineup"));
    }
  }
});

test("QA fix 4: snack shelves need talking (only the solver knows today), witnesses in 3-player teams hold two details", () => {
  for (const n of SIZES) {
    const players = ids(n).map((id, i) => ({ id, name: NAMES[i] }));
    for (let g = 0; g < 200; g++) {
      const ctx = { gameId: `four-${n}-${g}`, roundIndex: 3, language: "en" as const, players, solverId: "p0", intake: intakeFor("en"), priorFacts: [] };
      const snack = generateRound("snack", ctx);
      for (const id of ids(n)) {
        const p = snack.pieces[id];
        assert.equal(p.kind, "shelf");
        if (p.kind === "shelf") assert.equal(p.today !== undefined, id === "p0", "only the solver's shelf shows today's date");
      }
      const today = (snack.pieces.p0 as Extract<Piece, { kind: "shelf" }>).today!;
      assert.ok(
        Object.values(snack.pieces).some((p) => p.kind === "shelf" && p.items.some((it) => it.name === ctx.intake.canonical.q2 && it.bestBefore < today)),
        "something has expired, so today's date matters"
      );
      const lineup = generateRound("lineup", ctx);
      for (const id of ids(n).slice(1)) {
        const w = lineup.pieces[id];
        assert.equal(w.kind, "witness");
        if (w.kind === "witness") assert.equal(w.features.length, n === 3 ? 2 : 1);
      }
    }
  }
});

test("QA fix 5: tap-to-answer rounds are hard to guess (line-up of 8, card board of 32)", () => {
  const players = ids(4).map((id, i) => ({ id, name: NAMES[i] }));
  for (const worldId of WORLD_IDS) {
    const ctx = { gameId: `guess-${worldId}`, roundIndex: 2, language: "en" as const, players, solverId: "p1", intake: intakeFor("en"), priorFacts: [], worldId };
    const lineup = generateRound("lineup", ctx);
    const lp = lineup.pieces.p1;
    assert.ok(lp.kind === "lineup" && lp.faces.length === LINEUP_SIZE && LINEUP_SIZE === 8);
    const common = generateRound("common", ctx);
    const board = common.pieces.p1;
    assert.ok(board.kind === "board" && board.cards.length === 32 && new Set(board.cards).size === 32);
    assert.ok(Object.entries(common.pieces).every(([id, p]) => (id === "p1" ? p.kind === "board" : p.kind === "cards")), "the solver holds the board, not a hand");
    assert.equal(lineup.publicPrompt.maxWrong, 2);
    assert.equal(common.publicPrompt.maxWrong, 2);
  }
});

test("QA fix 8: every language has the final-challenge bonus line", () => {
  for (const lang of CONTENT_LANGUAGES) assert.ok(TEXTS[lang].challengeBonus.length > 20, lang);
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
