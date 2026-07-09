/**
 * Shared inline-SVG illustration for TwentyThird: separate signals (patterns,
 * dreams, relationships, work) converging into one profile. Same connected-node
 * + glass-strong card language as RewardVisual (CognitiveRewardsSection.tsx)
 * and CognitiveRewardsHeroVisual — no new design language. Used on both the
 * homepage teaser and the /twentythird hero.
 */
export function TwentyThirdVisual({ alt, label }: { alt: string; label: string }) {
  const nodes = [
    { cx: 30, cy: 22, tone: "var(--primary)" },
    { cx: 150, cy: 18, tone: "var(--accent)" },
    { cx: 16, cy: 92, tone: "var(--accent)" },
    { cx: 164, cy: 96, tone: "var(--primary)" },
  ] as const;
  const center = { cx: 90, cy: 62 };

  return (
    <div
      className="glass-strong"
      style={{ position: "relative", padding: 28, borderRadius: 28, overflow: "hidden" }}
      role="img"
      aria-label={alt}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--accent) 30%, transparent), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <svg width="100%" height="140" viewBox="0 0 180 140" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="t23-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="t23-center-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>

          <circle cx={center.cx} cy={center.cy} r="48" fill="url(#t23-center-glow)" />

          {nodes.map((n, i) => (
            <line
              key={`line-${i}`}
              className="cr-unlock-line"
              style={{ ["--cr-delay" as string]: `${i * 90}ms` }}
              x1={n.cx}
              y1={n.cy}
              x2={center.cx}
              y2={center.cy}
              stroke="color-mix(in oklch, var(--accent) 50%, transparent)"
              strokeWidth="1.4"
              strokeDasharray="3 4"
            />
          ))}

          <circle cx={center.cx} cy={center.cy} r="24" fill="url(#t23-center-grad)" />
          <circle cx={center.cx} cy={center.cy} r="24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <circle cx={center.cx} cy={center.cy} r="7" fill="white" opacity="0.9" />

          {nodes.map((n, i) => (
            <g key={`node-${i}`}>
              <circle cx={n.cx} cy={n.cy} r="12" fill={n.tone} />
              <circle cx={n.cx} cy={n.cy} r="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
            </g>
          ))}
        </svg>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
