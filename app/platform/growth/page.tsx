import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { Reveal } from "../../components/Reveal";
import { Icon } from "../../components/Icons";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "WelloRise — daily cognitive training for teams | WelloWork",
  description:
    "WelloRise is daily cognitive training across working memory, processing speed, attention, problem solving, and cognitive flexibility — built for busy work weeks.",
  path: "/platform/growth",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Growth — WelloRise", href: "/platform/growth" },
];

const CONSTRUCTS = [
  { icon: "brain", label: "Working memory" },
  { icon: "bolt", label: "Processing speed" },
  { icon: "target", label: "Attention" },
  { icon: "cube", label: "Problem solving" },
  { icon: "swap", label: "Cognitive flexibility" },
] as const;

const CONSUMER_POINTS = [
  "Optimised for engagement",
  "Standalone score",
  "Personal entertainment",
  "Single-user data",
  "No work context",
] as const;

const WELLORISE_POINTS = [
  "Optimised for stable signal",
  "Longitudinal trend",
  "Workplace performance layer",
  "Feeds team dashboard",
  "Annotated to work events",
] as const;

const EMPLOYEE_CARDS = [
  { icon: "spark", title: "Adaptive to you", sub: "Calibrated per domain" },
  { icon: "star", title: "Tokens fund learning", sub: "Redeem for courses & growth" },
  { icon: "users", title: "Help peers, earn more", sub: "A token-paid task marketplace" },
  { icon: "lock", title: "Your data, private", sub: "Managers see aggregates only" },
] as const;

const MANAGER_CARDS = [
  { icon: "chart", title: "Trends across the year", sub: "90-day, 6-month, 12-month views" },
  { icon: "layers", title: "Team composition fit", sub: "Rooted in cognitive strengths" },
  { icon: "pulse", title: "Variability where it matters", sub: "For operations-critical roles" },
  { icon: "calendar", title: "Annotated to work events", sub: "Sprints, releases, on-call" },
] as const;

const SECTION_HEADING: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(24px, 2.8vw, 34px)",
  lineHeight: 1.2,
  letterSpacing: "-0.015em",
  color: "var(--ink-1)",
  margin: 0,
  textWrap: "balance",
};

const SECTION_INTRO: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.6,
  color: "var(--ink-2)",
  margin: "12px 0 0",
  maxWidth: "60ch",
};

