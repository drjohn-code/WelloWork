import { pick, randInt, shuffle } from "./rng";
import { TEXTS } from "./texts";
import {
  BLUEPRINT_COLS,
  COLORS,
  FACE_FEATURES,
  FACE_FEATURE_KEYS,
  cardId,
  type CardId,
  type CardObject,
  type Face,
  type FaceFeature,
} from "./visual";
import type { ContentLanguage, GeneratedRound, Piece } from "./types";

/**
 * Talk rounds: the communication-first mechanics. Nothing here needs
 * arithmetic or deduction; the whole difficulty is describing what you see
 * precisely and listening to what the others see. Every piece is a picture
 * (the UI draws it), so it cannot be read aloud word for word.
 *
 * Same contract as templates.ts: structured pieces, an answer computed here,
 * and a validator that proves every player's piece is necessary.
 */

export type TalkTemplate = "common" | "lineup" | "blueprint";
export const TALK_TEMPLATES: readonly TalkTemplate[] = ["common", "lineup", "blueprint"];

export type TalkCtx = {
  language: ContentLanguage;
  players: Array<{ id: string; name: string }>;
  solverId: string;
  /** World deck for common-ground rounds (8 objects). */
  deck: readonly CardObject[];
};

/** Choice rounds are guessable from the options, so they allow fewer misses. */
export const CHOICE_MAX_WRONG = 2;

const HAND_SIZE = 6;
const LINEUP_SIZE = 6;

/* ── Common ground: one card is in every hand ───────────────────────────── */

function common(ctx: TalkCtx, rng: () => number): GeneratedRound {
  const T = TEXTS[ctx.language];
  const all = shuffle(
    rng,
    ctx.deck.flatMap((o) => COLORS.map((c) => cardId(c, o)))
  );
  const shared = all[0];
  const [sharedColor, sharedObject] = shared.split("-");
  // Near misses (same object or same colour as the shared card) first, so a
  // vague description ("the key") is never enough: players have to say both.
  const rest = all.slice(1);
  const near = shuffle(rng, rest.filter((c) => c.startsWith(`${sharedColor}-`) || c.endsWith(`-${sharedObject}`)));
  const far = rest.filter((c) => !near.includes(c));
  const pool = [...near.slice(0, Math.ceil(near.length / 2)), ...shuffle(rng, [...near.slice(Math.ceil(near.length / 2)), ...far])];

  // For every player p, one card that everybody EXCEPT p holds. Without p's
  // hand, that card and the shared card are both "in every hand" → ambiguous.
  const missingFor = new Map<string, CardId>();
  for (const p of ctx.players) missingFor.set(p.id, pool.shift()!);
  const pieces: Record<string, Piece> = {};
  for (const p of ctx.players) {
    const decoys = ctx.players.filter((q) => q.id !== p.id).map((q) => missingFor.get(q.id)!);
    const fillers = pool.splice(0, HAND_SIZE - 1 - decoys.length); // unique to this hand
    pieces[p.id] = { kind: "cards", cards: shuffle(rng, [shared, ...decoys, ...fillers]) };
  }
  return {
    params: { facts: [], revealCard: shared },
    pieces,
    publicPrompt: { text: T.talk.commonPrompt, answerType: "choice", maxWrong: CHOICE_MAX_WRONG },
    answer: shared,
  };
}

/* ── Line-up: find the face from pictured details ───────────────────────── */

function randomFace(rng: () => number): Face {
  return Object.fromEntries(FACE_FEATURE_KEYS.map((k) => [k, pick(rng, FACE_FEATURES[k])])) as Face;
}
const faceKey = (f: Face) => FACE_FEATURE_KEYS.map((k) => f[k]).join("|");

