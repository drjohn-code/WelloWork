import { Reveal } from "./Reveal";
import { Icon } from "./Icons";

const ITEMS = [
  {
    icon: "chart",
    title: "Engagement scores don’t predict who’s about to burn out.",
    body: "Satisfaction surveys measure how people feel about work. They don’t measure how work is changing them.",
  },
  {
    icon: "drop",
    title: "Annual physicals miss the biomarkers that drive cognitive performance.",
    body: "Sleep architecture, glucose variability, inflammation — the things that quietly bend the cognitive curve never make it into HR data.",
  },
  {
    icon: "flow",
    title: "Hiring assessments end at the offer letter — and HR surveys end with morale.",
    body: "Between those two extremes, there is no longitudinal view of how the people you hired are actually performing.",
  },
] as const;

export function ProblemSection() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 48 }}>
            <span className="eyebrow">The gap</span>
            <h2 className="h-section" style={{ margin: "8px 0 16px" }}>
              Wellness platforms measure engagement.{" "}
              <span className="italic-serif" style={{ color: "var(--accent)" }}>
                We measure performance.
              </span>
            </h2>
            <p className="lede" style={{ margin: 0 }}>
              Three things every operator already knows about their people data — but no tool actually fixes.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-3">
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <article
                className="glass lift"
                style={{
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minHeight: 240,
                }}
              >
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
                  <Icon name={it.icon} size={22} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 19,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "var(--ink-1)",
                    textWrap: "pretty",
                  }}
                >
                  {it.title}
                </h3>
                <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                  {it.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
