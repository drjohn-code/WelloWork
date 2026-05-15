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
  title: "WelloWize — cognitive & technical assessments | WelloWork",
  description:
    "WelloWize is one assessment framework for hiring panels and internal benchmarking. Cognitive and technical, scored against role and tenure — defensible at the offer stage and after.",
  path: "/platform/assessment",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Assessment — WelloWize", href: "/platform/assessment" },
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

type MeasureCard = {
  icon: string;
  title: string;
  body: string;
  tintBg: string;
  tintBorder: string;
  spark: string;
  sparkColor: string;
};

const MEASURE_CARDS: ReadonlyArray<MeasureCard> = [
  {
    icon: "brain",
    title: "Five cognitive domains",
    body: "Working memory, processing speed, attention, problem solving, and cognitive flexibility — aligned with the platform's literature-backed constructs.",
    tintBg: "linear-gradient(160deg, rgba(92,115,251,0.10), rgba(255,255,255,0.6))",
    tintBorder: "rgba(92,115,251,0.22)",
    spark: "M2 22 L10 16 L18 19 L28 10 L38 12 L48 6",
    sparkColor: "rgba(92,115,251,0.55)",
  },
  {
    icon: "cube",
    title: "Role-specific technical screens",
    body: "SQL, TypeScript, statistics, and other role-relevant skills — added per role, scored alongside the cognitive profile.",
    tintBg: "linear-gradient(160deg, rgba(167,139,250,0.16), rgba(255,255,255,0.6))",
    tintBorder: "rgba(139,107,217,0.26)",
    spark: "M2 20 L12 18 L22 12 L32 14 L42 6 L48 9",
    sparkColor: "rgba(124,90,200,0.6)",
  },
  {
    icon: "pulse",
    title: "Time-on-task patterns",
    body: "Self-pacing and fatigue signals are read into context — used to interpret a score, not to penalise the candidate.",
    tintBg: "linear-gradient(160deg, rgba(140,220,200,0.20), rgba(255,255,255,0.6))",
    tintBorder: "rgba(80,180,150,0.28)",
    spark: "M2 14 L8 20 L14 12 L20 18 L26 10 L32 16 L38 8 L44 14 L48 10",
    sparkColor: "rgba(60,160,130,0.65)",
  },
];

const TIMELINE_STEPS: ReadonlyArray<{ icon: string; label: string; time: string }> = [
  { icon: "check", label: "Candidate completes", time: "~45 min" },
  { icon: "spark", label: "Results processed", time: "~2 min" },
  { icon: "users", label: "Panel notified", time: "Instant" },
];

const STANDARD_POINTS = [
  "Scoped to hiring only",
  "Ends at offer signing",
  "Single composite score",
] as const;

const WELLOWIZE_POINTS: ReadonlyArray<{ label: string; why: string }> = [
  {
    label: "Pre and post hire",
    why: "Same framework for the candidate and for the same person twelve months in — directly comparable.",
  },
  {
    label: "Continuous, re-runnable",
    why: "Quarterly re-runs feed a longitudinal trend the Measure product surfaces.",
  },
  {
    label: "Normalised profile, not a number",
    why: "A shape against the role benchmark — defensible at offer stage and easier to discuss against the job spec.",
  },
];

