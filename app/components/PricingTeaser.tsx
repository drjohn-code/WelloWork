import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowRight } from "./Icons";

type Plan = {
  name: string;
  desc: string;
  price: string;
  unit: string;
  features: readonly string[];
  cta: string;
  ctaHref: string;
  featured: boolean;
  note?: string;
};

const PLANS: readonly Plan[] = [
  {
    name: "Platform",
    desc: "Per-employee SaaS access to WelloRise and WelloWize.",
    price: "€12",
    unit: "per employee · per month",
    features: [
      "Daily cognitive training (WelloRise)",
      "Hiring & internal assessments (WelloWize)",
      "Manager dashboards & trend analytics",
      "GDPR-native data residency",
    ],
    cta: "Talk to sales",
    ctaHref: "/contact",
    featured: false,
  },
  {
    name: "Platform + Services",
    desc: "Adds workshops and biomarker testing on a per-engagement basis.",
    price: "from €28",
    unit: "per employee · per month · platform + per-engagement services",
    features: [
      "Everything in Platform",
      "Live health workshops, on-site or remote",
      "Blood (longevity) & urine sample testing",
      "Dedicated CSM and report templates",
    ],
    cta: "Book a scoping call",
    ctaHref: "/book-a-demo",
    featured: true,
    note: "Workshop and biomarker testing volumes are scoped per engagement and confirmed in the call.",
  },
] as const;

export function PricingTeaser() {
  return (
    <section id="pricing" className="section">
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="eyebrow">Pricing</span>
            <h2 className="h-section" style={{ margin: "8px 0 12px" }}>
              Two ways to start.{" "}
              <span className="italic-serif" style={{ color: "var(--accent)" }}>
                Both shaped to your pilot.
              </span>
            </h2>
            <p className="lede" style={{ margin: "0 auto", maxWidth: "52ch" }}>
              We price against the size and stage of your pilot — full numbers in the call.
            </p>
          </div>
        </Reveal>

        <div className="pr-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={(i + 1) as 1 | 2}>
              <article
                className={`glass lift ${p.featured ? "pr-featured" : ""}`}
                style={{
                  padding: 32,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  background: p.featured
                    ? "linear-gradient(160deg, color-mix(in oklch, var(--accent) 8%, white), white)"
                    : undefined,
                  borderColor: p.featured
                    ? "color-mix(in oklch, var(--accent) 40%, var(--glass-border))"
                    : undefined,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 className="h-card" style={{ margin: 0, fontSize: 24 }}>
                    {p.name}
                  </h3>
                  {p.featured && (
                    <span className="chip" style={{ fontSize: 11, padding: "4px 10px" }}>
                      Most teams start here
                    </span>
                  )}
                </div>
                <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                  {p.desc}
                </p>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 32,
                      color: "var(--ink-1)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {p.price}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{p.unit}</div>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {p.features.map((f) => (
                    <li
                      key={f}
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
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          flexShrink: 0,
                          marginTop: 1,
                          background: "color-mix(in oklch, var(--accent) 18%, white)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24">
                          <path
                            d="M5 12l5 5L20 7"
                            stroke="var(--primary)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {p.note && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: "var(--ink-3)",
                    }}
                  >
                    {p.note}
                  </p>
                )}
                <Link
                  href={p.ctaHref}
                  className={`btn ${p.featured ? "btn-primary" : "btn-secondary"}`}
                  style={{ marginTop: "auto" }}
                >
                  {p.cta} <ArrowRight size={14} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
