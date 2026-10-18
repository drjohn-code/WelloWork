/**
 * Illustrated game pieces: the Game Master character, scene art per step,
 * medals, the vault, floating office objects. Flat geometric SVG in the brand
 * palette, animated through CSS classes. All decorative (aria-hidden).
 */

const NAVY = "#162B5C";
const ACCENT = "#5C73FB";
const SOFT = "#8A9CFD";
const SKY = "#E3EEF9";
const AMBER = "#F2C94C";
const CORAL = "#F28B82";
const MINT = "#10B981";
const LILAC = "#7C3AED";
const CREAM = "#FFF6C7";

const hidden = { "aria-hidden": true, focusable: false } as const;

/* ── Game Master: a deadpan office owl with reading glasses ─────────────── */

export function GameMasterFace({ size = 44, mood = "default" }: { size?: number; mood?: "default" | "success" | "fail" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`gm-face mood-${mood}`} {...hidden}>
      <circle cx="32" cy="34" r="26" fill={NAVY} />
      <path d="M14 22 L22 8 L28 20 Z M50 22 L42 8 L36 20 Z" fill={NAVY} />
      <ellipse cx="32" cy="42" rx="14" ry="12" fill="#23407f" />
      <g className="gm-eyes">
        <circle cx="22" cy="30" r="8.5" fill="white" />
        <circle cx="42" cy="30" r="8.5" fill="white" />
        <circle className="gm-pupil" cx="23" cy="31" r="3.4" fill={NAVY} />
        <circle className="gm-pupil" cx="43" cy="31" r="3.4" fill={NAVY} />
        <circle cx="22" cy="30" r="10" fill="none" stroke={ACCENT} strokeWidth="2" />
        <circle cx="42" cy="30" r="10" fill="none" stroke={ACCENT} strokeWidth="2" />
        <path d="M32 30h0" stroke={ACCENT} strokeWidth="2" />
        <rect className="gm-lid" x="12" y="19" width="20" height="0" fill={NAVY} rx="2" />
        <rect className="gm-lid" x="32" y="19" width="20" height="0" fill={NAVY} rx="2" />
      </g>
      <path d="M29 38 L32 43 L35 38 Z" fill={AMBER} />
      <path className="gm-brow" d="M15 20 Q22 17 29 20" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path className="gm-brow" d="M35 20 Q42 17 49 20" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Scenes ─────────────────────────────────────────────────────────────── */

export type SceneKind = "lobby" | "intake" | "briefing" | "slot" | "snack" | "wifi" | "replyall" | "desks" | "callback" | "common" | "lineup" | "blueprint" | "challenge" | "key" | "generating";

export function Scene({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "lobby":
      return (
        <svg viewBox="0 0 240 120" className="scene scene-lobby" {...hidden}>
          <ellipse cx="120" cy="104" rx="96" ry="10" fill={SKY} />
          <ellipse cx="120" cy="78" rx="70" ry="22" fill={ACCENT} />
          <ellipse cx="120" cy="72" rx="70" ry="22" fill={SOFT} />
          <g className="float-slow"><rect x="104" y="58" width="16" height="12" rx="2" fill="white" /><rect x="106" y="56" width="12" height="3" rx="1" fill={NAVY} /></g>
          <g className="float"><circle cx="146" cy="64" r="6" fill={CREAM} /><circle cx="146" cy="64" r="2" fill={AMBER} /></g>
          <g className="sway"><rect x="70" y="40" width="12" height="18" rx="3" fill={NAVY} /><rect x="156" y="36" width="12" height="18" rx="3" fill={NAVY} /><rect x="112" y="26" width="12" height="18" rx="3" fill={NAVY} /></g>
          <circle cx="76" cy="36" r="8" fill={CORAL} /><circle cx="162" cy="32" r="8" fill={MINT} /><circle cx="118" cy="22" r="8" fill={AMBER} />
        </svg>
      );
    case "intake":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="70" y="20" width="100" height="78" rx="8" fill="white" stroke={NAVY} strokeWidth="2.5" />
          <rect x="70" y="20" width="100" height="14" rx="8" fill={ACCENT} />
          <g className="write">
            <rect x="84" y="46" width="60" height="4" rx="2" fill={SOFT} /><rect x="84" y="58" width="72" height="4" rx="2" fill={SOFT} /><rect x="84" y="70" width="48" height="4" rx="2" fill={SOFT} />
          </g>
          <g className="pen"><rect x="150" y="52" width="8" height="40" rx="2" fill={AMBER} transform="rotate(30 154 72)" /><path d="M147 90 l5 8 5-8z" fill={NAVY} transform="rotate(30 154 72)" /></g>
          <g className="float"><rect x="24" y="40" width="30" height="26" rx="3" fill={CREAM} transform="rotate(-8 39 53)" /></g>
          <g className="float-slow"><circle cx="202" cy="50" r="10" fill={CORAL} /><circle cx="202" cy="50" r="4" fill="white" /></g>
        </svg>
      );
    case "generating":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <g className="build b1"><rect x="60" y="70" width="40" height="30" rx="4" fill={SOFT} /></g>
          <g className="build b2"><rect x="100" y="50" width="40" height="50" rx="4" fill={ACCENT} /></g>
          <g className="build b3"><rect x="140" y="30" width="40" height="70" rx="4" fill={NAVY} /></g>
          <g className="float"><rect x="150" y="42" width="8" height="8" rx="1" fill={CREAM} /><rect x="164" y="42" width="8" height="8" rx="1" fill={CREAM} /><rect x="150" y="58" width="8" height="8" rx="1" fill={CREAM} /></g>
          <g className="spin-slow"><circle cx="40" cy="36" r="12" fill="none" stroke={AMBER} strokeWidth="4" strokeDasharray="20 10" /></g>
        </svg>
      );
    case "briefing":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="88" y="18" width="64" height="86" rx="4" fill={NAVY} />
          <g className="door"><rect x="92" y="22" width="56" height="78" rx="3" fill={ACCENT} /><circle cx="140" cy="62" r="3.5" fill={AMBER} /><rect x="104" y="30" width="32" height="10" rx="2" fill="white" /></g>
          <g className="float"><rect x="30" y="30" width="36" height="28" rx="3" fill={CREAM} transform="rotate(-6 48 44)" /></g>
          <g className="float-slow"><rect x="176" y="40" width="22" height="30" rx="3" fill="white" stroke={NAVY} strokeWidth="2" /><rect x="180" y="46" width="14" height="3" fill={SOFT} /><rect x="180" y="53" width="10" height="3" fill={SOFT} /></g>
        </svg>
      );
    case "slot":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="60" y="22" width="120" height="80" rx="8" fill="white" stroke={NAVY} strokeWidth="2.5" />
          <rect x="60" y="22" width="120" height="18" rx="8" fill={NAVY} />
          <rect x="60" y="32" width="120" height="8" fill={NAVY} />
          {[0, 1, 2, 3].map((c) => [0, 1].map((r) => <rect key={`${c}${r}`} x={72 + c * 26} y={50 + r * 24} width="20" height="16" rx="3" fill={(c + r) % 3 === 1 ? CORAL : SKY} />))}
          <g className="pulse-ring"><rect x="124" y="74" width="20" height="16" rx="3" fill={MINT} /></g>
          <g className="float"><circle cx="200" cy="40" r="14" fill="white" stroke={NAVY} strokeWidth="2.5" /><path d="M200 31v9l6 4" stroke={NAVY} strokeWidth="2.5" fill="none" strokeLinecap="round" /></g>
        </svg>
      );
    case "snack":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="56" y="18" width="128" height="84" rx="6" fill={SKY} stroke={NAVY} strokeWidth="2.5" />
          <rect x="56" y="46" width="128" height="3" fill={NAVY} /><rect x="56" y="74" width="128" height="3" fill={NAVY} />
          <g className="float"><circle cx="78" cy="36" r="8" fill={AMBER} /><circle cx="98" cy="36" r="8" fill={AMBER} /><circle cx="118" cy="36" r="8" fill={AMBER} /></g>
          <g className="float-slow"><rect x="66" y="56" width="22" height="14" rx="2" fill={CORAL} /><rect x="96" y="56" width="22" height="14" rx="2" fill={MINT} /><rect x="150" y="56" width="22" height="14" rx="2" fill={LILAC} /></g>
          <g className="wobble"><rect x="140" y="26" width="30" height="16" rx="3" fill="white" stroke={NAVY} strokeWidth="2" /><text x="155" y="38" fontSize="9" fontWeight="700" textAnchor="middle" fill={CORAL} fontFamily="sans-serif">!</text></g>
          <circle cx="70" cy="90" r="6" fill={AMBER} /><circle cx="86" cy="90" r="6" fill={AMBER} />
        </svg>
      );
    case "wifi":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="84" y="72" width="72" height="26" rx="6" fill={NAVY} />
          <circle cx="100" cy="85" r="3" fill={MINT} /><circle cx="112" cy="85" r="3" fill={MINT} /><circle cx="124" cy="85" r="3" fill={AMBER} />
          <rect x="140" y="50" width="4" height="22" rx="2" fill={NAVY} />
          <g className="wave w1"><path d="M104 60a22 22 0 0 1 32 0" stroke={ACCENT} strokeWidth="4" fill="none" strokeLinecap="round" /></g>
          <g className="wave w2"><path d="M94 48a36 36 0 0 1 52 0" stroke={SOFT} strokeWidth="4" fill="none" strokeLinecap="round" /></g>
          <g className="wave w3"><path d="M84 36a50 50 0 0 1 72 0" stroke={SKY} strokeWidth="4" fill="none" strokeLinecap="round" /></g>
          <g className="float"><rect x="24" y="40" width="40" height="22" rx="4" fill="white" stroke={NAVY} strokeWidth="2" /><text x="44" y="55" fontSize="10" fontWeight="800" textAnchor="middle" fill={NAVY} fontFamily="monospace">****</text></g>
          <g className="float-slow"><circle cx="200" cy="44" r="12" fill={AMBER} /><rect x="196" y="40" width="8" height="10" rx="2" fill={NAVY} /></g>
        </svg>
      );
    case "replyall":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <g className="mail m1"><rect x="40" y="56" width="56" height="36" rx="4" fill="white" stroke={NAVY} strokeWidth="2.5" /><path d="M42 60l26 18 26-18" stroke={NAVY} strokeWidth="2.5" fill="none" /></g>
          <g className="mail m2"><rect x="92" y="36" width="56" height="36" rx="4" fill="white" stroke={NAVY} strokeWidth="2.5" /><path d="M94 40l26 18 26-18" stroke={ACCENT} strokeWidth="2.5" fill="none" /></g>
          <g className="mail m3"><rect x="144" y="56" width="56" height="36" rx="4" fill="white" stroke={NAVY} strokeWidth="2.5" /><path d="M146 60l26 18 26-18" stroke={CORAL} strokeWidth="2.5" fill="none" /></g>
          <g className="float"><circle cx="196" cy="30" r="11" fill={CORAL} /><text x="196" y="34" fontSize="11" fontWeight="800" textAnchor="middle" fill="white" fontFamily="sans-serif">9</text></g>
        </svg>
      );
    case "desks":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="106" rx="100" ry="8" fill={SKY} />
          <rect x="18" y="20" width="26" height="40" rx="3" fill={SKY} stroke={NAVY} strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} className="float" style={{ animationDelay: `${i * 0.3}s` }}>
              <rect x={56 + i * 36} y="70" width="30" height="8" rx="2" fill={NAVY} />
              <rect x={58 + i * 36} y="78" width="3" height="18" fill={NAVY} /><rect x={81 + i * 36} y="78" width="3" height="18" fill={NAVY} />
              <text x={71 + i * 36} y="66" fontSize="9" fontWeight="800" textAnchor="middle" fill={ACCENT} fontFamily="sans-serif">{i + 1}</text>
            </g>
          ))}
          <circle cx="71" cy="54" r="7" fill={AMBER} /><rect x="100" y="48" width="14" height="12" rx="2" fill={LILAC} /><rect x="172" y="47" width="16" height="12" rx="2" fill="white" stroke={NAVY} strokeWidth="2" /><path d="M214 60c0-10 6-14 6-20M214 60c0-8-7-12-7-18" stroke={MINT} strokeWidth="3" fill="none" strokeLinecap="round" />
          <g className="spark s1"><path d="M150 30l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={CORAL} /></g>
        </svg>
      );
    case "callback":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <g className="float-slow"><path d="M120 26c-16 0-28 12-28 26 0 8 4 15 10 20v8h36v-8c6-5 10-12 10-20 0-14-12-26-28-26z" fill={AMBER} /><rect x="106" y="82" width="28" height="8" rx="3" fill={NAVY} /><rect x="110" y="92" width="20" height="6" rx="3" fill={NAVY} /></g>
          <g className="spark s1"><path d="M60 40l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill={LILAC} /></g>
          <g className="spark s2"><path d="M180 30l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={ACCENT} /></g>
          <g className="spark s3"><path d="M176 72l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={MINT} /></g>
          <g className="float"><rect x="150" y="48" width="30" height="22" rx="2" fill={CREAM} transform="rotate(8 165 59)" /></g>
        </svg>
      );
    case "common":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          {[-24, -8, 8, 24].map((rot, i) => (
            <g key={rot} className={i % 2 ? "float" : "float-slow"}>
              <rect x={84 + i * 18} y="26" width="40" height="58" rx="6" fill="white" stroke={NAVY} strokeWidth="2.5" transform={`rotate(${rot} ${104 + i * 18} 84)`} />
            </g>
          ))}
          <g className="pulse-ring"><circle cx="160" cy="52" r="9" fill={AMBER} stroke={NAVY} strokeWidth="2.5" /></g>
          <g className="float"><path d="M40 40l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={CORAL} /></g>
          <g className="float-slow"><circle cx="204" cy="34" r="7" fill={MINT} /></g>
        </svg>
      );
    case "lineup":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <rect x="40" y="16" width="160" height="80" rx="6" fill={SKY} />
          {[30, 50, 70].map((y) => (
            <rect key={y} x="40" y={y} width="160" height="2" fill={SOFT} />
          ))}
          {[0, 1, 2].map((i) => (
            <g key={i} className={i === 1 ? "float" : "float-slow"}>
              <circle cx={78 + i * 42} cy="46" r="12" fill="white" stroke={NAVY} strokeWidth="2.5" />
              <path d={`M${60 + i * 42} 96c0-16 8-24 18-24s18 8 18 24`} fill={[CORAL, ACCENT, AMBER][i]} stroke={NAVY} strokeWidth="2.5" />
            </g>
          ))}
          <g className="wobble"><circle cx="196" cy="38" r="13" fill="white" stroke={NAVY} strokeWidth="3" /><path d="M205 48l12 12" stroke={NAVY} strokeWidth="5" strokeLinecap="round" /></g>
        </svg>
      );
    case "blueprint":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="70" y="16" width="100" height="80" rx="8" fill="white" stroke={NAVY} strokeWidth="2.5" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => {
              const v = (r * 5 + c * 3) % 5;
              return <rect key={`${r}${c}`} x={80 + c * 22} y={26 + r * 22} width="18" height="18" rx="4" fill={[SKY, CORAL, ACCENT, AMBER, NAVY][v]} className={v ? "pop-tile" : ""} style={{ animationDelay: `${(r * 4 + c) * 0.12}s` }} />;
            })
          )}
          <g className="pen"><rect x="176" y="40" width="8" height="40" rx="2" fill={AMBER} transform="rotate(30 180 60)" /><path d="M173 78l5 8 5-8z" fill={NAVY} transform="rotate(30 180 60)" /></g>
        </svg>
      );
    case "challenge":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="52" y="20" width="136" height="76" rx="6" fill="white" stroke={NAVY} strokeWidth="2.5" />
          <rect x="112" y="96" width="16" height="8" fill={NAVY} />
          <g className="write"><path d="M70 44q20-14 40 0t40 0" stroke={ACCENT} strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M70 66q20 14 40 0t40 0" stroke={CORAL} strokeWidth="4" fill="none" strokeLinecap="round" /></g>
          <g className="wobble"><path d="M196 44l24-10v40l-24-10z" fill={AMBER} /><rect x="186" y="46" width="12" height="18" rx="3" fill={NAVY} /></g>
          <g className="float"><circle cx="30" cy="60" r="8" fill={MINT} /></g>
        </svg>
      );
    case "key":
      return (
        <svg viewBox="0 0 240 120" className="scene" {...hidden}>
          <ellipse cx="120" cy="104" rx="90" ry="9" fill={SKY} />
          <rect x="70" y="14" width="100" height="90" rx="10" fill={NAVY} />
          <rect x="78" y="22" width="84" height="74" rx="8" fill="#23407f" />
          <g className="dial"><circle cx="120" cy="58" r="22" fill={ACCENT} /><circle cx="120" cy="58" r="14" fill={NAVY} /><rect x="118" y="38" width="4" height="12" rx="2" fill={AMBER} /></g>
          <rect x="150" y="48" width="8" height="20" rx="3" fill={AMBER} />
          <g className="float"><circle cx="40" cy="40" r="10" fill="none" stroke={AMBER} strokeWidth="5" /><rect x="48" y="38" width="22" height="5" fill={AMBER} /><rect x="62" y="43" width="4" height="6" fill={AMBER} /></g>
          <g className="spark s2"><path d="M200 36l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={MINT} /></g>
        </svg>
      );
  }
}

