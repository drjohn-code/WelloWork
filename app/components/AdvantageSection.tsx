import { Reveal } from "./Reveal";

const POINTS = [
  {
    label: "01",
    title: "The only platform combining cognitive training, biomarker testing, and team intelligence.",
    body: "Most tools cover one of these. We connect all three so signals from one inform decisions in the others.",
  },
  {
    label: "02",
    title: "Built in Sweden under GDPR by default — employees own their data.",
    body: "Privacy is the architecture, not a compliance footnote. Managers only see anonymised, aggregated trends.",
  },
  {
    label: "03",
    title: "Longitudinal trends, not one-time scores.",
    body: "Performance changes through sprints, shifts, and seasons. We measure across the year, not on assessment day.",
  },
  {
    label: "04",
    title: "Designed for daily use — measured in minutes, not hours.",
    body: "Cognitive training runs in a coffee break. Workshops fit lunch. Sample testing happens on-site.",
  },
] as const;

export function AdvantageSection() {
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
                The WelloWork advantage
              </span>
              <h2 className="h-section" style={{ color: "white", margin: "8px 0 16px" }}>
                Four claims we will{" "}
                <span className="italic-serif" style={{ color: "var(--secondary)" }}>
                  defend in a sales call.
                </span>
              </h2>
              <p className="body" style={{ color: "rgba(255,255,255,0.78)", margin: 0 }}>
                No invented numbers. No fake validations. Category-level claims rooted in what the platform
                actually does and how it’s built.
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
