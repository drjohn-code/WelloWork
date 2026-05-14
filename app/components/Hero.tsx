import { Reveal } from "./Reveal";
import { Icon, ArrowRight } from "./Icons";
import { SwedenChip } from "./Chips";
import { HeroDashboard } from "./HeroDashboard";

const HEADLINE_LEAD = "Train cognitive performance.";
const HEADLINE_ACCENT = "Measure what matters.";

export function Hero() {
  return (
    <section style={{ position: "relative", paddingTop: 56, paddingBottom: 64 }}>
      <div className="container">
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.05fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* Left: copy */}
          <div>
            <Reveal>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                <span className="chip" style={{ borderRadius: 100 }}>
                  <Icon name="cube" size={13} /> Workplace performance platform
                </span>
                <SwedenChip />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="h-display" style={{ margin: "0 0 22px" }}>
                <span>{HEADLINE_LEAD} </span>
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {HEADLINE_ACCENT}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="lede" style={{ margin: "0 0 30px" }}>
                Daily cognitive training, longitudinal performance trends, and biomarker-based health
                insights — in one platform that managers and employees actually use.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn-primary">
                  Book a demo <ArrowRight size={14} />
                </button>
                <button className="btn btn-glass">See how it works</button>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <div
                style={{
                  marginTop: 32,
                  paddingTop: 22,
                  borderTop: "1px solid rgba(15,29,69,0.08)",
                  display: "flex",
                  gap: 22,
                  flexWrap: "wrap",
                  alignItems: "center",
                  fontSize: 12,
                  color: "var(--ink-3)",
                  letterSpacing: "0.04em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="lock" size={13} /> GDPR-native
                </span>
                <span>·</span>
                <span>ISO 27001 in progress</span>
                <span>·</span>
                <span>SOC 2 in progress</span>
              </div>
            </Reveal>
          </div>

          {/* Right: dashboard */}
          <Reveal delay={2}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -40,
                  zIndex: -1,
                  opacity: 0.45,
                  background:
                    "radial-gradient(60% 60% at 50% 40%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 70%)",
                }}
              />
              <HeroDashboard />
              <div
                className="glass-strong"
                style={{
                  position: "absolute",
                  bottom: -26,
                  left: -32,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 18,
                  boxShadow: "0 18px 40px rgba(15,29,69,0.16)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, var(--secondary), var(--secondary-deep))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <Icon name="bolt" size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--ink-3)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Today · 7 min
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>
                    Working memory · session 4
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
