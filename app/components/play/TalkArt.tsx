import { COLOR_HEX, HAIR_HEX, type CardObject, type ColorId, type Face, type FaceFeature } from "@/app/lib/game/visual";

/**
 * Art for the talk rounds: picture cards, line-up faces, pattern tiles. Every
 * piece in these rounds is a picture so it has to be described, not read out.
 * Faces use a neutral, non-skin tone on purpose: no round ever asks players to
 * describe anyone's skin.
 */

const NAVY = "#162B5C";
const FACE = "#E3EEF9";
const FACIAL = "#3B3F4E";

/* ── Picture cards ──────────────────────────────────────────────────────── */

export function CardArt({ object, color, size = 56 }: { object: CardObject; color: ColorId; size?: number }) {
  const c = COLOR_HEX[color];
  const ink = color === "black" ? "#FFFFFF" : NAVY;
  const line = { stroke: NAVY, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const detail = { stroke: ink, strokeWidth: 2.2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let body: React.ReactNode;
  switch (object) {
    case "key":
      body = (
        <>
          <rect x="22" y="21" width="20" height="6" rx="2" fill={c} {...line} />
          <rect x="33" y="26" width="4" height="7" rx="1" fill={c} {...line} />
          <rect x="39" y="26" width="3.5" height="5" rx="1" fill={c} {...line} />
          <circle cx="15" cy="24" r="9" fill={c} {...line} />
          <circle cx="15" cy="24" r="3.4" fill="#fff" {...line} />
        </>
      );
      break;
    case "mug":
      body = (
        <>
          <path d="M32 19h4a5.5 5.5 0 0 1 0 11h-4" fill="none" stroke={NAVY} strokeWidth="3.2" />
          <rect x="10" y="14" width="23" height="25" rx="4" fill={c} {...line} />
          <path d="M16 5.5c0 3 3 3 3 6M24 5.5c0 3 3 3 3 6" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
          <path d="M15 21v11" {...detail} />
        </>
      );
      break;
    case "plant":
      body = (
        <>
          <path d="M24 31C24 20 16 17 11 11c9 0 13 7 13 20z" fill={c} {...line} />
          <path d="M24 31c0-11 8-14 13-20-9 0-13 7-13 20z" fill={c} {...line} />
          <path d="M13 30h22l-3 12H16z" fill={c} {...line} />
          <path d="M15 34h18" {...detail} />
        </>
      );
      break;
    case "clock":
      body = (
        <>
          <circle cx="24" cy="25" r="16" fill={c} {...line} />
          <circle cx="24" cy="25" r="11" fill="#fff" {...line} />
          <path d="M24 25v-7M24 25l5 3.5" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 8l-5 4M34 8l5 4" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" />
        </>
      );
      break;
    case "umbrella":
      body = (
        <>
          <path d="M24 25v13a4 4 0 0 1-8 0" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
          <path d="M5 25a19 19 0 0 1 38 0c-3-2.5-6.5-2.5-9.5 0-3-2.5-6.5-2.5-9.5 0-3-2.5-6.5-2.5-9.5 0-3-2.5-6.5-2.5-9.5 0z" fill={c} {...line} />
          <path d="M24 7v18M14 12c-2 4-2.5 9-2.5 13M34 12c2 4 2.5 9 2.5 13" {...detail} strokeWidth="1.6" />
        </>
      );
      break;
    case "rocket":
      body = (
        <>
          <path d="M20 31l4 11 4-11z" fill="#fff" {...line} />
          <path d="M17 24l-7 10h8zM31 24l7 10h-8z" fill={c} {...line} />
          <path d="M24 4c8 6 10 16 8 27H16c-2-11 0-21 8-27z" fill={c} {...line} />
          <circle cx="24" cy="17" r="4.2" fill="#fff" {...line} />
        </>
      );
      break;
    case "bell":
      body = (
        <>
          <circle cx="24" cy="38.5" r="3.6" fill={c} {...line} />
          <path d="M11 35c3.5-3 4-8.5 4-15a9 9 0 0 1 18 0c0 6.5.5 12 4 15z" fill={c} {...line} />
          <circle cx="24" cy="8.5" r="2.6" fill={c} {...line} />
          <path d="M19 19c0-2.5 1.5-4.5 4-5" {...detail} />
        </>
      );
      break;
    case "crown":
      body = (
        <>
          <path d="M8 37L6 16l10 8 8-15 8 15 10-8-2 21z" fill={c} {...line} />
          <path d="M9 31h30" {...detail} />
          <circle cx="16" cy="34" r="1.8" fill={ink} />
          <circle cx="24" cy="34" r="1.8" fill={ink} />
          <circle cx="32" cy="34" r="1.8" fill={ink} />
        </>
      );
      break;
    case "bulb":
      body = (
        <>
          <path d="M24 5a12.5 12.5 0 0 0-7.5 22.5V34h15v-6.5A12.5 12.5 0 0 0 24 5z" fill={c} {...line} />
          <rect x="17.5" y="34" width="13" height="7" rx="2" fill="#fff" {...line} />
          <path d="M20 26l2-6 2 4 2-4 2 6" {...detail} />
        </>
      );
      break;
    case "envelope":
      body = (
        <>
          <rect x="6" y="12" width="36" height="25" rx="3" fill={c} {...line} />
          <path d="M7.5 14l16.5 12.5L40.5 14" {...detail} />
          <path d="M7.5 35.5l11-10M40.5 35.5l-11-10" {...detail} strokeWidth="1.6" />
        </>
      );
      break;
    case "camera":
      body = (
        <>
          <rect x="13" y="9" width="10" height="6.5" rx="1.5" fill={c} {...line} />
          <rect x="6" y="14" width="36" height="24" rx="4" fill={c} {...line} />
          <circle cx="24" cy="26" r="7.5" fill="#fff" {...line} />
          <circle cx="24" cy="26" r="3" fill={NAVY} />
          <circle cx="36" cy="19.5" r="1.8" fill={ink} />
        </>
      );
      break;
    case "gem":
      body = (
        <>
          <path d="M14 10h20l8 10-18 21L6 20z" fill={c} {...line} />
          <path d="M6.5 20h35M14 10l4.5 10L24 40.5 29.5 20 34 10" {...detail} strokeWidth="1.6" />
        </>
      );
      break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {body}
    </svg>
  );
}

/* ── Faces ──────────────────────────────────────────────────────────────── */

/**
 * A line-up face. `only` draws a single feature on a blank silhouette: what a
 * witness remembers, with nothing else that could give away another feature.
 */
export function FaceArt({ face, only, size = 88 }: { face: Partial<Face>; only?: FaceFeature; size?: number }) {
  const show = (f: FaceFeature) => (only ? only === f : face[f] !== undefined);
  const line = { stroke: NAVY, strokeWidth: 2.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const top = face.top ? COLOR_HEX[face.top as ColorId] : "#C9D2E3";
  const hair = face.hair ? HAIR_HEX[face.hair] : null;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 80 88" aria-hidden="true" focusable="false">
      {/* shoulders */}
      <path d="M10 88c0-17 13-25 30-25s30 8 30 25z" fill={show("top") ? top : "#DDE3EE"} {...line} />
      <path d="M34 57h12v9c-2 2-10 2-12 0z" fill={FACE} {...line} />
      {/* hair behind the head */}
      {show("hair") && hair && <path d="M17 40c-2-17 9-27 23-27s25 10 23 27c-1 6-3 10-5 12V36c-5-6-12-9-18-9s-13 3-18 9v16c-2-2-4-6-5-12z" fill={hair} {...line} />}
      {/* head */}
      <ellipse cx="40" cy="38" rx="19" ry="21" fill={FACE} {...line} />
      {show("hair") && hair && <path d="M22 33c3-9 10-13 18-13s15 4 18 13c-6-4-11-5-18-5s-12 1-18 5z" fill={hair} {...line} />}
      {/* eyes are always there; eyewear sits on top */}
      <circle cx="32.5" cy="38" r="2" fill={NAVY} />
      <circle cx="47.5" cy="38" r="2" fill={NAVY} />
      <path d="M38 45.5c1.3 1 2.7 1 4 0" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
      {show("eyewear") && face.eyewear === "round" && (
        <g fill="none" {...line}>
          <circle cx="32.5" cy="38" r="5.6" />
          <circle cx="47.5" cy="38" r="5.6" />
          <path d="M38.1 38h3.8" />
        </g>
      )}
      {show("eyewear") && face.eyewear === "square" && (
        <g fill="none" {...line}>
          <rect x="26.5" y="33" width="12" height="10" rx="1.5" />
          <rect x="41.5" y="33" width="12" height="10" rx="1.5" />
          <path d="M38.5 37.5h3" />
        </g>
      )}
      {show("eyewear") && face.eyewear === "shades" && (
        <g {...line}>
          <path d="M25.5 33.5h14l-1.5 8.5c-.4 1.5-2 2-3.5 2h-5c-1.6 0-3-.6-3.4-2z" fill={NAVY} />
          <path d="M40.5 33.5h14l-1.6 8.5c-.4 1.4-1.8 2-3.4 2h-5c-1.5 0-3.1-.5-3.5-2z" fill={NAVY} />
          <path d="M39.5 35h1" />
        </g>
      )}
      {show("facial") && face.facial === "moustache" && <path d="M33 49.5c2.5-3 5-3.2 7-1.4 2-1.8 4.5-1.6 7 1.4-2.6.8-5 .4-7-1-2 1.4-4.4 1.8-7 1z" fill={FACIAL} />}
      {show("facial") && face.facial === "beard" && <path d="M22 42c1 11 8 17 18 17s17-6 18-17c-2 4-4 6-6 6-2 3-6 4-12 4s-10-1-12-4c-2 0-4-2-6-6z" fill={FACIAL} />}
      {show("facial") && face.facial === "freckles" && (
        <g fill="#C27A55">
          {[[28, 44], [31, 46], [26, 47], [52, 44], [49, 46], [54, 47]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" />
          ))}
        </g>
      )}
      {show("headwear") && face.headwear === "cap" && (
        <g {...line}>
          <path d="M21 31c0-11 8.5-18 19-18s19 7 19 18z" fill="#5C73FB" />
          <path d="M40 31h26c0 3-3 5-8 5H40z" fill="#5C73FB" />
          <circle cx="40" cy="13.5" r="2" fill="#5C73FB" />
        </g>
      )}
      {show("headwear") && face.headwear === "beanie" && (
        <g {...line}>
          <path d="M21 30c0-12 8.5-20 19-20s19 8 19 20z" fill="#F28B82" />
          <rect x="19" y="26" width="42" height="8" rx="3" fill="#F28B82" />
          <path d="M26 27v6M33 27v6M40 27v6M47 27v6M54 27v6" stroke={NAVY} strokeWidth="1.4" />
          <circle cx="40" cy="9" r="4" fill="#fff" />
        </g>
      )}
      {show("headwear") && face.headwear === "headphones" && (
        <g {...line}>
          <path d="M19 38c0-16 9-24 21-24s21 8 21 24" fill="none" stroke={NAVY} strokeWidth="4" />
          <rect x="14" y="33" width="9" height="14" rx="3.5" fill="#10B981" />
          <rect x="57" y="33" width="9" height="14" rx="3.5" fill="#10B981" />
        </g>
      )}
    </svg>
  );
}

/* ── Pattern tiles ──────────────────────────────────────────────────────── */

/** One tile: 0 = empty, 1..4 = a colour. */
export function Tile({ value, colors, size = 36 }: { value: number; colors: readonly ColorId[]; size?: number }) {
  const id = value ? colors[value - 1] : null;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      {id ? (
        <rect x="3" y="3" width="30" height="30" rx="7" fill={COLOR_HEX[id]} stroke={NAVY} strokeWidth="2" />
      ) : (
        <rect x="4" y="4" width="28" height="28" rx="7" fill="none" stroke="#9AA6C4" strokeWidth="2" strokeDasharray="4 4" />
      )}
    </svg>
  );
}
