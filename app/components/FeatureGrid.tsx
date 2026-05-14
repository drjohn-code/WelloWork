import { Reveal } from "./Reveal";
import { Icon } from "./Icons";

export type FeatureItem = {
  icon: string;
  title: string;
  body: string;
};

export function FeatureGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  items: FeatureItem[];
}) {
  return (
    <section style={{ padding: "56px 0" }}>
      <div className="container">
        {(eyebrow || title) && (
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 32 }}>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {title && (
                <h2 className="h-section" style={{ margin: "8px 0 0", fontSize: "clamp(26px,3.2vw,40px)" }}>
                  {title}
                </h2>
              )}
            </div>
          </Reveal>
        )}
        <div className="grid grid-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <article
                className="glass lift"
                style={{
                  padding: 26,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  minHeight: 220,
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
                    fontSize: 18,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "var(--ink-1)",
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