export default function AssessmentPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWize — Cognitive & technical assessments",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Hiring and internal assessment",
      areaServed: ["EU", "UK"],
      url: `${SITE_URL}/platform/assessment`,
      description:
        "One assessment framework for hiring candidates and internal employees — cognitive and technical, with role-level benchmarks.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — two-column with assessment results mock */}
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
                <span className="eyebrow">WelloWize — Assessment</span>
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
                  One assessment framework — hiring{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    and after.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  WelloWize gives hiring panels and people-leaders the same assessment
                  vocabulary, so the work doesn't stop at the offer letter. Cognitive and
                  technical, scored against role and tenure.
                </p>
              </Reveal>
            </div>
            <Reveal delay={3}>
              <AssessmentResultsCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Short answer block */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>What is WelloWize?</strong> WelloWork's assessment product. It
              evaluates candidates and existing employees across the same cognitive and
              technical framework, returns hiring-panel-ready results in minutes, and
              produces internal benchmarks against role and tenure that can be re-run
              quarterly.
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1. What does it actually measure? — three visual cards */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>
                What does it{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  actually measure?
                </span>
              </h2>
              <p style={SECTION_INTRO}>
                Three layers of signal, returned together as a single profile.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-3">
            {MEASURE_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <article
                  className="lift"
                  style={{
                    position: "relative",
                    padding: 26,
                    paddingBottom: 30,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    minHeight: 220,
                    background: c.tintBg,
                    border: `1px solid ${c.tintBorder}`,
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
                      fontSize: 18,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      margin: 0,
                      color: "var(--ink-1)",
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "var(--ink-2)",
                    }}
                  >
                    {c.body}
                  </p>
                  <svg
                    width="64"
                    height="28"
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
                      stroke={c.sparkColor}
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

      {/* 2. Hiring panel results in minutes — text + timeline */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <Reveal>
              <div>
                <h2 style={SECTION_HEADING}>
                  Hiring panel results in{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    minutes.
                  </span>
                </h2>
                <p style={{ ...SECTION_INTRO, marginTop: 16 }}>
                  Once a candidate completes the assessment, the hiring panel sees a
                  normalised profile against the role benchmark. This is intentionally a
                  profile, not a single number — defensible at the offer stage and easier
                  to discuss against the job spec.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <TimelineCard steps={TIMELINE_STEPS} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Internal benchmarks — text + benchmark chart */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <Reveal delay={1}>
              <BenchmarkChart />
            </Reveal>
            <Reveal>
              <div>
                <h2 style={SECTION_HEADING}>
                  Internal benchmarks against{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    role + tenure.
                  </span>
                </h2>
                <p style={{ ...SECTION_INTRO, marginTop: 16 }}>
                  Internally, WelloWize can be re-run on a schedule. Results feed the
                  longitudinal trend the Measure product surfaces — so promotion-readiness
                  decisions are grounded in a trend across the year, rather than the score
                  someone happened to post on assessment day.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. How does WelloWize differ — comparison split */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>
                How does WelloWize differ from a{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  hiring assessment tool?
                </span>
              </h2>
              <p style={SECTION_INTRO}>
                Most tools end the moment a candidate signs. WelloWize uses the same
                framework before and after the offer letter.
              </p>
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
              {/* Standard tool side */}
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
                  Standard tool
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
                  {STANDARD_POINTS.map((p) => (
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

              {/* WelloWize side */}
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
                    WelloWize
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
                  {WELLOWIZE_POINTS.map((p) => (
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

      <FeatureGrid
        eyebrow="What's included"
        title="What does WelloWize ship with?"
        items={[
          {
            icon: "target",
            title: "Cognitive + technical, one framework",
            body: "Five cognitive domains plus role-specific technical screens — no separate vendor for each piece.",
          },
          {
            icon: "flow",
            title: "Hiring panel reports in minutes",
            body: "Normalised profile against the role benchmark, ready to discuss against the job spec.",
          },
          {
            icon: "scale",
            title: "Role + tenure benchmarks",
            body: "Internal scores are comparable across hires and tenures, not against a generic population.",
          },
          {
            icon: "search",
            title: "Auditable scoring",
            body: "Every score is traceable to its underlying tasks and time-on-task — defensible if a hiring decision is challenged.",
          },
          {
            icon: "chart",
            title: "Feeds longitudinal trends",
            body: "Re-runs flow into the Measure product, so promotion decisions ride on trends rather than a single test.",
          },
          {
            icon: "lock",
            title: "GDPR-native",
            body: "Candidate and employee assessment data is stored in the EU. Retention and deletion are configurable.",
          },
        ]}
      />

      <CTASection
        title="See WelloWize on real hiring panels."
        body="A 30-minute walkthrough with sample candidate profiles and a candid pilot conversation."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Read the research", href: "/research" }}
      />
    </SiteShell>
  );
}

/* ----- Hero mock: assessment results card ----- */

type DomainBar = {
  label: string;
  fill: number; // 0..1 candidate score
  benchmark: number; // 0..1 role benchmark line
  above: boolean;
};

const DOMAINS: ReadonlyArray<DomainBar> = [
  { label: "Working Memory", fill: 0.82, benchmark: 0.7, above: true },
  { label: "Processing Speed", fill: 0.66, benchmark: 0.72, above: false },
  { label: "Attention", fill: 0.78, benchmark: 0.65, above: true },
  { label: "Problem Solving", fill: 0.88, benchmark: 0.75, above: true },
  { label: "Cognitive Flexibility", fill: 0.58, benchmark: 0.68, above: false },
];

function AssessmentResultsCard() {
  return (
    <div
      className="glass-strong"
      style={{
        position: "relative",
        padding: 0,
        overflow: "hidden",
        background: "linear-gradient(160deg, rgba(255,255,255,0.78), rgba(255,255,255,0.55))",
      }}
    >
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

      {/* Window chrome */}
      <div
        style={{
          position: "relative",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(15,29,69,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
        </div>
        <div
          style={{
            marginLeft: 12,
            fontSize: 12,
            color: "var(--ink-3)",
            fontFamily: "ui-monospace,Menlo,monospace",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="lock" size={11} /> wellowize · candidate profile
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--ink-3)",
            textTransform: "uppercase",
          }}
        >
          Sample data
        </span>
      </div>

      <div
        style={{
          position: "relative",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {/* Candidate row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--primary))",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            AM
          </span>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--ink-1)",
                letterSpacing: "-0.01em",
              }}
            >
              Alex M.
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--ink-3)",
                letterSpacing: "0.02em",
              }}
            >
              Senior Engineer — candidate
            </span>
          </div>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--ink-3)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Normalised profile
          </span>
        </div>

        {/* Domain bars */}
        <div
          style={{
            padding: "14px 14px 8px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(15,29,69,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {DOMAINS.map((d) => (
            <DomainRow key={d.label} {...d} />
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "var(--ink-3)",
              padding: "2px 2px 0",
              letterSpacing: "0.04em",
            }}
          >
            <span>Low</span>
            <span style={{ fontStyle: "italic" }}>· · · role benchmark</span>
            <span>High</span>
          </div>
        </div>

        {/* Result badge */}
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 100,
            background: "color-mix(in oklch, var(--success) 14%, white)",
            border: "1px solid color-mix(in oklch, var(--success) 35%, transparent)",
            color: "#0F8463",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "var(--success)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12l5 5L20 6"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Above benchmark on 3 of 5
        </div>
      </div>
    </div>
  );
}

function DomainRow({ label, fill, benchmark, above }: DomainBar) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11.5,
          color: "var(--ink-2)",
          fontWeight: 600,
          letterSpacing: "0.01em",
        }}
      >
        <span>{label}</span>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: above ? "#0F8463" : "var(--ink-3)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {above ? "Above" : "Below"}
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 10,
          borderRadius: 999,
          background: "rgba(15,29,69,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${fill * 100}%`,
            background: above
              ? "linear-gradient(90deg, var(--secondary-deep), var(--accent))"
              : "linear-gradient(90deg, rgba(15,29,69,0.20), rgba(15,29,69,0.32))",
            borderRadius: 999,
          }}
        />
      </div>
      {/* Benchmark line overlay */}
      <div style={{ position: "relative", height: 0 }}>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -14,
            left: `calc(${benchmark * 100}% - 1px)`,
            width: 2,
            height: 18,
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--primary) 0 2px, transparent 2px 4px)",
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  );
}

/* ----- Section 2: timeline ----- */

function TimelineCard({
  steps,
}: {
  steps: ReadonlyArray<{ icon: string; label: string; time: string }>;
}) {
  return (
    <div
      className="glass-strong"
      style={{
        position: "relative",
        padding: 26,
        borderRadius: 24,
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--accent) 25%, transparent), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 22,
          position: "relative",
        }}
      >
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
          Time to panel
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 100,
            background: "color-mix(in oklch, var(--accent) 14%, white)",
            border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
            color: "var(--primary)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          ~50 min end-to-end
        </span>
      </div>

      <div style={{ position: "relative" }}>
        {/* Connecting line */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "8.33%",
            right: "8.33%",
            top: 24,
            height: 2,
            background:
              "linear-gradient(90deg, color-mix(in oklch, var(--accent) 40%, transparent), color-mix(in oklch, var(--primary) 50%, transparent))",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: 8,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, color-mix(in oklch, var(--accent) 20%, white), white)",
                  border: "1px solid color-mix(in oklch, var(--accent) 35%, transparent)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  boxShadow: "0 6px 18px color-mix(in oklch, var(--accent) 18%, transparent)",
                }}
              >
                <Icon name={s.icon} size={22} />
              </span>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--ink-1)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.3,
                }}
              >
                {s.label}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--primary)",
                  background: "rgba(92,115,251,0.10)",
                  padding: "3px 8px",
                  borderRadius: 100,
                  letterSpacing: "0.02em",
                }}
              >
                {s.time}
                {i < steps.length - 1 && (
                  <span aria-hidden="true" style={{ marginLeft: 6, opacity: 0.5 }}>
                    →
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          fontSize: 12.5,
          color: "var(--ink-3)",
          lineHeight: 1.5,
        }}
      >
        Panel gets a normalised profile, not a raw transcript. Sample timings.
      </div>
    </div>
  );
}

