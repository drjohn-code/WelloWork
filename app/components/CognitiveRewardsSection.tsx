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

/** Decorative on-brand SVG — placeholder for final artwork (see summary). */
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 22,
        }}
      >
        {/* Team unlocking a shared reward */}
        <PuzzleTile label={team} />
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" aria-hidden="true">
          <path
            d="M12 2v18m0 0-6-6m6 6 6-6"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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

function PuzzleTile({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <span
        aria-hidden="true"
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--secondary-deep) 55%, white), white)",
          border: "1px solid rgba(22,43,92,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="users" size={28} />
      </span>
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
