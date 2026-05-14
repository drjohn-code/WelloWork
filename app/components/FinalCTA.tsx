import { Reveal } from "./Reveal";
import { ArrowRight } from "./Icons";
import { SwedenChip } from "./Chips";

export function FinalCTA() {
  return (
    <section style={{ padding: "40px 0 96px" }}>
      <div className="container">
        <Reveal>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 32,
              padding: "72px 56px",
              minHeight: 320,
              background: `
                radial-gradient(40% 60% at 8% 30%, color-mix(in oklch, var(--accent) 45%, transparent) 0%, transparent 60%),
                radial-gradient(45% 70% at 95% 70%, color-mix(in oklch, var(--secondary-deep) 60%, transparent) 0%, transparent 65%),
                linear-gradient(135deg, #FBFCFE 0%, #EEF3FE 100%)
              `,
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 24px 80px rgba(15,29,69,0.10)",
              textAlign: "center",
            }}
          >
            <SwedenChip />
            <h2 className="h-section" style={{ margin: "20px auto 16px", maxWidth: "22ch" }}>
              See your team’s cognitive performance —{" "}
              <span className="italic-serif" style={{ color: "var(--accent)" }}>
                in one demo.
              </span>
            </h2>
            <p className="lede" style={{ margin: "0 auto 32px", maxWidth: "56ch" }}>
              A 30-minute walkthrough of the manager dashboard with realistic sample data
              from your industry. No fictional ROI charts.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary"
                style={{ background: "var(--navy)", boxShadow: "0 12px 32px rgba(15,29,69,0.25)" }}
              >
                Book a demo <ArrowRight size={14} />
              </button>
              <button className="btn btn-glass">Email us</button>
            </div>
            <div
              style={{
                marginTop: 32,
                fontSize: 12,
                color: "var(--ink-3)",
                letterSpacing: "0.04em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Made in Stockholm · GDPR-native · ISO 27001 in progress
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
