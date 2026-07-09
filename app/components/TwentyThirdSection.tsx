import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { Icon } from "./Icons";
import { DayTwentyThreeCTA } from "./DayTwentyThreeCTA";
import { TwentyThirdVisual } from "./TwentyThirdVisuals";

const POINTS = [
  { key: "patterns", icon: "flow" },
  { key: "dreams", icon: "spark" },
  { key: "workBlocks", icon: "target" },
] as const;

/**
 * Homepage section introducing TwentyThird, WelloWork's psychodynamic AI
 * self-discovery product (day-23.com), and linking to the dedicated
 * /twentythird landing page. Server Component — reuses the site's section /
 * glass / button primitives, no new design language. Renders immediately
 * after CognitiveRewardsSection.
 */
export function TwentyThirdSection() {
  const t = useTranslations("twentyThird.section");
  return (
    <section style={{ padding: "64px 0" }} aria-labelledby="twentythird-heading">
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
                id="twentythird-heading"
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
                <DayTwentyThreeCTA label={t("primaryCta")} event="twentythird_daytwentythree_home" />
                <Link href="/twentythird" className="btn btn-glass">
                  {t("secondaryCta")}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <TwentyThirdVisual alt={t("visualAlt")} label={t("visualLabel")} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
