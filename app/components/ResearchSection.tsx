import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { ArrowRight, ArrowUpRight, Icon } from "./Icons";

export function ResearchSection() {
  const t = useTranslations("researchTeaser");
  const CONSTRUCTS = t.raw("constructs") as { name: string; cap: string }[];
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
              <span className="eyebrow">{t("eyebrow")}</span>
              <h2 className="h-section" style={{ margin: "8px 0 18px" }}>
                {t("heading.lead")}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("heading.accent")}
                </span>
              </h2>
              <p className="lede" style={{ margin: "0 0 24px" }}>
                {t("lede")}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/research/methodology"
                  className="btn btn-secondary"
                  style={{ padding: "12px 20px", fontSize: 14 }}
                >
                  {t("cta.methodology")} <ArrowRight size={14} />
                </Link>
                <Link
                  href="/research"
                  className="btn btn-ghost"
                  style={{ padding: "12px 20px", fontSize: 14, color: "var(--ink-2)" }}
                >
                  {t("cta.research")} <ArrowUpRight size={12} />
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
