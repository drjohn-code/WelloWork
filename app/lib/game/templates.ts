import { pick, randInt, seededRng, shuffle } from "./rng";
import { TEXTS } from "./texts";
import type { ContentLanguage, DetailCatch, Fact, GeneratedRound, IntakeSummary, Piece, TemplateId } from "./types";

/**
 * Round templates. Every template produces structured pieces (one per player),
 * a public prompt, and an answer computed here. The validator proves that each
 * player's piece is necessary; a generation that fails it is retried with a
 * new seed. The language model never sees or edits any of this data.
 */

export type TemplateContext = {
  gameId: string;
  roundIndex: number;
  language: ContentLanguage;
  players: Array<{ id: string; name: string }>;
  solverId: string;
  intake: IntakeSummary;
  /** Facts produced by earlier rounds, for callbacks and the key ceremony. */
  priorFacts: Array<Fact & { roundIndex: number; holderId?: string }>;
  detailHolderId?: string;
};

export const ROUND_DIFFICULTY: Record<TemplateId, number> = { slot: 1, snack: 1, replyall: 1.1, wifi: 1.3, desks: 1.5, callback: 1.1 };

const MAX_TRIES = 25;

export function generateRound(template: TemplateId, ctx: TemplateContext): GeneratedRound {
  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    const rng = seededRng(`${ctx.gameId}:${ctx.roundIndex}:${attempt}`);
    const round = GENERATORS[template](ctx, rng);
    if (validate(template, round, ctx)) return round;
  }
  throw new Error(`Could not generate a valid "${template}" round after ${MAX_TRIES} tries`);
}

/* ── Validator ──────────────────────────────────────────────────────────── */

function validate(template: TemplateId, round: GeneratedRound, ctx: TemplateContext): boolean {
  if (!round.answer || /\s/.test(round.answer)) return false;
  if (template === "callback") return true; // no pieces; necessity is by construction (facts held by others)
  // Every player must hold a real piece, and removing any one piece must leave the answer ambiguous.
  for (const p of ctx.players) {
    const piece = round.pieces[p.id];
    if (!piece || piece.kind === "none") return false;
    if (!ambiguousWithout(template, round, p.id)) return false;
  }
  return true;
}

/** True if, without `playerId`'s piece, at least two answers remain possible. */
function ambiguousWithout(template: TemplateId, round: GeneratedRound, playerId: string): boolean {
  const others = Object.entries(round.pieces).filter(([id]) => id !== playerId).map(([, p]) => p);
  switch (template) {
    case "slot": {
      const hours = (round.params.hours as number[]) ?? [];
      const free = hours.filter((h) => others.every((p) => p.kind === "calendar" && !p.busy.includes(h)));
      return free.length >= 2;
    }
    case "snack":
    case "replyall":
    case "wifi":
      // Each piece contributes an independent term/segment, so removing it always leaves ≥2 candidates
      // as long as the piece carries information (checked in the generators).
      return true;
    case "desks": {
      const clues = (round.params.clueSpecs as ClueSpec[]).filter((c) => c.playerId !== playerId);
      return solveDesks(clues).length >= 2;
    }
    case "callback":
      return true;
  }
}

/* ── Desk deduction helpers ─────────────────────────────────────────────── */

type ClueBase =
  | { kind: "nextTo"; a: number; b: number }
  | { kind: "leftOf"; a: number; b: number }
  | { kind: "notAt"; a: number; n: number }
  | { kind: "between"; a: number; b: number }
  | { kind: "at"; a: number; n: number }
  | { kind: "emptyAt"; n: number };
type ClueSpec = ClueBase & { playerId: string };

const DESKS = 5;
const ITEMS = 4;

/** All placements of 4 items on 5 desks (item → desk 1..5, distinct). */
function allPlacements(): number[][] {
  const out: number[][] = [];
  const rec = (acc: number[]) => {
    if (acc.length === ITEMS) return void out.push(acc);
    for (let d = 1; d <= DESKS; d++) if (!acc.includes(d)) rec([...acc, d]);
  };
  rec([]);
  return out;
}
const PLACEMENTS = allPlacements();

