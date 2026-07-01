import { useTranslations } from "next-intl";
import { Icon } from "./Icons";

/**
 * Inline-SVG illustrations for the /cognitive-rewards landing page, filling
 * the empty visual space next to the hero copy and the "What is Cognitive
 * Rewards?" copy. Follows the same glass-strong card + connected-node
 * language already used by RewardVisual (CognitiveRewardsSection.tsx) and
 * TimelineCard (platform/assessment page) — no new design language.
 */

/* ---------- Hero: live challenge screen with connected player avatars ---------- */

export function CognitiveRewardsHeroVisual() {
  const t = useTranslations("cognitiveRewards.hero");
  const players = [
    { cx: 30, cy: 24, tone: "var(--primary)" },
    { cx: 146, cy: 20, tone: "var(--accent)" },
    { cx: 18, cy: 92, tone: "var(--accent)" },
    { cx: 158, cy: 96, tone: "var(--primary)" },
  ] as const;
  const center = { cx: 88, cy: 58 };

  return (
    <div
      className="glass-strong"
      style={{ position: "relative", overflow: "hidden", padding: 0 }}
      role="img"
      aria-label={t("visualAlt")}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -50,
          left: -50,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--accent) 26%, transparent), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Window chrome with a live indicator instead of a URL bar */}
      <div
        style={{
          position: "relative",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(15,29,69,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
        </div>
        <span
          aria-hidden="true"
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 100,
            background: "color-mix(in oklch, var(--accent) 14%, white)",
            border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
            color: "var(--primary)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#EF4444",
              animation: "pulseDot 1.6s ease-in-out infinite",
            }}
          />
          {t("visualLiveLabel")}
        </span>
      </div>

      <div style={{ position: "relative", padding: "26px 22px 22px" }}>
        <svg width="100%" height="140" viewBox="0 0 176 116" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="cr-hero-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.30" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={center.cx} cy={center.cy} r="38" fill="url(#cr-hero-glow)" />

          {players.map((p, i) => (
            <line
              key={`l-${i}`}
              x1={p.cx}
              y1={p.cy}
              x2={center.cx}
              y2={center.cy}
              stroke="color-mix(in oklch, var(--accent) 42%, transparent)"
              strokeWidth="1.4"
              strokeDasharray="3 4"
            />
          ))}

          {/* Puzzle-piece motif at the centre — mid-challenge, not yet solved */}
          <g transform={`translate(${center.cx - 15} ${center.cy - 15})`}>
            <path
              d="M8 2h9a3 3 0 010 6 3 3 0 000 6h6v9a3 3 0 01-6 0 3 3 0 00-6 0H2v-9a3 3 0 006 0 3 3 0 00-6 0V8h6z"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              transform="scale(1.1)"
            />
          </g>

          {players.map((p, i) => (
            <g key={`n-${i}`}>
              <circle cx={p.cx} cy={p.cy} r="12" fill={p.tone} />
              <circle cx={p.cx} cy={p.cy - 3} r="3" fill="white" opacity="0.92" />
              <path d={`M${p.cx - 5} ${p.cy + 6}a5 4.6 0 0110 0z`} fill="white" opacity="0.92" />
            </g>
          ))}
        </svg>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            {t("visualCaption")}
          </span>
          <span style={{ display: "flex", gap: 4 }} aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 22,
                  height: 4,
                  borderRadius: 2,
                  background: i < 2 ? "var(--accent)" : "rgba(15,29,69,0.12)",
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- "What is Cognitive Rewards?" — funded pool → team → split flow ---------- */

export function CognitiveRewardsFlowVisual() {
  const t = useTranslations("cognitiveRewards.whatItIs");
  const steps: Array<{ icon: string; key: "fund" | "team" | "split" }> = [
    { icon: "flow", key: "fund" },
    { icon: "users", key: "team" },
    { icon: "star", key: "split" },
  ];

  return (
    <div
      className="glass-strong"
      style={{ position: "relative", padding: 26, borderRadius: 24, overflow: "hidden" }}
      role="img"
      aria-label={t("visualAlt")}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--accent) 25%, transparent), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          position: "relative",
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          marginBottom: 22,
        }}
      >
        {t("visualEyebrow")}
      </span>

      <div style={{ position: "relative" }}>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "16.6%",
            right: "16.6%",
            top: 25,
            height: 2,
            background:
              "linear-gradient(90deg, color-mix(in oklch, var(--accent) 45%, transparent), color-mix(in oklch, var(--primary) 55%, transparent))",
            borderRadius: 2,
          }}
        />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
              <span
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, color-mix(in oklch, var(--accent) 20%, white), white)",
                  border: "1px solid color-mix(in oklch, var(--accent) 35%, transparent)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  boxShadow: "0 6px 18px color-mix(in oklch, var(--accent) 18%, transparent)",
                }}
              >
                <Icon name={s.icon} size={22} />
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--ink-1)",
                  lineHeight: 1.35,
                }}
              >
                {i + 1}. {t(`visualSteps.${s.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