/* ----- Section 3: benchmark chart ----- */

function BenchmarkChart() {
  // 6 quarterly points, 0..100 score scale, plotted to a 320x140 viewBox.
  const benchmark = [62, 63, 63, 64, 64, 65];
  const employee = [54, 58, 63, 67, 72, 78];

  const W = 320;
  const H = 140;
  const padX = 16;
  const padTop = 14;
  const padBottom = 26;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;
  const maxY = 100;

  const xAt = (i: number) => padX + (innerW * i) / (benchmark.length - 1);
  const yAt = (v: number) => padTop + innerH * (1 - v / maxY);

  const benchmarkPath = benchmark
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`)
    .join(" ");
  const employeePath = employee
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`)
    .join(" ");
  const employeeArea = `${employeePath} L ${xAt(employee.length - 1).toFixed(1)} ${(H - padBottom).toFixed(1)} L ${xAt(0).toFixed(1)} ${(H - padBottom).toFixed(1)} Z`;

  const lastX = xAt(employee.length - 1);
  const lastY = yAt(employee[employee.length - 1]);
  const prevX = xAt(employee.length - 2);
  const prevY = yAt(employee[employee.length - 2]);

  return (
    <div
      className="glass-strong"
      style={{
        position: "relative",
        padding: 22,
        borderRadius: 24,
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -50,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
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
            Quarterly re-runs
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--ink-1)",
              letterSpacing: "-0.01em",
            }}
          >
            Trajectory vs role benchmark
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--ink-3)",
            textTransform: "uppercase",
          }}
        >
          Sample data
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bcEmployeeArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0.25, 0.5, 0.75, 1].map((p) => {
          const y = padTop + innerH * p;
          return (
            <line
              key={p}
              x1={padX}
              x2={W - padX}
              y1={y}
              y2={y}
              stroke="rgba(15,29,69,0.06)"
            />
          );
        })}

        {/* Employee area + line */}
        <path d={employeeArea} fill="url(#bcEmployeeArea)" />
        <path
          d={employeePath}
          stroke="var(--accent)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {employee.map((v, i) => (
          <circle
            key={i}
            cx={xAt(i)}
            cy={yAt(v)}
            r="2.8"
            fill="white"
            stroke="var(--accent)"
            strokeWidth="1.8"
          />
        ))}

        {/* Benchmark dashed line */}
        <path
          d={benchmarkPath}
          stroke="var(--primary)"
          strokeWidth="1.8"
          fill="none"
          strokeDasharray="4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* Trend arrow at end */}
        <g>
          <line
            x1={prevX}
            y1={prevY}
            x2={lastX + 14}
            y2={lastY - 10}
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <polygon
            points={`${lastX + 14},${lastY - 10} ${lastX + 6},${lastY - 12} ${lastX + 10},${lastY - 4}`}
            fill="var(--accent)"
          />
        </g>

        {/* Quarter labels */}
        {["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"].map((q, i) => (
          <text
            key={q}
            x={xAt(i)}
            y={H - 8}
            fontSize="9"
            textAnchor="middle"
            fill="rgba(15,29,69,0.5)"
          >
            {q}
          </text>
        ))}
      </svg>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginTop: 6,
          fontSize: 11.5,
          color: "var(--ink-2)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            aria-hidden="true"
            style={{
              width: 18,
              height: 2,
              background: "var(--accent)",
              borderRadius: 2,
            }}
          />
          Employee trajectory
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            aria-hidden="true"
            style={{
              width: 18,
              height: 2,
              backgroundImage:
                "repeating-linear-gradient(to right, var(--primary) 0 3px, transparent 3px 6px)",
              opacity: 0.7,
            }}
          />
          Role benchmark
        </span>
      </div>
    </div>
  );
}
