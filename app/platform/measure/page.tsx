import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Reveal } from "../../components/Reveal";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { PrivacyChip } from "../../components/Chips";
import { Icon } from "../../components/Icons";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Measure — longitudinal cognitive performance trends | WelloWork",
  description:
    "WelloWork Measure turns every training session, assessment, and workshop into a longitudinal performance trend — 90-day, 6-month, and 12-month views for managers.",
  path: "/platform/measure",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Measure — Performance trends", href: "/platform/measure" },
];

export default function MeasurePage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWork Measure — Longitudinal performance trends",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Workforce analytics",
      areaServed: ["EU", "UK"],
      url: `${SITE_URL}/platform/measure`,
      description:
        "Longitudinal cognitive performance trends, aggregated for managers and itemised for employees, auto-annotated against work events.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* HERO — two-column: copy left, trend mock card right */}
      <section style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div
            className="hero-grid"
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "1fr 1.05fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <Reveal delay={1}>
                <div style={{ marginBottom: 14 }}>
                  <span className="eyebrow">Measure — Performance trends</span>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <h1
                  className="h-section"
                  style={{ margin: "0 0 18px", maxWidth: "22ch", fontSize: "clamp(34px, 5vw, 58px)" }}
                >
                  Longitudinal performance —{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    not a one-time score.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  Measure is the trend layer of the WelloWork platform. Every session, every
                  assessment, and every workshop is a data point — aggregated for managers and
                  itemised for the employee who owns it.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <TrendMockCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIRECT ANSWER */}
      <section style={{ paddingTop: 8, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>What is WelloWork Measure?</strong> Measure turns every training session,
              assessment, and workshop interaction into a longitudinal performance signal.
              Managers see 90-day, 6-month, and 12-month aggregated trends, auto-annotated
              against work events such as sprint reviews, on-call rotations, and shift changes.
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCORE vs TREND comparison */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 12px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              Why is a trend better than a score?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 28px", maxWidth: "64ch" }}>
              A single cognitive score on a given day reflects sleep, caffeine, stress, and noise
              as much as it does the underlying domain. A trend across weeks and months filters
              that noise and shows direction — which is the only thing a manager can act on
              without unfair single-point decisions.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <ScoreVsTrendCompare />
          </Reveal>
        </div>
      </section>

      {/* WHAT CAN YOU SEE — 2x2 visual grid */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 24px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              What can you actually see?
            </h2>
          </Reveal>
          <div
            className="grid grid-2"
            style={{ gap: 20 }}
          >
            <Reveal delay={1}>
              <SeeCard
                icon="chart"
                title="Aggregated team trend"
                body="Across the five cognitive domains — anonymised, never per-person."
                decoration={<MiniLine />}
              />
            </Reveal>
            <Reveal delay={2}>
              <SeeCard
                icon="spark"
                title="Variability within the team"
                body="Useful for safety-critical and operations-critical roles where spread matters."
                decoration={<MiniScatter />}
              />
            </Reveal>
            <Reveal delay={1}>
              <SeeCard
                icon="calendar"
                title="Auto-annotation"
                body="Sprint reviews, on-call rotations, releases, and shift changes overlaid on the trend."
                decoration={<MiniPins />}
              />
            </Reveal>
            <Reveal delay={2}>
              <SeeCard
                icon="scale"
                title="Promotion-readiness signal"
                body="Grounded in trend slope across months, not a single assessment day."
                decoration={<MiniArrowUp />}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROMOTION-READINESS — copy left, signal card right */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <Reveal>
                <h2
                  className="h-section"
                  style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
                >
                  Promotion-readiness based on trend, not one test
                </h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  We&apos;re deliberate that promotion-readiness is a <em>signal</em>, not a verdict.
                  It&apos;s a starting point for a conversation between a manager, HR, and the employee
                  — one that they can run with months of comparable data behind them rather than a
                  single assessment day.
                </p>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <PromotionSignalCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* EMPLOYEE VIEW — mock card with stacked rows */}
      <section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              What does it look like for the employee?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 28px", maxWidth: "64ch" }}>
              Employees see their own data — their per-session results plus the same trend a
              manager sees in aggregate. They control what their manager and HR can see at the
              team level and can request export or deletion under the GDPR at any time.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <EmployeeViewCard />
          </Reveal>
        </div>
      </section>

      <FeatureGrid
        eyebrow="What's included"
        title="What does Measure ship with?"
        items={[
          {
            icon: "chart",
            title: "90 / 180 / 365-day views",
            body: "Three trend horizons — sprint-cadence, half-year, and full-year. Reads stay stable when one bad week happens.",
          },
          {
            icon: "calendar",
            title: "Auto-annotated against work events",
            body: "Sprint reviews, releases, shift changes, and on-call rotations are overlaid on the trend so dips don't read as mysteries.",
          },
          {
            icon: "users",
            title: "Aggregated team views",
            body: "Managers and HR see anonymised trends per team and per cohort — never individual employees.",
          },
          {
            icon: "spark",
            title: "Variability metrics",
            body: "Where variability hurts (safety, ops), Measure exposes it. Where it's healthy (creative work), it's not punished.",
          },
          {
            icon: "scale",
            title: "Promotion-readiness signal",
            body: "Trend slope, role benchmark, and tenure-relative performance combine into a single, defensible signal.",
          },
          {
            icon: "lock",
            title: "Privacy-by-design",
            body: "Aggregations enforce a minimum team size before any number is shown. Employees retain export and erasure rights.",
          },
        ]}
      />

      <CTASection
        title={
          <>
            See six months of trend in{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              one screen.
            </span>
          </>
        }
        body="Realistic sample data from your industry, with the privacy model wired up live."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "How we measure it", href: "/research/methodology" }}
      />
    </SiteShell>
  );
}

