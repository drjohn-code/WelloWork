import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Breadcrumbs } from "../../components/Breadcrumbs";
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

type ConstructTint = {
  bg: string;
  border: string;
  iconBg: string;
  spark: string;
};

const CONSTRUCTS: ReadonlyArray<{
  icon: string;
  label: string;
  desc: string;
  tint: ConstructTint;
  spark: string;
}> = [
  {
    icon: "brain",
    label: "Working memory",
    desc: "Hold and update information in mind — the cognitive workbench for complex work.",
    tint: {
      bg: "linear-gradient(160deg, rgba(92,115,251,0.10), rgba(255,255,255,0.6))",
      border: "rgba(92,115,251,0.22)",
      iconBg: "linear-gradient(135deg, rgba(92,115,251,0.28), rgba(227,238,249,0.7))",
      spark: "rgba(92,115,251,0.55)",
    },
    spark: "M2 22 L10 16 L18 19 L28 10 L38 12 L48 6",
  },
  {
    icon: "bolt",
    label: "Processing speed",
    desc: "How quickly you take in, evaluate, and respond to new information under pressure.",
    tint: {
      bg: "linear-gradient(160deg, rgba(245,200,130,0.18), rgba(255,255,255,0.6))",
      border: "rgba(220,170,90,0.28)",
      iconBg: "linear-gradient(135deg, rgba(245,200,130,0.40), rgba(255,247,232,0.85))",
      spark: "rgba(202,143,52,0.65)",
    },
    spark: "M2 18 L9 14 L16 17 L24 9 L32 12 L40 5 L48 8",
  },
  {
    icon: "target",
    label: "Attention",
    desc: "Sustain focus on what matters and filter out what doesn't.",
    tint: {
      bg: "linear-gradient(160deg, rgba(140,220,200,0.20), rgba(255,255,255,0.6))",
      border: "rgba(80,180,150,0.28)",
      iconBg: "linear-gradient(135deg, rgba(140,220,200,0.40), rgba(232,250,244,0.85))",
      spark: "rgba(60,160,130,0.65)",
    },
    spark: "M2 14 L10 16 L18 10 L26 12 L34 6 L42 9 L48 4",
  },
  {
    icon: "cube",
    label: "Problem solving",
    desc: "Reason through novel situations and adapt to unfamiliar constraints.",
    tint: {
      bg: "linear-gradient(160deg, rgba(167,139,250,0.16), rgba(255,255,255,0.6))",
      border: "rgba(139,107,217,0.26)",
      iconBg: "linear-gradient(135deg, rgba(167,139,250,0.36), rgba(244,239,254,0.85))",
      spark: "rgba(124,90,200,0.65)",
    },
    spark: "M2 20 L10 18 L18 14 L26 16 L34 8 L42 10 L48 6",
  },
  {
    icon: "swap",
    label: "Cognitive flexibility",
    desc: "Switch between tasks, perspectives, and mental models on the fly.",
    tint: {
      bg: "linear-gradient(160deg, rgba(244,168,184,0.16), rgba(255,255,255,0.6))",
      border: "rgba(220,130,150,0.26)",
      iconBg: "linear-gradient(135deg, rgba(244,168,184,0.36), rgba(254,238,242,0.85))",
      spark: "rgba(200,90,120,0.6)",
    },
    spark: "M2 12 L10 18 L18 10 L26 16 L34 8 L42 14 L48 6",
  },
];

const CONSUMER_POINTS = [
  "Optimised for engagement",
  "Standalone score",
  "Personal entertainment",
  "Single-user data",
  "No work context",
] as const;

const WELLORISE_POINTS: ReadonlyArray<{ label: string; why: string }> = [
  {
    label: "Optimised for stable signal",
    why: "Same task design and difficulty curve — so a score this month is comparable to one next quarter.",
  },
  {
    label: "Longitudinal trend",
    why: "We watch how each domain moves over weeks, not the score on any single day.",
  },
  {
    label: "Workplace performance layer",
    why: "Sits inside the same platform as assessment, workshops, and team composition.",
  },
  {
    label: "Feeds team dashboard",
    why: "Aggregated, anonymised signal flows to managers — never individual results.",
  },
  {
    label: "Annotated to work events",
    why: "Sprints, releases, and on-call shifts get tagged on the trend line.",
  },
];

type BenefitCardData = {
  icon: string;
  title: string;
  sub: string;
  body: string;
  accent: string;
  tintBg: string;
  tintBorder: string;
};

