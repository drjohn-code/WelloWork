import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowRight, ArrowUpRight, Icon } from "./Icons";

const CONSTRUCTS = [
  { name: "Working memory", cap: "N-back, span tasks · Baddeley, 1992" },
  { name: "Processing speed", cap: "Symbol substitution · Wechsler, classic" },
  { name: "Attention", cap: "Sustained & selective · Posner paradigms" },
  { name: "Problem solving", cap: "Tower & Raven-style reasoning" },
  { name: "Cognitive flexibility", cap: "Task-switching costs · Monsell, 2003" },
];

export function ResearchSection() {
  return (
    <section id="research" className="section">
      <div className="container">
        <div
          className="rs-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <Reveal>
            <div>
              <span className="eyebrow">Research & evidence</span>
              <h2 className="h-section" style={{ margin: "8px 0 18px" }}>
                Built on constructs the{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  field already validates.
                </span>
              </h2>
              <p className="lede" style={{ margin: "0 0 24px" }}>
                Every cognitive exercise on the platform maps to a construct with a long literature
                — not an in-house metric we invented. We publish methodology as we generate pilot data.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/research/methodology"
                  className="btn btn-secondary"
                  style={{ padding: "12px 20px", fontSize: 14 }}
                >
                  Methodology overview <ArrowRight size={14} />
                </Link>
                <Link
                  href="/research"
                  className="btn btn-ghost"
                  style={{ padding: "12px 20px", fontSize: 14, color: "var(--ink-2)" }}
                >
                  Research page <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="glass" style={{ padding: 6, background: "rgba(255,255,255,0.6)" }}>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {CONSTRUCTS.map((c, i) => (
                  <li
                    key={c.name}
                    style={{
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      borderBottom: i < CONSTRUCTS.length - 1 ? "1px solid rgba(15,29,69,0.06)" : "none",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "linear-gradient(135deg, var(--accent), var(--primary))",
                        color: "white",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 11,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "var(--ink-1)",
                        }}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{c.cap}</div>
                    </div>
                    <Icon name="search" size={14} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
