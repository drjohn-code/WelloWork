import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";

export function AdvantageSection() {
  const t = useTranslations("advantage");
  const POINTS = t.raw("points") as { label: string; title: string; body: string }[];
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="container">
        <div
          className="glass-strong"
          style={{
            padding: "56px 48px",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--navy) 100%)",
            color: "white",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="orb"
            style={{ width: 320, height: 320, top: -120, right: -80, background: "var(--accent)", opacity: 0.32 }}
          />
          <div
            className="orb"
            style={{
              width: 240,
              height: 240,
              bottom: -100,
              left: -60,
              background: "var(--secondary-deep)",
              opacity: 0.22,
            }}
          />

          <Reveal>
            <div style={{ position: "relative", maxWidth: 560, marginBottom: 44 }}>
              <span className="eyebrow" style={{ color: "var(--secondary-deep)" }}>
                {t("eyebrow")}
              </span>
              <h2 className="h-section" style={{ color: "white", margin: "8px 0 16px" }}>
                {t("heading.lead")}
                <span className="italic-serif" style={{ color: "var(--secondary)" }}>
                  {t("heading.accent")}
                </span>
              </h2>
              <p className="body" style={{ color: "rgba(255,255,255,0.78)", margin: 0 }}>
                {t("intro")}
              </p>
            </div>
          </Reveal>

          <div
            className="adv-grid"
            style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}
          >
            {POINTS.map((p, i) => (
              <Reveal key={p.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div
                  className="adv-cell"
                  style={{
                    padding: "24px 28px 24px 0",
                    paddingLeft: i % 2 === 0 ? 0 : 36,
                    borderTop: i > 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
                    borderLeft: i % 2 === 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
                    marginTop: i > 1 ? 8 : 0,
                    paddingTop: i > 1 ? 32 : 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: "0.06em",
                        color: "var(--secondary-deep)",
                      }}
                    >
                      {p.label}
                    </span>
                    <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.14)" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 19,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      margin: "0 0 8px",
                      color: "white",
                      textWrap: "pretty",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
