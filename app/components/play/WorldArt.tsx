import type { WorldId } from "@/app/lib/game/worlds";

/**
 * One illustrated scene per world (vote cards, episode title card, briefing).
 * Flat geometric SVG in the brand palette, animated through the same CSS
 * classes as PlayArt (float, float-slow, sway, spark, twinkle, sweep).
 */

const NAVY = "#162B5C";
const ACCENT = "#5C73FB";
const SOFT = "#8A9CFD";
const SKY = "#E3EEF9";
const AMBER = "#F2C94C";
const CORAL = "#F28B82";
const MINT = "#10B981";
const CREAM = "#FFF6C7";

const hidden = { "aria-hidden": true, focusable: false } as const;

export function WorldScene({ world, className = "" }: { world: WorldId; className?: string }) {
  switch (world) {
    case "office":
      return (
        <svg viewBox="0 0 240 120" className={`scene world-scene ${className}`} {...hidden}>
          <ellipse cx="120" cy="106" rx="100" ry="8" fill={SKY} />
          <rect x="40" y="70" width="160" height="8" rx="2" fill={NAVY} />
          <rect x="48" y="78" width="5" height="24" fill={NAVY} />
          <rect x="187" y="78" width="5" height="24" fill={NAVY} />
          <rect x="88" y="32" width="64" height="38" rx="4" fill={NAVY} />
          <rect x="92" y="36" width="56" height="28" rx="2" fill={ACCENT} />
          <g className="float-slow"><rect x="98" y="42" width="30" height="4" rx="2" fill="white" /><rect x="98" y="50" width="22" height="4" rx="2" fill={SOFT} /></g>
          <rect x="114" y="64" width="12" height="6" fill={NAVY} />
          <g className="sway"><path d="M60 70c0-14 6-18 6-26M60 70c0-10-8-14-8-22M60 70c0-10 9-12 10-20" stroke={MINT} strokeWidth="4" fill="none" strokeLinecap="round" /></g>
          <rect x="52" y="58" width="16" height="12" rx="2" fill={CORAL} />
          <g className="float"><rect x="164" y="54" width="14" height="16" rx="3" fill="white" stroke={NAVY} strokeWidth="2.5" /><path d="M178 58h3a3 3 0 0 1 0 6h-3" stroke={NAVY} strokeWidth="2.5" fill="none" /></g>
          <g className="float-slow"><rect x="180" y="16" width="34" height="26" rx="3" fill={CREAM} transform="rotate(6 197 29)" /></g>
        </svg>
      );
    case "station":
      return (
        <svg viewBox="0 0 240 120" className={`scene world-scene ${className}`} {...hidden}>
          <rect x="0" y="0" width="240" height="120" rx="14" fill={NAVY} />
          {[[20, 18], [58, 40], [92, 14], [150, 22], [204, 16], [222, 52], [34, 86], [180, 96], [120, 104]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.2} fill="white" className="twinkle" style={{ animationDelay: `${i * 0.37}s` }} />
          ))}
          <circle cx="196" cy="98" r="42" fill={ACCENT} />
          <path d="M160 84c12 6 30 6 50-4M166 104c14 4 28 2 42-6" stroke={SOFT} strokeWidth="4" fill="none" strokeLinecap="round" />
          <g className="float-slow">
            <rect x="62" y="52" width="76" height="18" rx="9" fill={SKY} stroke="white" strokeWidth="2" />
            <rect x="92" y="38" width="16" height="46" rx="6" fill="white" />
            <circle cx="100" cy="61" r="6" fill={AMBER} />
            <rect x="24" y="55" width="34" height="12" rx="2" fill={SOFT} /><path d="M28 55v12M36 55v12M44 55v12M52 55v12" stroke={NAVY} strokeWidth="1.5" />
            <rect x="142" y="55" width="34" height="12" rx="2" fill={SOFT} /><path d="M146 55v12M154 55v12M162 55v12M170 55v12" stroke={NAVY} strokeWidth="1.5" />
            <rect x="58" y="59" width="4" height="4" fill="white" /><rect x="138" y="59" width="4" height="4" fill="white" />
          </g>
          <g className="float"><rect x="120" y="20" width="12" height="10" rx="2" fill="white" transform="rotate(-18 126 25)" /><path d="M131 22h2a2.5 2.5 0 0 1 0 5h-2" stroke="white" strokeWidth="1.6" fill="none" transform="rotate(-18 126 25)" /></g>
        </svg>
      );
    case "heist":
      return (
        <svg viewBox="0 0 240 120" className={`scene world-scene ${className}`} {...hidden}>
          <ellipse cx="120" cy="106" rx="100" ry="8" fill={SKY} />
          <rect x="70" y="10" width="100" height="92" rx="10" fill={NAVY} />
          <circle cx="120" cy="56" r="36" fill="#23407f" stroke={SOFT} strokeWidth="3" />
          <g className="dial">
            <circle cx="120" cy="56" r="20" fill={ACCENT} />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <rect key={a} x="118" y="30" width="4" height="12" rx="2" fill={AMBER} transform={`rotate(${a} 120 56)`} />
            ))}
            <circle cx="120" cy="56" r="7" fill={NAVY} />
          </g>
          <rect x="160" y="44" width="8" height="24" rx="3" fill={AMBER} />
          <g className="sweep">
            <path d="M0 86L240 70" stroke={CORAL} strokeWidth="2" opacity="0.85" />
            <path d="M0 98L240 90" stroke={CORAL} strokeWidth="2" opacity="0.6" />
          </g>
          <g className="float"><rect x="22" y="32" width="34" height="22" rx="4" fill="white" stroke={NAVY} strokeWidth="2.5" /><rect x="27" y="38" width="12" height="9" rx="1.5" fill={AMBER} /><rect x="42" y="40" width="10" height="3" rx="1" fill={SOFT} /></g>
          <g className="float-slow"><path d="M196 30l10-8 10 8-10 22z" fill={MINT} stroke={NAVY} strokeWidth="2" /><path d="M196 30h20" stroke={NAVY} strokeWidth="1.6" /></g>
        </svg>
      );
    case "studio":
      return (
        <svg viewBox="0 0 240 120" className={`scene world-scene ${className}`} {...hidden}>
          <ellipse cx="120" cy="106" rx="100" ry="8" fill={SKY} />
          <g className="sweep-slow">
            <path d="M40 0L4 104h72z" fill={CREAM} opacity="0.7" />
            <path d="M200 0l-36 104h72z" fill={CREAM} opacity="0.55" />
          </g>
          <rect x="34" y="0" width="12" height="10" rx="2" fill={NAVY} />
          <rect x="194" y="0" width="12" height="10" rx="2" fill={NAVY} />
          <g className="wobble">
            <rect x="92" y="54" width="56" height="38" rx="3" fill={NAVY} />
            <path d="M92 44l54-10 2 10-54 10z" fill="white" stroke={NAVY} strokeWidth="2.5" />
            <path d="M104 41.5l6 9M120 38.5l6 9M136 35.5l6 9" stroke={NAVY} strokeWidth="4" />
            <rect x="100" y="64" width="40" height="4" rx="2" fill={SOFT} />
            <rect x="100" y="74" width="28" height="4" rx="2" fill={SOFT} />
          </g>
          <g className="float-slow">
            <rect x="166" y="54" width="34" height="22" rx="4" fill={ACCENT} stroke={NAVY} strokeWidth="2.5" />
            <circle cx="183" cy="65" r="7" fill="white" stroke={NAVY} strokeWidth="2.5" />
            <path d="M200 60l12-6v22l-12-6z" fill={NAVY} />
            <path d="M183 76l-10 26M183 76v26M183 76l10 26" stroke={NAVY} strokeWidth="2.5" />
          </g>
          <g className="spark s2"><path d="M60 40l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={AMBER} /></g>
        </svg>
      );
  }
}

/**
 * The episode title card: a TV cold-open beat with letterbox bars, the
 * episode number and the generated title.
 */
export function EpisodeCard({ world, worldName, title, episodeLabel }: { world: WorldId; worldName: string; title: string; episodeLabel: string }) {
  return (
    <div className={`episode-card world-${world}`}>
      <span className="episode-bar top" aria-hidden="true" />
      <span className="episode-bar bottom" aria-hidden="true" />
      <WorldScene world={world} className="episode-scene" />
      <div className="episode-text">
        <p className="episode-eyebrow">
          <span>{worldName}</span>
          <span aria-hidden="true"> · </span>
          <span>{episodeLabel}</span>
        </p>
        <p className="episode-title">{title}</p>
      </div>
    </div>
  );
}