function holds(c: ClueSpec, p: number[]): boolean {
  const empty = [1, 2, 3, 4, 5].find((d) => !p.includes(d))!;
  switch (c.kind) {
    case "nextTo": return Math.abs(p[c.a] - p[c.b]) === 1;
    case "leftOf": return p[c.a] < p[c.b];
    case "notAt": return p[c.a] !== c.n;
    case "between": return Math.abs(p[c.a] - p[c.b]) === 2;
    case "at": return p[c.a] === c.n;
    case "emptyAt": return empty === c.n;
  }
}

function solveDesks(clues: ClueSpec[]): number[][] {
  return PLACEMENTS.filter((p) => clues.every((c) => holds(c, p)));
}

function clueText(T: (typeof TEXTS)[ContentLanguage], items: string[], c: ClueSpec): string {
  const tpl = T.clues[c.kind];
  return tpl
    .replace("{a}", "a" in c ? items[c.a] : "")
    .replace("{b}", "b" in c ? items[c.b] : "")
    .replace("{n}", "n" in c ? String(c.n) : "")
    .replace(/^\w/, (m) => m.toUpperCase());
}

/* ── Generators ─────────────────────────────────────────────────────────── */

type Generator = (ctx: TemplateContext, rng: () => number) => GeneratedRound;