/* ── Medal (badge) ──────────────────────────────────────────────────────── */

const MEDAL_COLORS: Record<string, [string, string]> = {
  connector: [SOFT, ACCENT],
  clarity: ["#7DD3FC", "#0b7fae"],
  bridge: ["#6EE7B7", "#0f8a63"],
  rescuer: [CORAL, "#c0392b"],
  solver: ["#FFE68A", "#b08900"],
  pace: ["#FDBA74", "#c2570c"],
  eagleEye: ["#94A9D6", "#23407f"],
  memory: ["#C4B5FD", LILAC],
  glue: [AMBER, "#c47d00"],
};

export function Medal({ kind, size = 56, children }: { kind: string; size?: number; children?: React.ReactNode }) {
  const [fill, deep] = MEDAL_COLORS[kind] ?? [SOFT, NAVY];
  return (
    <span className={`medal medal-${kind}`} style={{ width: size, height: size * 1.25 }}>
      <svg viewBox="0 0 56 70" width={size} height={size * 1.25} {...hidden}>
        <path d="M18 0h10l-4 22h-6z" fill={ACCENT} /><path d="M28 0h10l0 22h-6z" fill={NAVY} />
        <circle cx="28" cy="42" r="24" fill={deep} />
        <circle cx="28" cy="42" r="19" fill={fill} />
        <circle className="medal-shine" cx="28" cy="42" r="19" fill="url(#shine)" />
        <defs>
          <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.55" /><stop offset="0.5" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <span className="medal-icon">{children}</span>
    </span>
  );
}