function lineup(ctx: TalkCtx, rng: () => number): GeneratedRound {
  const T = TEXTS[ctx.language];
  const sources = shuffle(rng, ctx.players.filter((p) => p.id !== ctx.solverId));
  const features = shuffle(rng, FACE_FEATURE_KEYS).slice(0, sources.length) as FaceFeature[];
  const target = randomFace(rng);
  // Witnessed features are never "none": "a green beanie" is more fun to describe than "no hat".
  for (const f of features) {
    const values = FACE_FEATURES[f].filter((v) => v !== "none") as string[];
    (target as Record<FaceFeature, string>)[f] = pick(rng, values);
  }
  const faces: Face[] = [target];
  const seen = new Set([faceKey(target)]);
  // One decoy per witness: identical on every witnessed feature except theirs.
  for (const f of features) {
    for (let tries = 0; tries < 50; tries++) {
      const d = randomFace(rng);
      for (const g of features) if (g !== f) (d as Record<FaceFeature, string>)[g] = target[g];
      (d as Record<FaceFeature, string>)[f] = pick(rng, (FACE_FEATURES[f] as readonly string[]).filter((v) => v !== target[f]));
      if (!seen.has(faceKey(d))) {
        seen.add(faceKey(d));
        faces.push(d);
        break;
      }
    }
  }
  // Fillers: differ from the target on at least two witnessed features (or all, with one witness).
  const minDiff = Math.min(2, features.length);
  for (let tries = 0; faces.length < LINEUP_SIZE && tries < 400; tries++) {
    const d = randomFace(rng);
    const diff = features.filter((f) => d[f] !== target[f]).length;
    if (diff >= minDiff && !seen.has(faceKey(d))) {
      seen.add(faceKey(d));
      faces.push(d);
    }
  }
  const order = shuffle(rng, faces);
  const answer = String(order.indexOf(target) + 1);

  const pieces: Record<string, Piece> = { [ctx.solverId]: { kind: "lineup", faces: order } };
  sources.forEach((p, i) => {
    const f = features[i];
    pieces[p.id] = { kind: "witness", feature: f, value: target[f] };
  });
  return {
    params: { facts: [{ key: "lineup", label: T.facts.lineup, value: answer }], witnessed: features },
    pieces,
    publicPrompt: { text: T.talk.lineupPrompt, answerType: "choice", maxWrong: CHOICE_MAX_WRONG },
    answer,
  };
}

/* ── Blueprint: rebuild a tile pattern from descriptions ────────────────── */

function blueprint(ctx: TalkCtx, rng: () => number): GeneratedRound {
  const T = TEXTS[ctx.language];
  const sources = shuffle(rng, ctx.players.filter((p) => p.id !== ctx.solverId));
  const rowsPer = ctx.players.length === 3 ? 2 : 1;
  const rows = sources.length * rowsPer;
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const filled = randInt(rng, 2, 3);
    const cols = shuffle(rng, Array.from({ length: BLUEPRINT_COLS }, (_, i) => i)).slice(0, filled);
    grid.push(Array.from({ length: BLUEPRINT_COLS }, (_, c) => (cols.includes(c) ? randInt(rng, 1, COLORS.length) : 0)));
  }
  const pieces: Record<string, Piece> = { [ctx.solverId]: { kind: "canvas", rows, cols: BLUEPRINT_COLS } };
  sources.forEach((p, i) => {
    const mine = Array.from({ length: rowsPer }, (_, j) => i * rowsPer + j);
    pieces[p.id] = { kind: "tiles", cols: BLUEPRINT_COLS, rows: mine.map((r) => ({ row: r + 1, tiles: grid[r] })) };
  });
  return {
    params: { facts: [], grid },
    pieces,
    publicPrompt: { text: T.talk.blueprintPrompt, answerType: "grid", rows, cols: BLUEPRINT_COLS },
    answer: grid.flat().join(""),
  };
}

export const TALK_GENERATORS: Record<TalkTemplate, (ctx: TalkCtx, rng: () => number) => GeneratedRound> = { common, lineup, blueprint };

/* ── Validator ──────────────────────────────────────────────────────────── */

/**
 * The answer must follow from all pieces, and dropping any one source's piece
 * must leave at least two candidates. The solver's piece in line-up and
 * blueprint rounds is the instrument they answer with (the faces, the empty
 * grid), so it is necessary by construction.
 */