/* ─── Visual mocks ────────────────────────────────────────────────────────── */

const TREND_POINTS: ReadonlyArray<[number, number]> = [
  [14, 95],
  [42, 92],
  [70, 88],
  [98, 85],
  [126, 78],
  [154, 80],
  [182, 72],
  [210, 65],
  [238, 60],
  [266, 52],
  [294, 45],
  [322, 38],
];

function TrendMockCard() {
  const linePath = TREND_POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L 322 120 L 14 120 Z`;
  const sprintIdx = 3;
  const shiftIdx = 8;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: -30,
          zIndex: -1,
          opacity: 0.4,
          background:
            "radial-gradient(60% 60% at 60% 40%, color-mix(in oklch, var(--accent) 24%, transparent), transparent 70%)",
        }}
      />
      <div
        className="glass-strong"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "linear-gradient(160deg, rgba(255,255,255,0.82), rgba(255,255,255,0.6))",
        }}
      >
        {/* Card chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid rgba(15,29,69,0.08)",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "linear-gradient(135deg, var(--accent), var(--primary))",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              JK
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>Jordan K.</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Staff Engineer</div>
            </div>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            Sample data
          </span>
        </div>

        <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Pill tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "90 days", active: false },
              { label: "6 months", active: false },
              { label: "12 months", active: true },
            ].map((t) => (
              <span
                key={t.label}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "6px 12px",
                  borderRadius: 100,
                  background: t.active ? "var(--primary)" : "rgba(255,255,255,0.7)",
                  color: t.active ? "white" : "var(--ink-2)",
                  border: t.active
                    ? "1px solid var(--primary)"
                    : "1px solid rgba(15,29,69,0.10)",
                  letterSpacing: "0.01em",
                }}
              >
                {t.label}
              </span>
            ))}
          </div>

          {/* Trend chart */}
          <div
            style={{
              padding: "16px 10px 10px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(15,29,69,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 8px 8px",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-2)" }}>
                12-month cognitive trend
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "var(--success)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                ↑ Trending up
              </span>
            </div>
            <svg viewBox="0 0 340 130" style={{ width: "100%", height: 150, display: "block" }}>
              <defs>
                <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[30, 60, 90, 120].map((y) => (
                <line key={y} x1="10" x2="330" y1={y} y2={y} stroke="rgba(15,29,69,0.05)" />
              ))}
              {["Jan", "Apr", "Jul", "Oct"].map((m, i) => (
                <text
                  key={m}
                  x={20 + i * 100}
                  y="128"
                  fontSize="9"
                  fill="rgba(15,29,69,0.4)"
                >
                  {m}
                </text>
              ))}

              <path d={areaPath} fill="url(#trendArea)" />
              <path
                d={linePath}
                stroke="var(--accent)"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {TREND_POINTS.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={i === TREND_POINTS.length - 1 ? 3.5 : 2}
                  fill={i === TREND_POINTS.length - 1 ? "var(--accent)" : "white"}
                  stroke="var(--accent)"
                  strokeWidth="1.4"
                />
              ))}

              {/* Sprint review annotation */}
              <g>
                <line
                  x1={TREND_POINTS[sprintIdx][0]}
                  x2={TREND_POINTS[sprintIdx][0]}
                  y1={TREND_POINTS[sprintIdx][1]}
                  y2={14}
                  stroke="rgba(15,29,69,0.30)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <rect
                  x={TREND_POINTS[sprintIdx][0] - 36}
                  y={2}
                  width={72}
                  height={16}
                  rx={8}
                  fill="white"
                  stroke="rgba(15,29,69,0.14)"
                />
                <text
                  x={TREND_POINTS[sprintIdx][0]}
                  y={13}
                  fontSize="9"
                  textAnchor="middle"
                  fill="rgba(15,29,69,0.75)"
                >
                  Sprint review
                </text>
              </g>

              {/* Shift change annotation */}
              <g>
                <line
                  x1={TREND_POINTS[shiftIdx][0]}
                  x2={TREND_POINTS[shiftIdx][0]}
                  y1={TREND_POINTS[shiftIdx][1]}
                  y2={14}
                  stroke="rgba(15,29,69,0.30)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <rect
                  x={TREND_POINTS[shiftIdx][0] - 34}
                  y={2}
                  width={68}
                  height={16}
                  rx={8}
                  fill="white"
                  stroke="rgba(15,29,69,0.14)"
                />
                <text
                  x={TREND_POINTS[shiftIdx][0]}
                  y={13}
                  fontSize="9"
                  textAnchor="middle"
                  fill="rgba(15,29,69,0.75)"
                >
                  Shift change
                </text>
              </g>
            </svg>
          </div>

          <PrivacyChip>Employee owns this view · GDPR export available</PrivacyChip>
        </div>
      </div>
    </div>
  );
}

function ScoreVsTrendCompare() {
  return (
    <div
      className="hero-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 56px 1fr",
        gap: 16,
        alignItems: "stretch",
      }}
    >
      {/* Left — one-time score */}
      <div
        style={{
          padding: 26,
          borderRadius: 20,
          background: "linear-gradient(160deg, rgba(15,29,69,0.04), rgba(15,29,69,0.02))",
          border: "1px solid rgba(15,29,69,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          One-time score
        </span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, padding: "10px 0 6px" }}>
          <svg viewBox="0 0 200 80" style={{ width: "100%", maxWidth: 240, height: 80 }}>
            <line x1="0" x2="200" y1="70" y2="70" stroke="rgba(15,29,69,0.10)" />
            <rect x="84" y="22" width="32" height="48" rx="6" fill="rgba(15,29,69,0.25)" />
            <circle cx="100" cy="22" r="6" fill="rgba(15,29,69,0.45)" />
            <text x="100" y="14" fontSize="11" textAnchor="middle" fill="rgba(15,29,69,0.7)" fontWeight="700">
              78
            </text>
          </svg>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
          Affected by: sleep, caffeine, stress, noise, time of day.
        </div>
      </div>

      {/* VS divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "white",
            border: "1px solid rgba(15,29,69,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--ink-2)",
            boxShadow: "0 4px 14px rgba(15,29,69,0.06)",
          }}
        >
          VS
        </div>
      </div>

      {/* Right — trend view */}
      <div
        style={{
          padding: 26,
          borderRadius: 20,
          background:
            "linear-gradient(160deg, color-mix(in oklch, var(--accent) 10%, white), color-mix(in oklch, var(--secondary) 70%, white))",
          border: "1px solid color-mix(in oklch, var(--accent) 25%, var(--glass-border))",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--primary)",
          }}
        >
          Trend view
        </span>
        <div style={{ padding: "10px 0 6px" }}>
          <svg viewBox="0 0 240 80" style={{ width: "100%", height: 80 }}>
            <defs>
              <linearGradient id="cmpArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" x2="240" y1="70" y2="70" stroke="rgba(15,29,69,0.08)" />
            <path
              d="M 6 60 L 36 55 L 66 50 L 96 46 L 126 40 L 156 32 L 186 26 L 216 18 L 234 14 L 234 70 L 6 70 Z"
              fill="url(#cmpArea)"
            />
            <path
              d="M 6 60 L 36 55 L 66 50 L 96 46 L 126 40 L 156 32 L 186 26 L 216 18 L 234 14"
              stroke="var(--accent)"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="234" cy="14" r="4" fill="var(--accent)" />
          </svg>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--primary)", lineHeight: 1.55, fontWeight: 500 }}>
          Shows direction — not a snapshot.
        </div>
      </div>
    </div>
  );
}

function SeeCard({
  icon,
  title,
  body,
  decoration,
}: {
  icon: string;
  title: string;
  body: string;
  decoration: React.ReactNode;
}) {
  return (
    <article
      className="glass lift"
      style={{
        padding: 26,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 200,
        background:
          "linear-gradient(160deg, color-mix(in oklch, var(--accent) 5%, white), rgba(255,255,255,0.55))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          <Icon name={icon} size={20} />
        </div>
        <div style={{ opacity: 0.7 }}>{decoration}</div>
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
        {title}
      </h3>
      <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
        {body}
      </p>
    </article>
  );
}

function MiniLine() {
  return (
    <svg width="64" height="28" viewBox="0 0 64 28">
      <path
        d="M2 22 L12 18 L22 20 L32 14 L42 10 L52 6 L62 4"
        stroke="var(--accent)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniScatter() {
  const dots = [
    [6, 18],
    [14, 10],
    [22, 22],
    [30, 8],
    [38, 16],
    [46, 12],
    [54, 20],
    [60, 6],
  ];
  return (
    <svg width="64" height="28" viewBox="0 0 64 28">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="var(--accent)" opacity={0.7} />
      ))}
    </svg>
  );
}

function MiniPins() {
  return (
    <svg width="64" height="28" viewBox="0 0 64 28">
      <line x1="2" x2="62" y1="20" y2="20" stroke="rgba(15,29,69,0.15)" strokeWidth="1.4" />
      {[14, 32, 50].map((x) => (
        <g key={x}>
          <line x1={x} x2={x} y1="20" y2="8" stroke="var(--accent)" strokeWidth="1.4" />
          <circle cx={x} cy="7" r="2.5" fill="var(--accent)" />
        </g>
      ))}
    </svg>
  );
}

function MiniArrowUp() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="12" fill="color-mix(in oklch, var(--accent) 18%, white)" />
      <path
        d="M14 19 V9 M9 13 L14 8 L19 13"
        stroke="var(--accent)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PROMO_POINTS: ReadonlyArray<[number, number]> = [
  [10, 72],
  [50, 68],
  [90, 64],
  [130, 56],
  [170, 40],
  [210, 18],
];

function PromotionSignalCard() {
  const linePath = PROMO_POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L 210 85 L 10 85 Z`;
  return (
    <div
      className="glass-strong"
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        background: "linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Trend slope ↑
        </span>
        <span style={{ fontSize: 10, color: "var(--ink-3)" }}>Last 6 months · Sample data</span>
      </div>

      <div
        style={{
          padding: "14px 12px 6px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(15,29,69,0.06)",
        }}
      >
        <svg viewBox="0 0 220 90" style={{ width: "100%", height: 110, display: "block" }}>
          <defs>
            <linearGradient id="promoArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--success)" stopOpacity="0.30" />
              <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" x2="220" y1="85" y2="85" stroke="rgba(15,29,69,0.06)" />
          <path d={areaPath} fill="url(#promoArea)" />
          <path
            d={linePath}
            stroke="var(--success)"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {PROMO_POINTS.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === PROMO_POINTS.length - 1 ? 4 : 2.4}
              fill={i === PROMO_POINTS.length - 1 ? "var(--success)" : "white"}
              stroke="var(--success)"
              strokeWidth="1.4"
            />
          ))}
        </svg>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 100,
          background: "color-mix(in oklch, var(--accent) 14%, white)",
          border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
          color: "var(--primary)",
          fontSize: 12.5,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--success)",
            boxShadow: "0 0 0 3px color-mix(in oklch, var(--success) 22%, transparent)",
          }}
        />
        Promotion-readiness signal: <strong>Strong</strong>
      </div>

      {/* Three-way conversation */}
      <div
        style={{
          paddingTop: 14,
          borderTop: "1px dashed rgba(15,29,69,0.10)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
          Starts a three-way conversation
        </span>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: "50%",
              height: 1,
              borderTop: "1px dashed rgba(15,29,69,0.20)",
              zIndex: 0,
            }}
          />
          {[
            { label: "Manager", initials: "M" },
            { label: "HR", initials: "HR" },
            { label: "Employee", initials: "E" },
          ].map((p) => (
            <div
              key={p.label}
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "white",
                  border: "1px solid rgba(15,29,69,0.12)",
                  color: "var(--primary)",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(15,29,69,0.06)",
                }}
              >
                {p.initials}
              </div>
              <span style={{ fontSize: 11, color: "var(--ink-2)", fontWeight: 500 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const EMPLOYEE_DETAILED: ReadonlyArray<[number, number]> = [
  [4, 50],
  [24, 46],
  [44, 52],
  [64, 42],
  [84, 48],
  [104, 38],
  [124, 36],
  [144, 30],
  [164, 34],
  [184, 24],
  [204, 22],
  [224, 16],
];

function EmployeeViewCard() {
  const detailedPath = EMPLOYEE_DETAILED.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <div
      className="glass-strong"
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
        maxWidth: 820,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>
          app.wellowork.net / me
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Sample data
        </span>
      </div>

      {/* Row 1 — employee's own detailed trend */}
      <div
        style={{
          padding: 16,
          borderRadius: 14,
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(15,29,69,0.08)",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "color-mix(in oklch, var(--accent) 14%, white)",
            border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary)",
          }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 11V8a5 5 0 0110 0v3 M5 11h14v10H5z M12 15v3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>
            Your trend <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>(visible to you)</span>
          </div>
          <svg viewBox="0 0 230 60" style={{ width: "100%", height: 56, display: "block", marginTop: 4 }}>
            <line x1="0" x2="230" y1="56" y2="56" stroke="rgba(15,29,69,0.06)" />
            <path
              d={detailedPath}
              stroke="var(--accent)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {EMPLOYEE_DETAILED.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" fill="white" stroke="var(--accent)" strokeWidth="1.4" />
            ))}
          </svg>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--success)",
          }}
        >
          Per-session
        </span>
      </div>

      {/* Row 2 — manager's aggregated, smoothed view */}
      <div
        style={{
          padding: 16,
          borderRadius: 14,
          background: "linear-gradient(160deg, rgba(15,29,69,0.04), rgba(15,29,69,0.02))",
          border: "1px solid rgba(15,29,69,0.08)",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(15,29,69,0.06)",
            border: "1px solid rgba(15,29,69,0.10)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink-2)",
          }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12c2-4 6-7 10-7s8 3 10 7c-2 4-6 7-10 7s-8-3-10-7z M12 9a3 3 0 100 6 3 3 0 000-6z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>
            Team aggregate{" "}
            <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>(what your manager sees)</span>
          </div>
          <svg viewBox="0 0 230 60" style={{ width: "100%", height: 56, display: "block", marginTop: 4 }}>
            <line x1="0" x2="230" y1="56" y2="56" stroke="rgba(15,29,69,0.06)" />
            <path
              d="M 4 46 C 50 42, 90 36, 124 30 S 200 18, 224 12"
              stroke="rgba(15,29,69,0.45)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M 4 46 C 50 42, 90 36, 124 30 S 200 18, 224 12"
              stroke="rgba(15,29,69,0.55)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Anonymised
        </span>
      </div>

      <div
        style={{
          paddingTop: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
          Employees own this data — managers see only smoothed aggregates above a minimum team size.
        </span>
        <span
          style={{
            fontSize: 11.5,
            color: "var(--ink-3)",
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >
          GDPR · export or delete
        </span>
      </div>
    </div>
  );
}
