/**
 * The visual vocabulary of the talk rounds (cards, faces, tiles). Shared by the
 * generators (server) and the renderers (client), so it must stay free of
 * server-only imports. Pieces carry these ids; the UI draws them; the words
 * players use to describe them are their own.
 */

export const CARD_OBJECTS = ["key", "mug", "plant", "clock", "umbrella", "rocket", "bell", "crown", "bulb", "envelope", "camera", "gem"] as const;
export type CardObject = (typeof CARD_OBJECTS)[number];

/**
 * Four colours that stay apart for common colour-vision deficiencies: they
 * differ in lightness as well as hue (yellow light, red and blue mid, black dark).
 */
export const COLORS = ["red", "blue", "yellow", "black"] as const;
export type ColorId = (typeof COLORS)[number];
export const COLOR_HEX: Record<ColorId, string> = { red: "#D9483B", blue: "#2F6FDE", yellow: "#F2C230", black: "#1F2430" };

export type CardId = `${ColorId}-${CardObject}`;
export function cardId(color: ColorId, object: CardObject): CardId {
  return `${color}-${object}`;
}
export function parseCard(id: string): { color: ColorId; object: CardObject } | null {
  const [color, object] = id.split("-") as [ColorId, CardObject];
  return (COLORS as readonly string[]).includes(color) && (CARD_OBJECTS as readonly string[]).includes(object) ? { color, object } : null;
}

/* ── Faces (line-up rounds) ─────────────────────────────────────────────── */

export const FACE_FEATURES = {
  headwear: ["none", "cap", "beanie", "headphones"],
  eyewear: ["none", "round", "square", "shades"],
  facial: ["none", "moustache", "beard", "freckles"],
  hair: ["black", "brown", "ginger", "grey"],
  top: ["red", "blue", "yellow", "black"],
} as const;
export type FaceFeature = keyof typeof FACE_FEATURES;
export const FACE_FEATURE_KEYS = Object.keys(FACE_FEATURES) as FaceFeature[];
export type Face = { [K in FaceFeature]: (typeof FACE_FEATURES)[K][number] };

export const HAIR_HEX: Record<Face["hair"], string> = { black: "#232838", brown: "#7A4B2A", ginger: "#D9762B", grey: "#A7ADBA" };

/* ── Tiles (blueprint rounds) ───────────────────────────────────────────── */

/** Tile values: 0 = empty, 1..4 = COLORS[value - 1]. */
export const TILE_COLORS: readonly ColorId[] = COLORS;
export const BLUEPRINT_COLS = 4;