const EMPLOYEE_CARDS: ReadonlyArray<BenefitCardData> = [
  {
    icon: "spark",
    title: "Adaptive to you",
    sub: "Calibrated per domain",
    body: "Every session adjusts to your current level across all five constructs. You're stretched, not overwhelmed — and never bored.",
    accent: "var(--accent)",
    tintBg: "linear-gradient(155deg, rgba(92,115,251,0.10), rgba(255,255,255,0.55))",
    tintBorder: "rgba(92,115,251,0.22)",
  },
  {
    icon: "star",
    title: "Tokens fund learning",
    sub: "Redeem for courses & growth",
    body: "Daily sessions earn tokens. Spend them on books, courses, or growth tracks — funded by a budget the team already has.",
    accent: "#C99043",
    tintBg: "linear-gradient(155deg, rgba(245,200,130,0.18), rgba(255,255,255,0.55))",
    tintBorder: "rgba(220,170,90,0.26)",
  },
  {
    icon: "users",
    title: "Help peers, earn more",
    sub: "A token-paid task marketplace",
    body: "Mentor a teammate, run a lunchtime workshop, or pick up a stretch task from the marketplace — peers pay you in tokens.",
    accent: "#3FA084",
    tintBg: "linear-gradient(155deg, rgba(140,220,200,0.20), rgba(255,255,255,0.55))",
    tintBorder: "rgba(80,180,150,0.26)",
  },
  {
    icon: "lock",
    title: "Your data, private",
    sub: "Managers see aggregates only",
    body: "Individual session results stay with you. Managers only see anonymised, aggregated trends — never single-person scores.",
    accent: "#7A5BC9",
    tintBg: "linear-gradient(155deg, rgba(167,139,250,0.16), rgba(255,255,255,0.55))",
    tintBorder: "rgba(139,107,217,0.24)",
  },
];

const MANAGER_CARDS: ReadonlyArray<BenefitCardData> = [
  {
    icon: "chart",
    title: "Trends across the year",
    sub: "90-day, 6-month, 12-month views",
    body: "Rolling longitudinal views show whether the team is improving or drifting — long before a single survey could surface it.",
    accent: "var(--accent)",
    tintBg: "linear-gradient(155deg, rgba(92,115,251,0.10), rgba(255,255,255,0.55))",
    tintBorder: "rgba(92,115,251,0.22)",
  },
  {
    icon: "layers",
    title: "Team composition fit",
    sub: "Rooted in cognitive strengths",
    body: "Recommend the right blend of cognitive strengths for a project, sprint, or task force — based on aggregated profiles, not guesses.",
    accent: "#7A5BC9",
    tintBg: "linear-gradient(155deg, rgba(167,139,250,0.16), rgba(255,255,255,0.55))",
    tintBorder: "rgba(139,107,217,0.24)",
  },
  {
    icon: "pulse",
    title: "Variability where it matters",
    sub: "For operations-critical roles",
    body: "For operations-critical roles, watch for variability spikes in attention and processing speed that often precede error windows.",
    accent: "#3FA084",
    tintBg: "linear-gradient(155deg, rgba(140,220,200,0.20), rgba(255,255,255,0.55))",
    tintBorder: "rgba(80,180,150,0.26)",
  },
  {
    icon: "calendar",
    title: "Annotated to work events",
    sub: "Sprints, releases, on-call",
    body: "Sprint cuts, releases, and on-call rotations are tagged on the trend line — so you can see which work patterns cost the team.",
    accent: "#C99043",
    tintBg: "linear-gradient(155deg, rgba(245,200,130,0.18), rgba(255,255,255,0.55))",
    tintBorder: "rgba(220,170,90,0.26)",
  },
];

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

      {/* Hero — two-column with daily session mock */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>
          <div
            className="hero-grid"
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <Reveal delay={1}>
                <span className="eyebrow">WelloRise — Growth</span>
              </Reveal>
              <Reveal delay={1}>
                <h1
                  className="h-section"
                  style={{
                    margin: "10px 0 18px",
                    maxWidth: "22ch",
                    fontSize: "clamp(34px, 5vw, 58px)",
                  }}
                >
                  Daily cognitive training that fits in a{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    coffee break.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  WelloRise is a daily cognitive training product designed for working weeks, not
                  lab conditions. Five to ten minutes a day across five validated cognitive
                  constructs — with a token economy that funds learning.
                </p>
              </Reveal>
            </div>
            <Reveal delay={3}>
              <DailySessionCard />
            </Reveal>
          </div>
        </div>
      </section>

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
                  className="lift"
                  style={{
                    position: "relative",
                    padding: 22,
                    paddingBottom: 26,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 12,
                    minHeight: 200,
                    background: c.tint.bg,
                    border: `1px solid ${c.tint.border}`,
                    borderRadius: "var(--r-card)",
                    boxShadow: "var(--glass-shadow)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: c.tint.iconBg,
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
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "var(--ink-2)",
                    }}
                  >
                    {c.desc}
                  </p>
                  <svg
                    width="60"
                    height="26"
                    viewBox="0 0 50 26"
                    fill="none"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: 18,
                      bottom: 14,
                      opacity: 0.75,
                    }}
                  >
                    <path
                      d={c.spark}
                      stroke={c.tint.spark}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
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
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
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
                        textDecoration: "line-through",
                        textDecorationColor: "rgba(15,29,69,0.25)",
                        textDecorationThickness: "1px",
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
                  <span
                    className="italic-serif"
                    style={{ textTransform: "none", letterSpacing: 0, fontSize: 14 }}
                  >
                    WelloRise
                  </span>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
                  {WELLORISE_POINTS.map((p) => (
                    <li
                      key={p.label}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        fontFamily: "var(--font-body)",
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
                          marginTop: 2,
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
                      <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span
                          style={{
                            fontSize: 15,
                            color: "var(--ink-1)",
                            fontWeight: 600,
                            lineHeight: 1.35,
                          }}
                        >
                          {p.label}
                        </span>
                        <span
                          style={{
                            fontSize: 13.5,
                            color: "var(--ink-2)",
                            lineHeight: 1.5,
                          }}
                        >
                          {p.why}
                        </span>
                      </span>
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
                <BenefitCard {...c} />
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
                <BenefitCard {...c} />
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

function BenefitCard({
  icon,
  title,
  sub,
  body,
  accent,
  tintBg,
  tintBorder,
}: BenefitCardData) {
  return (
    <article
      className="lift"
      style={{
        position: "relative",
        padding: 26,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 200,
        background: tintBg,
        border: `1px solid ${tintBorder}`,
        borderRadius: "var(--r-card)",
        boxShadow: "var(--glass-shadow)",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: 48,
          background: accent,
          borderRadius: "0 4px 4px 0",
        }}
      />
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
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: accent,
          }}
        >
          {sub}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 14.5,
          lineHeight: 1.55,
          color: "var(--ink-2)",
        }}
      >
        {body}
      </p>
    </article>
  );
}