const GENERATORS: Record<TemplateId, Generator> = {
  slot(ctx, rng) {
    const T = TEXTS[ctx.language];
    const hours = [9, 10, 11, 12, 13, 14, 15, 16];
    const answerHour = pick(rng, hours);
    const pieces: Record<string, Piece> = {};
    // Every other hour is busy for at least one player; the answer hour is free for all.
    // Each player gets one hour that ONLY they block, so removing any player's
    // calendar leaves at least two candidate hours (the validator's necessity check).
    const otherHours = shuffle(rng, hours.filter((h) => h !== answerHour));
    const blockers: Record<number, string[]> = {};
    ctx.players.forEach((p, i) => {
      blockers[otherHours[i]] = [p.id];
    });
    for (const h of otherHours.slice(ctx.players.length)) {
      const n = randInt(rng, 1, Math.min(2, ctx.players.length));
      blockers[h] = shuffle(rng, ctx.players).slice(0, n).map((p) => p.id);
    }
    for (const p of ctx.players) {
      const busy = otherHours.filter((h) => blockers[h].includes(p.id));
      pieces[p.id] = { kind: "calendar", owner: T.calendarOwner(p.name), hours, busy };
    }
    const facts: Fact[] = [{ key: "hour", label: T.facts.hour, value: String(answerHour) }];
    return {
      params: { hours, facts },
      pieces,
      publicPrompt: { text: T.slotPrompt(ctx.intake.canonical.q3), answerType: "digits", answerLength: 2 },
      answer: String(answerHour),
    };
  },

  snack(ctx, rng) {
    const T = TEXTS[ctx.language];
    const snack = ctx.intake.canonical.q2;
    const shelves = shuffle(rng, T.shelves);
    const pieces: Record<string, Piece> = {};
    let total = 0;
    ctx.players.forEach((p, i) => {
      const good = randInt(rng, 2, 9);
      const expired = randInt(rng, 0, 4);
      total += good;
      const decoy = pick(rng, T.snackDecoys);
      const items = shuffle(rng, [
        { name: snack, count: good, expired: false },
        { name: snack, count: expired, expired: true },
        { name: decoy, count: randInt(rng, 1, 6), expired: false },
      ]).filter((it) => it.count > 0);
      pieces[p.id] = { kind: "shelf", label: shelves[i % shelves.length], items };
    });
    const facts: Fact[] = [{ key: "snackTotal", label: T.facts.snackTotal, value: String(total) }];
    const params: GeneratedRound["params"] = { facts };
    if (ctx.detailHolderId) {
      const room = randInt(rng, 101, 499);
      const detail: DetailCatch = { playerId: ctx.detailHolderId, text: T.stickyNote(room), value: room };
      params.detail = detail;
    }
    return {
      params,
      pieces,
      publicPrompt: { text: T.snackPrompt(snack), answerType: "digits" },
      answer: String(total),
    };
  },

  wifi(ctx, rng) {
    const T = TEXTS[ctx.language];
    const words = {
      snack: clean(ctx.intake.canonical.q2),
      meeting: clean(ctx.intake.canonical.q3),
      tool: clean(ctx.intake.canonical.q4),
    };
    type RuleKind = "first" | "last" | "at" | "teamSize" | "count";
    const kinds: RuleKind[] = ["first", "last", "at", "teamSize", "count"];
    const order = shuffle(rng, ctx.players);
    const pieces: Record<string, Piece> = {};
    let answer = "";
    const usedKinds = new Set<RuleKind>();
    order.forEach((p, i) => {
      const wordKey = pick(rng, ["snack", "meeting", "tool"] as const);
      const word = words[wordKey];
      const label = T.words[wordKey];
      let kind = pick(rng, kinds.filter((k) => !usedKinds.has(k)));
      if (word.length < 3 && kind === "at") kind = "first";
      usedKinds.add(kind);
      let segment: string;
      let text: string;
      switch (kind) {
        case "first":
          segment = word[0];
          text = T.rules.firstLetter(label);
          break;
        case "last":
          segment = word[word.length - 1];
          text = T.rules.lastLetter(label);
          break;
        case "at": {
          const n = randInt(rng, 2, Math.min(word.length, 4));
          segment = word[n - 1];
          text = T.rules.letterAt(n, label);
          break;
        }
        case "teamSize":
          segment = String(ctx.players.length);
          text = T.rules.teamSize;
          break;
        case "count":
          segment = String(word.length);
          text = T.rules.letterCount(label);
          break;
      }
      answer += segment;
      pieces[p.id] = { kind: "rule", order: i + 1, text };
    });
    const facts: Fact[] = [{ key: "wifi", label: T.facts.wifi, value: answer }];
    return {
      params: { facts, words },
      pieces,
      publicPrompt: {
        text: `${T.wifiPrompt(ctx.intake.canonical.q4)} ${T.wifiWords(ctx.intake.canonical.q2, ctx.intake.canonical.q3, ctx.intake.canonical.q4)} ${T.ruleOrderHint}`,
        answerType: "text",
        answerLength: answer.length,
      },
      answer,
    };
  },

  replyall(ctx, rng) {
    const T = TEXTS[ctx.language];
    const lines = shuffle(rng, T.thread(ctx.intake.canonical.q2, ctx.intake.canonical.q3, ctx.intake.canonical.q4));
    const n = Math.min(lines.length, ctx.players.length + 2); // n messages, every player holds ≥1
    // Distinct minute values so the ordering is unambiguous.
    let minute = randInt(rng, 0, 20);
    const times: string[] = [];
    for (let i = 0; i < n; i++) {
      minute += randInt(rng, 3, 11);
      times.push(`${String(9 + Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
    }
    const messages = times.map((time, i) => ({ from: ctx.players[i % ctx.players.length].name, time, text: lines[i] }));
    const dealt = shuffle(rng, messages);
    const pieces: Record<string, Piece> = {};
    ctx.players.forEach((p, i) => {
      const mine = dealt.filter((_, j) => j % ctx.players.length === i);
      pieces[p.id] = { kind: "messages", items: mine };
    });
    // Minutes of the first and the last message: enough to prove the ordering, short enough to type.
    const answer = times[0].slice(3) + times[times.length - 1].slice(3);
    return {
      params: { facts: [], count: n, firstTime: times[0] },
      pieces,
      publicPrompt: { text: T.replyAllPrompt, answerType: "digits", answerLength: answer.length },
      answer,
    };
  },

  desks(ctx, rng) {
    const T = TEXTS[ctx.language];
    const items = T.deskItems(ctx.intake.canonical.q2, ctx.intake.canonical.q4);
    const placement = pick(rng, PLACEMENTS);
    const n = ctx.players.length;
    // Candidate clues that are true for this placement.
    const pool: ClueBase[] = [];
    for (let a = 0; a < ITEMS; a++) {
      for (let b = 0; b < ITEMS; b++) {
        if (a === b) continue;
        if (Math.abs(placement[a] - placement[b]) === 1) pool.push({ kind: "nextTo", a, b });
        if (placement[a] < placement[b]) pool.push({ kind: "leftOf", a, b });
        if (Math.abs(placement[a] - placement[b]) === 2) pool.push({ kind: "between", a, b });
      }
      for (let d = 1; d <= DESKS; d++) if (placement[a] !== d) pool.push({ kind: "notAt", a, n: d });
    }
    const empty = [1, 2, 3, 4, 5].find((d) => !placement.includes(d))!;
    pool.push({ kind: "emptyAt", n: empty });
    // Minimal clue set (every clue necessary, unique solution), sized between n and 2n so
    // each player holds one or two clues; then dealt round-robin.
    let chosen: ClueSpec[] | null = null;
    for (let attempt = 0; attempt < 60 && !chosen; attempt++) {
      const order = shuffle(rng, pool);
      const picked: ClueBase[] = [];
      for (const c of order) {
        if (picked.some((x) => x.kind === c.kind && "a" in x && "a" in c && x.a === c.a)) continue;
        if (c.kind === "at") continue; // too strong on its own
        picked.push(c);
        if (solveDesks(picked.map((x) => ({ ...x, playerId: "" }))).length === 1) break;
      }
      // prune: drop any clue whose removal keeps the solution unique
      let minimal = picked.slice();
      for (let i = minimal.length - 1; i >= 0; i--) {
        const without = minimal.filter((_, j) => j !== i);
        if (solveDesks(without.map((x) => ({ ...x, playerId: "" }))).length === 1) minimal = without;
      }
      if (minimal.length >= n && minimal.length <= 2 * n && solveDesks(minimal.map((x) => ({ ...x, playerId: "" }))).length === 1) {
        chosen = minimal.map((c, i) => ({ ...c, playerId: ctx.players[i % n].id }) as ClueSpec);
      }
    }
    if (!chosen) throw new Error("no clue set");
    const pieces: Record<string, Piece> = {};
    for (const p of ctx.players) {
      const mine = (chosen as ClueSpec[]).filter((c) => c.playerId === p.id);
      pieces[p.id] = { kind: "clue", texts: mine.map((c) => clueText(T, items, c)) };
    }
    const answer = placement.join("");
    const facts: Fact[] = [{ key: "desks", label: T.facts.desks, value: answer }];
    return {
      params: { facts, clueSpecs: chosen, items },
      pieces,
      publicPrompt: { text: T.desksPrompt(ctx.intake.canonical.q4), answerType: "digits", answerLength: ITEMS },
      answer,
    };
  },

  callback(ctx) {
    const T = TEXTS[ctx.language];
    const hour = ctx.priorFacts.find((f) => f.key === "hour");
    const note = ctx.priorFacts.find((f) => f.key === "note");
    if (!hour || !note) throw new Error("callback round needs prior hour + note facts");
    const holder = ctx.players.find((p) => p.id === note.holderId);
    const answer = String(Number(hour.value) + Number(note.value));
    const pieces: Record<string, Piece> = {};
    for (const p of ctx.players) pieces[p.id] = { kind: "none" };
    return {
      params: { facts: [], referenced: [hour.key, note.key], referencedValues: [Number(hour.value), Number(note.value)] },
      pieces,
      publicPrompt: { text: T.callbackPrompt(hour.roundIndex + 1, holder?.name ?? "?"), answerType: "digits" },
      answer,
    };
  },
};

/** Uppercase letters/digits only, so letter-position rules are unambiguous. Falls back to a safe word. */
function clean(word: string): string {
  const w = word.toUpperCase().replace(/[^A-Z0-9ÅÄÖÆØÜ]/g, "");
  return w.length >= 2 ? w : "COFFEE";
}

/** Template-specific hint for the solver (after the hint delay). */
export function hintFor(template: TemplateId, language: ContentLanguage, answer: string, params: Record<string, unknown>): string {
  const T = TEXTS[language];
  const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  switch (template) {
    case "slot":
      return fill(T.hints.slot, { part: Number(answer) < 12 ? T.hints.morning : T.hints.afternoon });
    case "snack": {
      const n = Number(answer);
      return fill(T.hints.snack, { lo: String(Math.max(0, n - 3)), hi: String(n + 3) });
    }
    case "wifi":
      return fill(T.hints.wifi, { c: answer[0] ?? "?" });
    case "replyall":
      return fill(T.hints.replyall, { t: String(params.firstTime ?? "") });
    case "desks":
      return fill(T.hints.desks, { n: answer[0] ?? "?" });
    case "callback": {
      const note = String((params.referencedValues as number[] | undefined)?.[1] ?? "");
      return fill(T.hints.callback, { c: note[0] ?? "?" });
    }
  }
}

export function normalizeAnswer(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s:.-]/g, "");
}