export function validateTalk(template: TalkTemplate, round: GeneratedRound, ctx: TalkCtx): boolean {
  const ids = ctx.players.map((p) => p.id);
  for (const id of ids) if (!round.pieces[id]) return false;
  switch (template) {
    case "common": {
      const hands = ids.map((id) => round.pieces[id]).map((p) => (p.kind === "cards" ? p.cards : []));
      if (hands.some((h) => h.length !== HAND_SIZE || new Set(h).size !== HAND_SIZE)) return false;
      const inAll = (hs: string[][]) => hs[0].filter((c) => hs.every((h) => h.includes(c)));
      const full = inAll(hands);
      if (full.length !== 1 || full[0] !== round.answer) return false;
      return ids.every((_, i) => inAll(hands.filter((__, j) => j !== i)).length >= 2);
    }
    case "lineup": {
      const lp = round.pieces[ctx.solverId];
      if (lp.kind !== "lineup" || lp.faces.length !== LINEUP_SIZE) return false;
      if (new Set(lp.faces.map(faceKey)).size !== LINEUP_SIZE) return false;
      const clues = ids
        .filter((id) => id !== ctx.solverId)
        .map((id) => round.pieces[id])
        .flatMap((p) => (p.kind === "witness" ? [p] : []));
      if (clues.length !== ids.length - 1) return false;
      const candidates = (cs: typeof clues) =>
        lp.faces.map((f, i) => ({ f, i })).filter(({ f }) => cs.every((c) => (f as Record<string, string>)[c.feature] === c.value));
      const full = candidates(clues);
      if (full.length !== 1 || String(full[0].i + 1) !== round.answer) return false;
      return clues.every((_, i) => candidates(clues.filter((__, j) => j !== i)).length >= 2);
    }
    case "blueprint": {
      const cv = round.pieces[ctx.solverId];
      if (cv.kind !== "canvas") return false;
      const held = ids
        .filter((id) => id !== ctx.solverId)
        .map((id) => round.pieces[id])
        .flatMap((p) => (p.kind === "tiles" ? p.rows.map((r) => r.row) : [-1]));
      // Every source holds at least one row nobody else holds, and together they cover the grid.
      if (held.includes(-1) || new Set(held).size !== held.length || held.length !== cv.rows) return false;
      return round.answer.length === cv.rows * cv.cols;
    }
  }
}

/* ── Hints and the failure reveal ───────────────────────────────────────── */

export function talkHint(template: TalkTemplate, language: ContentLanguage, params: Record<string, unknown>, answer: string): string {
  const T = TEXTS[language];
  switch (template) {
    case "common": {
      const color = String(params.revealCard ?? "").split("-")[0] as (typeof COLORS)[number];
      return T.talk.hints.common.replace("{color}", T.talk.colors[color] ?? color);
    }
    case "lineup": {
      // Rule out two wrong faces, deterministically.
      const right = Number(answer);
      const wrong = [1, 2, 3, 4, 5, 6].filter((n) => n !== right).slice(0, 2);
      return T.talk.hints.lineup.replace("{a}", String(wrong[0])).replace("{b}", String(wrong[1]));
    }
    case "blueprint": {
      const grid = (params.grid as number[][] | undefined) ?? [];
      const first = grid[0]?.[0] ?? 0;
      return T.talk.hints.blueprint.replace("{tile}", first ? T.talk.colors[COLORS[first - 1]] : T.talk.emptyTile);
    }
  }
}

export function talkReveal(template: TalkTemplate, language: ContentLanguage, params: Record<string, unknown>, answer: string): string {
  const T = TEXTS[language];
  switch (template) {
    case "common": {
      const [color, object] = String(params.revealCard ?? "").split("-") as [(typeof COLORS)[number], CardObject];
      return T.talk.cardName(T.talk.cards[object] ?? object, T.talk.colors[color] ?? color);
    }
    case "lineup":
      return T.talk.faceNumber(answer);
    case "blueprint": {
      const grid = (params.grid as number[][] | undefined) ?? [];
      return grid.map((row) => row.map((v) => (v ? T.talk.colors[COLORS[v - 1]][0].toUpperCase() : "·")).join(" ")).join(" / ");
    }
  }
}