/* ── Vault + trophy + coins for the celebration ─────────────────────────── */

export function Vault({ open }: { open: boolean }) {
  return (
    <div className={`vault ${open ? "open" : ""}`} aria-hidden="true">
      <div className="vault-inside">
        <Trophy />
      </div>
      <div className="vault-door left" />
      <div className="vault-door right">
        <span className="vault-wheel" />
      </div>
    </div>
  );
}

export function Trophy({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className="trophy" {...hidden}>
      <path d="M26 14h44v26a22 22 0 0 1-44 0z" fill={AMBER} />
      <path d="M26 20H14v8a14 14 0 0 0 14 14M70 20h12v8a14 14 0 0 1-14 14" stroke={AMBER} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="42" y="60" width="12" height="12" fill="#c47d00" />
      <rect x="30" y="72" width="36" height="10" rx="3" fill={NAVY} />
      <path className="trophy-shine" d="M34 20l8 0-4 18z" fill="white" opacity="0.5" />
      <text x="48" y="42" fontSize="18" fontWeight="800" textAnchor="middle" fill="white" fontFamily="sans-serif">1</text>
    </svg>
  );
}

export function Coins({ count = 14 }: { count?: number }) {
  return (
    <div className="coins" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="coin" style={{ ["--i" as string]: i, ["--a" as string]: `${(i / count) * 360}deg`, animationDelay: `${(i % 5) * 90}ms` }} />
      ))}
    </div>
  );
}

