import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { Icon } from "./Icons";

const ROLE_META = [
  { key: "hr", icon: "users" },
  { key: "operations", icon: "layers" },
  { key: "ld", icon: "target" },
] as const;

export function SolutionsByRole() {
  const t = useTranslations("solutions");
  const ROLES = ROLE_META.map((m) => ({
    label: t(`roles.${m.key}.label`),
    icon: m.icon,
    title: t(`roles.${m.key}.title`),
    bullets: t.raw(`roles.${m.key}.bullets`) as string[],
  }));
  return (
    <section id="solutions" className="section">
      <div className="container">
        <Reveal>
          <div
            className="sg-head"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "end",
              marginBottom: 44,
            }}
          >
            <div>
              <span className="eyebrow">{t("eyebrow")}</span>
              <h2 className="h-section" style={{ margin: "8px 0 0" }}>
                {t("heading.lead")}
                <br />
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("heading.accent")}
                </span>
              </h2>
            </div>
            <p className="lede" style={{ margin: 0 }}>
              {t("lede")}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.label} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <article
                className="glass lift"
                style={{
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minHeight: 320,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.7)",
                    }}
                  >
                    <Icon name={r.icon} size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "var(--ink-3)",
                      textTransform: "uppercase",
                    }}
                  >
                    {r.label}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 22,
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "var(--ink-1)",
                    textWrap: "pretty",
                  }}
                >
                  {r.title}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {r.bullets.map((b) => (
                    <li
                      key={b}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 14,
                        color: "var(--ink-2)",
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          flexShrink: 0,
                          marginTop: 8,
                          background: "var(--accent)",
                        }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
