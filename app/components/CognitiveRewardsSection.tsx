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
            <RewardVisual alt={t("visualAlt")} team={t("visualTeam")} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Team nodes converging on a padlock that springs open to reveal the star
 * reward — the team's combined effort is what unlocks it. Line-draw,
 * shackle-lift and glow-pulse are CSS animations gated behind
 * prefers-reduced-motion in globals.css. */
function TeamUnlockGraphic({ label }: { label: string }) {
  const nodes = [
    { cx: 32, cy: 22, tone: "var(--primary)" },
    { cx: 148, cy: 16, tone: "var(--accent)" },
    { cx: 14, cy: 88, tone: "var(--accent)" },
    { cx: 166, cy: 92, tone: "var(--primary)" },
    { cx: 90, cy: 10, tone: "var(--secondary-deep)" },
  ] as const;
  // Where the players' effort feeds in — the top of the lock body, where
  // the shackle is anchored.
  const target = { cx: 90, cy: 64 };
  // Where the unlocked reward (star) sits — set into the lock's face so the
  // body still reads as a lock beneath it, clear of the open shackle above.
  const star = { cx: 90, cy: 72 };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width="100%" height="140" viewBox="0 0 180 140" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="cr-unlock-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.38" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cr-reward-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cr-star-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
          <linearGradient id="cr-lock-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary-deep)" />
          </linearGradient>
        </defs>

        <circle cx={target.cx} cy={target.cy} r="46" fill="url(#cr-unlock-glow)" />

        {nodes.map((n, i) => (
          <line
            key={`line-${i}`}
            className="cr-unlock-line"
            style={{ ["--cr-delay" as string]: `${i * 90}ms` }}
            x1={n.cx}
            y1={n.cy}
            x2={target.cx}
            y2={target.cy}
            stroke="color-mix(in oklch, var(--accent) 50%, transparent)"
            strokeWidth="1.4"
            strokeDasharray="3 4"
          />
        ))}

        {/* Shackle, swung open — anchored on the left, lifted clear on the
            right — reads as "just unlocked" rather than a closed lock. Drawn
            behind the body so both legs plug cleanly into its top edge. */}
        <path
          className="cr-unlock-shackle"
          d={`M${target.cx - 9} ${target.cy} V${target.cy - 14} A9 9 0 0 1 ${target.cx + 9} ${target.cy - 14} V${target.cy - 30}`}
          stroke="url(#cr-lock-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Padlock body — the star reward is set into its face, with the
            body still visible around and beneath it */}
        <rect
          x={target.cx - 17}
          y={target.cy}
          width="34"
          height="30"
          rx="8"
          fill="url(#cr-lock-grad)"
        />

        {/* Reveal glow behind the star — pulses to signal the unlock moment */}
        <circle className="cr-unlock-glow-pulse" cx={star.cx} cy={star.cy} r="23" fill="url(#cr-reward-glow)" />

        {/* Sparkle ticks around the revealed reward */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = star.cx + Math.cos(rad) * 20;
          const y1 = star.cy + Math.sin(rad) * 20;
          const x2 = star.cx + Math.cos(rad) * 26;
          const y2 = star.cy + Math.sin(rad) * 26;
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

        {/* The reward itself, revealed inside the open lock body */}
        <g transform={`translate(${star.cx} ${star.cy})`}>
          <circle r="15" fill="white" stroke="url(#cr-star-grad)" strokeWidth="1.5" />
          <path
            d="M0 -8l2.3 4.7 5.2 0.7-3.8 3.6 0.9 5.1L0 4l-4.6 2.3 0.9-5.1-3.8-3.6 5.2-0.7L0-8z"
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

/** Reward-unlock visual — player nodes contributing together into a padlock
 * that springs open to reveal the star reward. The unlock is shown, not
 * captioned. */
function RewardVisual({ alt, team }: { alt: string; team: string }) {
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
      <div style={{ position: "relative" }}>
        <TeamUnlockGraphic label={team} />
      </div>
    </div>
  );
}