/* ── Floating office objects for the page background ────────────────────── */

export function FloatingObjects() {
  return (
    <div className="floaters" aria-hidden="true">
      <svg className="floater f1" viewBox="0 0 48 48" width="48" height="48"><rect x="6" y="8" width="36" height="32" rx="3" fill={CREAM} transform="rotate(-8 24 24)" /></svg>
      <svg className="floater f2" viewBox="0 0 48 48" width="56" height="56"><path d="M12 16h22a6 6 0 0 1 6 6v10a10 10 0 0 1-10 10H18a6 6 0 0 1-6-6z" fill={NAVY} /><path d="M40 22h4a4 4 0 0 1 0 8h-4" stroke={NAVY} strokeWidth="3" fill="none" /><path d="M18 10c0-3 3-3 3-6M26 10c0-3 3-3 3-6" stroke={SOFT} strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
      <svg className="floater f3" viewBox="0 0 48 48" width="40" height="40"><path d="M14 30V12a6 6 0 0 1 12 0v22a10 10 0 0 1-20 0V16" stroke={ACCENT} strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
      <svg className="floater f4" viewBox="0 0 48 48" width="52" height="52"><rect x="6" y="10" width="36" height="32" rx="4" fill="white" stroke={NAVY} strokeWidth="2.5" /><rect x="6" y="10" width="36" height="9" rx="4" fill={CORAL} /><rect x="14" y="26" width="7" height="7" rx="1" fill={SOFT} /><rect x="26" y="26" width="7" height="7" rx="1" fill={SOFT} /></svg>
      <svg className="floater f5" viewBox="0 0 48 48" width="44" height="44"><circle cx="24" cy="24" r="16" fill={MINT} opacity="0.9" /><path d="M16 24l6 6 10-12" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <svg className="floater f6" viewBox="0 0 48 48" width="46" height="46"><path d="M8 34l12-20 12 20z" fill={AMBER} /><circle cx="32" cy="16" r="8" fill={LILAC} /></svg>
    </div>
  );
}

