import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { Icon } from "./Icons";
import { OrderCTA } from "./OrderCTA";

const POINTS = [
  { key: "cognitive", icon: "brain" },
  { key: "teamwork", icon: "users" },
  { key: "recognition", icon: "star" },
] as const;

/**
 * Homepage section introducing Cognitive Rewards, WelloWork's own team-based
 * reward game, and linking to the dedicated /cognitive-rewards landing page.
 * Server Component — reuses the site's section / glass / button primitives,
 * no new design language.
 */
export function CognitiveRewardsSection() {
  const t = useTranslations("cognitiveRewards.section");
  return (
    <section style={{ padding: "64px 0" }} aria-labelledby="cognitive-rewards-heading">
      <div className="container">
        <div
          className="cr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <Reveal>
              <span className="eyebrow">{t("eyebrow")}</span>
            </Reveal>
            <Reveal delay={1}>
              <h2
                id="cognitive-rewards-heading"
                className="h-section"
                style={{ margin: "8px 0 14px", fontSize: "clamp(26px,3.2vw,40px)", maxWidth: "18ch" }}
              >
                {t("headingLead")}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("headingAccent")}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <p className="lede" style={{ margin: "0 0 24px", maxWidth: "52ch" }}>
                {t("body")}
              </p>
            </Reveal>

            <Reveal delay={2}>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {POINTS.map((p) => (
                  <li key={p.key} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        borderRadius: 11,
                        background:
                          "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.7)",
                      }}
                    >
                      <Icon name={p.icon} size={20} />
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "var(--ink-1)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {t(`points.${p.key}.title`)}
                      </span>
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>
                        {t(`points.${p.key}.body`)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={3}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <OrderCTA label={t("primaryCta")} event="cognitive_rewards_order_home" />
                <Link href="/cognitive-rewards" className="btn btn-glass">
                  {t("secondaryCta")}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <RewardVisual
              alt={t("visualAlt")}
              reward={t("visualReward")}
              team={t("visualTeam")}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Team nodes converging on a central unlocking star — several distinct
 * players contributing together to open the shared reward. */
function TeamUnlockGraphic({ label }: { label: string }) {
  const nodes = [
    { cx: 32, cy: 22, tone: "var(--primary)" },
    { cx: 148, cy: 16, tone: "var(--accent)" },
    { cx: 14, cy: 88, tone: "var(--accent)" },
    { cx: 166, cy: 92, tone: "var(--primary)" },
    { cx: 90, cy: 10, tone: "var(--secondary-deep)" },
  ] as const;
  const center = { cx: 90, cy: 58 };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width="100%" height="118" viewBox="0 0 180 116" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="cr-unlock-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.38" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cr-star-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

        <circle cx={center.cx} cy={center.cy} r="40" fill="url(#cr-unlock-glow)" />

        {nodes.map((n, i) => (
          <line
            key={`line-${i}`}
            x1={n.cx}
            y1={n.cy}
            x2={center.cx}
            y2={center.cy}
            stroke="color-mix(in oklch, var(--accent) 45%, transparent)"
            strokeWidth="1.4"
            strokeDasharray="3 4"
          />
        ))}

        {/* Sparkle ticks — the moment the reward opens */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = center.cx + Math.cos(rad) * 26;
          const y1 = center.cy + Math.sin(rad) * 26;
          const x2 = center.cx + Math.cos(rad) * 33;
          const y2 = center.cy + Math.sin(rad) * 33;
          return (
            <line
              key={`spark-${deg}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        <g transform={`translate(${center.cx} ${center.cy})`}>
          <circle r="21" fill="white" stroke="url(#cr-star-grad)" strokeWidth="1.5" />
          <path
            d="M0 -11l3.2 6.6 7.3 1-5.3 5 1.3 7.2L0 5.6l-6.5 3.2 1.3-7.2-5.3-5 7.3-1L0-11z"
            fill="url(#cr-star-grad)"
          />
        </g>

        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.cx} cy={n.cy} r="13" fill={n.tone} />
            <circle cx={n.cx} cy={n.cy - 3.5} r="3.2" fill="white" opacity="0.92" />
            <path
              d={`M${n.cx - 5.5} ${n.cy + 6.5}a5.5 5 0 0111 0z`}
              fill="white"
              opacity="0.92"
            />
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
  );
}

/** Reward-unlock visual — several player nodes contributing together into a
 * central star that opens, then the reward pill below. */
function RewardVisual({
  alt,
  reward,
  team,
}: {
  alt: string;
  reward: string;
  team: string;
}) {
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
      <div
        style={{
          position: "relative",
          marginBottom: 22,
        }}
      >
        <TeamUnlockGraphic label={team} />
      </div>

      <div
        style={{
          position: "relative",
          padding: "16px 18px",
          borderRadius: 18,
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--accent) 12%, white), white)",
          border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
        aria-hidden="true"
      >
        <span
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "var(--primary)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 6px 18px color-mix(in oklch, var(--primary) 35%, transparent)",
          }}
        >
          <Icon name="star" size={22} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--ink-1)",
            letterSpacing: "-0.01em",
          }}
        >
          {reward}
        </span>
      </div>
    </div>
  );
}