function DailySessionCard() {
  // Progress ring: 3 of 5 constructs complete = 60%
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.6;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="glass-strong"
      style={{
        position: "relative",
        padding: 28,
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient orb */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--accent) 30%, transparent), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            Today's session
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink-1)",
              letterSpacing: "-0.01em",
            }}
          >
            5 minutes to keep your trend
          </span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: 100,
            background: "color-mix(in oklch, var(--accent) 14%, white)",
            border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
            color: "var(--primary)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--accent)",
              boxShadow: "0 0 0 3px color-mix(in oklch, var(--accent) 25%, transparent)",
            }}
          />
          Live
        </span>
      </div>

      {/* Progress ring + current task */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 132,
            height: 132,
            flexShrink: 0,
          }}
        >
          <svg
            width="132"
            height="132"
            viewBox="0 0 132 132"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <circle
              cx="66"
              cy="66"
              r={radius}
              stroke="rgba(22,43,92,0.10)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="66"
              cy="66"
              r={radius}
              stroke="url(#ringGrad)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 66 66)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 30,
                lineHeight: 1,
                color: "var(--ink-1)",
                letterSpacing: "-0.02em",
              }}
            >
              3
              <span style={{ color: "var(--ink-3)", fontWeight: 500, fontSize: 18 }}>
                {" "}
                / 5
              </span>
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: "var(--ink-3)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              constructs
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            In progress
          </span>
          <div
            style={{
              marginTop: 6,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 17,
              color: "var(--ink-1)",
              letterSpacing: "-0.01em",
            }}
          >
            Working memory
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 13,
              color: "var(--ink-3)",
            }}
          >
            Task 2 of 3
          </div>
          <div
            className="mini-bar"
            style={{ marginTop: 14, height: 6 }}
            aria-label="Task progress"
          >
            <div style={{ width: "66%" }} />
          </div>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--ink-3)",
            }}
          >
            <span>2:14 elapsed</span>
            <span>~3 min left</span>
          </div>
        </div>
      </div>

      {/* Completed constructs row */}
      <div
        style={{
          marginTop: 22,
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Attention", done: true },
          { label: "Flexibility", done: true },
          { label: "Processing", done: true },
          { label: "Memory", done: false, active: true },
          { label: "Problem solving", done: false },
        ].map((d) => (
          <span
            key={d.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 100,
              fontSize: 11.5,
              fontWeight: 600,
              background: d.done
                ? "color-mix(in oklch, var(--accent) 16%, white)"
                : d.active
                  ? "white"
                  : "rgba(15,29,69,0.04)",
              border: d.done
                ? "1px solid color-mix(in oklch, var(--accent) 35%, transparent)"
                : d.active
                  ? "1px solid var(--accent)"
                  : "1px solid rgba(15,29,69,0.10)",
              color: d.done
                ? "var(--primary)"
                : d.active
                  ? "var(--primary)"
                  : "var(--ink-3)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: d.done
                  ? "var(--accent)"
                  : d.active
                    ? "var(--accent)"
                    : "rgba(15,29,69,0.15)",
                boxShadow: d.active
                  ? "0 0 0 3px color-mix(in oklch, var(--accent) 25%, transparent)"
                  : "none",
              }}
            />
            {d.label}
          </span>
        ))}
      </div>

      {/* Token reward callout */}
      <div
        style={{
          marginTop: 20,
          padding: "12px 14px",
          borderRadius: 16,
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--accent) 12%, white), white)",
          border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--primary)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "-0.01em",
            boxShadow: "0 6px 18px color-mix(in oklch, var(--primary) 35%, transparent)",
            flexShrink: 0,
          }}
        >
          +12
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14.5,
              color: "var(--ink-1)",
              letterSpacing: "-0.005em",
            }}
          >
            +12 tokens earned today
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
            Redeem for courses, books, or peer help
          </span>
        </div>
      </div>
    </div>
  );
}