/* ── Stamp ("SOLVED" / "TIME'S UP") ─────────────────────────────────────── */

export function Stamp({ tone, children }: { tone: "success" | "fail"; children: React.ReactNode }) {
  return (
    <span className={`stamp stamp-${tone}`} aria-hidden="true">
      {children}
    </span>
  );
}

/** Deterministic per-player colour pair, so avatars are distinct across the whole game. */
export const PLAYER_COLORS: Array<[string, string]> = [
  [ACCENT, LILAC],
  [MINT, "#0f6b47"],
  [AMBER, "#c47d00"],
  [CORAL, "#c0392b"],
  [NAVY, "#0E1D45"],
];

/* ── Live lobby table: joined players take their seats ───────────────────── */

export function LobbyTable({ players }: { players: Array<{ name: string; joined: boolean; colorIndex: number }> }) {
  const seats = [
    { x: 120, y: 26 }, { x: 52, y: 60 }, { x: 188, y: 60 }, { x: 78, y: 104 }, { x: 162, y: 104 },
  ];
  return (
    <svg viewBox="0 0 240 130" className="scene scene-table" {...hidden}>
      <ellipse cx="120" cy="118" rx="100" ry="8" fill={SKY} />
      <ellipse cx="120" cy="74" rx="66" ry="26" fill={ACCENT} />
      <ellipse cx="120" cy="68" rx="66" ry="26" fill={SOFT} />
      <g className="float-slow"><rect x="104" y="56" width="18" height="13" rx="2" fill="white" /><rect x="106" y="54" width="14" height="3" rx="1" fill={NAVY} /></g>
      <g className="float"><circle cx="142" cy="66" r="6" fill={CREAM} /><circle cx="142" cy="66" r="2.2" fill={AMBER} /></g>
      <g className="float-slow"><rect x="86" y="70" width="12" height="8" rx="1.5" fill={CORAL} transform="rotate(-10 92 74)" /></g>
      {players.slice(0, 5).map((p, i) => {
        const s = seats[i];
        const [c1, c2] = PLAYER_COLORS[p.colorIndex % PLAYER_COLORS.length];
        const initials = p.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
        return (
          <g key={i} className={`seat ${p.joined ? "seated" : "empty"}`} style={{ animationDelay: `${i * 120}ms` }}>
            <rect x={s.x - 12} y={s.y + 10} width="24" height="16" rx="4" fill={p.joined ? NAVY : "#d7def0"} />
            <circle cx={s.x} cy={s.y} r="13" fill={p.joined ? c1 : "white"} stroke={p.joined ? c2 : "#c4cee6"} strokeWidth="2.5" strokeDasharray={p.joined ? "0" : "4 3"} />
            {p.joined ? (
              <text x={s.x} y={s.y + 4} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="white" fontFamily="sans-serif">{initials}</text>
            ) : (
              <text x={s.x} y={s.y + 4} fontSize="12" fontWeight="800" textAnchor="middle" fill="#9aa6c4" fontFamily="sans-serif">?</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Fireworks (CSS radial bursts) + answer particles ───────────────────── */

export function Fireworks({ count = 9 }: { count?: number }) {
  const colors = [ACCENT, AMBER, CORAL, MINT, LILAC, SOFT];
  return (
    <div className="fireworks" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="firework" style={{ left: `${12 + ((i * 37) % 76)}%`, top: `${10 + ((i * 53) % 55)}%`, color: colors[i % colors.length], animationDelay: `${i * 300}ms` }} />
      ))}
    </div>
  );
}

export function Burst({ tone }: { tone: "success" | "fail" }) {
  const colors = tone === "success" ? [MINT, AMBER, ACCENT, "#FFF6C7"] : [CORAL, "#F3D9D0"];
  return (
    <span className={`burst burst-${tone}`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} style={{ ["--a" as string]: `${i * 30}deg`, background: colors[i % colors.length], animationDelay: `${(i % 4) * 25}ms` }} />
      ))}
    </span>
  );
}