export default function GrowthPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloRise — Daily cognitive training",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Cognitive training",
      areaServed: ["EU", "UK"],
      url: `${SITE_URL}/platform/growth`,
      description:
        "Adaptive daily cognitive exercises across five validated constructs, integrated with team composition and longitudinal performance trends.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="WelloRise — Growth"
        title={
          <>
            Daily cognitive training that fits in a{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              coffee break.
            </span>
          </>
        }
        lede="WelloRise is a daily cognitive training product designed for working weeks, not lab conditions. Five to ten minutes a day across five validated cognitive constructs — with a token economy that funds learning."
        crumbs={CRUMBS}
      />

      {/* Short answer block */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>What is WelloRise?</strong> The daily cognitive-training layer of the
              WelloWork platform — adaptive sessions across five validated constructs, paid in
              tokens, feeding the same longitudinal trend that managers see in aggregate.
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1. Cognitive constructs grid */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>
                What does daily cognitive training{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  actually do?
                </span>
              </h2>
              <p style={SECTION_INTRO}>
                Five validated constructs, trained in short adaptive sessions.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 16,
            }}
            className="construct-grid"
          >
            {CONSTRUCTS.map((c, i) => (
              <Reveal key={c.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <article
                  className="glass lift"
                  style={{
                    padding: 22,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 14,
                    minHeight: 150,
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
                    <Icon name={c.icon} size={22} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 16,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      margin: 0,
                      color: "var(--ink-1)",
                    }}
                  >
                    {c.label}
                  </h3>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Comparison */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>
                How is it different from a{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  brain-training app?
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div
              className="glass"
              style={{
                padding: 0,
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
              data-compare
            >
              {/* Consumer side */}
              <div
                style={{
                  padding: "32px 32px",
                  background: "rgba(15,29,69,0.03)",
                  borderRight: "1px solid rgba(15,29,69,0.08)",
                }}
                className="cmp-col cmp-col-consumer"
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 100,
                    background: "rgba(15,29,69,0.06)",
                    border: "1px solid rgba(15,29,69,0.10)",
                    color: "var(--ink-3)",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  Consumer app
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {CONSUMER_POINTS.map((p) => (
                    <li
                      key={p}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: "var(--ink-3)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          background: "rgba(15,29,69,0.06)",
                          border: "1px solid rgba(15,29,69,0.10)",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path
                            d="M2 5h6"
                            stroke="var(--ink-3)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* WelloRise side */}
              <div
                style={{
                  padding: "32px 32px",
                  background:
                    "linear-gradient(160deg, color-mix(in oklch, var(--accent) 10%, white), white)",
                }}
                className="cmp-col cmp-col-wellorise"
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 100,
                    background: "color-mix(in oklch, var(--accent) 14%, white)",
                    border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
                    color: "var(--primary)",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  <span className="italic-serif" style={{ textTransform: "none", letterSpacing: 0, fontSize: 14 }}>
                    WelloRise
                  </span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {WELLORISE_POINTS.map((p) => (
                    <li
                      key={p}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: "var(--ink-1)",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          background: "color-mix(in oklch, var(--accent) 18%, white)",
                          border: "1px solid color-mix(in oklch, var(--accent) 35%, transparent)",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M4 12l5 5L20 6"
                            stroke="var(--primary)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Employee */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>
                What's in it for the{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  employee?
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-2">
            {EMPLOYEE_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <BenefitCard icon={c.icon} title={c.title} sub={c.sub} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Manager */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>
                What's in it for the{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  manager?
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-2">
            {MANAGER_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <BenefitCard icon={c.icon} title={c.title} sub={c.sub} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid
        eyebrow="What's included"
        title={
          <>
            What does <span className="italic-serif" style={{ color: "var(--accent)" }}>WelloRise</span> ship with?
          </>
        }
        items={[
          {
            icon: "brain",
            title: "Five validated cognitive domains",
            body: "Working memory, processing speed, attention, problem solving, and cognitive flexibility — mapped to construct-level literature.",
          },
          {
            icon: "spark",
            title: "Adaptive difficulty",
            body: "Each session calibrates per domain. Underchallenged employees don't plateau; overstretched ones don't burn out.",
          },
          {
            icon: "star",
            title: "Token economy",
            body: "Sessions earn tokens that redeem for courses, growth tracks, or peer help — funding learning the team already wants.",
          },
          {
            icon: "users",
            title: "Team Composition engine",
            body: "Recommends optimal team blends per project, based on aggregated cognitive profiles and prior performance.",
          },
          {
            icon: "chart",
            title: "Longitudinal trends",
            body: "Every session is a data point. Trends, not single scores, drive the manager view and promotion-readiness signals.",
          },
          {
            icon: "lock",
            title: "Employee-first privacy",
            body: "Individual session results are private to the employee. Managers see anonymised, aggregated trends only.",
          },
        ]}
      />

      <CTASection
        title={
          <>
            See WelloRise inside the{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              manager dashboard.
            </span>
          </>
        }
        body="A 30-minute walkthrough with sample data from your industry — and a candid pilot conversation."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Compare platform tiers", href: "/#pricing" }}
      />
    </SiteShell>
  );
}

function BenefitCard({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <article
      className="glass lift"
      style={{
        padding: 26,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 160,
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
        <Icon name={icon} size={22} />
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
        }}
      >
        {title}
      </h3>
      {sub && (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--ink-3)" }}>{sub}</p>
      )}
    </article>
  );
}
