import { Reveal } from "./Reveal";
import { Icon } from "./Icons";

const ROLES = [
  {
    label: "For HR & People leaders",
    icon: "users",
    title: "See burnout signals before they become exits.",
    bullets: [
      "Aggregate cognitive trend deltas across teams",
      "Defensible wellness ROI rooted in performance data",
      "Promotion-readiness signals that don’t rely on annual reviews",
    ],
  },
  {
    label: "For Operations leaders",
    icon: "layers",
    title: "Schedule shifts around how people actually perform.",
    bullets: [
      "Spot fatigue patterns by shift pattern and role",
      "Optimise team composition for operations-critical projects",
      "Reduce variability where variability hurts safety",
    ],
  },
  {
    label: "For L&D leaders",
    icon: "target",
    title: "Build growth tracks tied to a measured cognitive profile.",
    bullets: [
      "Personalised recommendations from cognitive strengths",
      "Token-funded course marketplace, fully bookable in-app",
      "Skill development tracked alongside performance trends",
    ],
  },
] as const;

export function SolutionsByRole() {
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
              <span className="eyebrow">Solutions by role</span>
              <h2 className="h-section" style={{ margin: "8px 0 0" }}>
                Three views.
                <br />
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  One source of truth.
                </span>
              </h2>
            </div>
            <p className="lede" style={{ margin: 0 }}>
              HR, Operations, and L&D each see the slice of the platform that matters to their
              decisions — backed by the same underlying performance data.
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
