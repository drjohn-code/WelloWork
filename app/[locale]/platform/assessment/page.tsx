import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { FeatureGrid } from "@/app/components/FeatureGrid";
import { CTASection } from "@/app/components/CTASection";
import { JsonLd } from "@/app/components/JsonLd";
import { Reveal } from "@/app/components/Reveal";
import { Icon } from "@/app/components/Icons";
import {
  SITE_URL,
  SITE_NAME,
  buildMetadata,
  breadcrumbList,
  localizedUrl,
  inLanguage,
} from "@/app/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("platformAssessment.title"),
    description: t("platformAssessment.description"),
    path: "/platform/assessment",
  });
}

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

const MEASURE_CARDS = [
  {
    icon: "brain",
    titleKey: "measureCards.cognitive.title",
    bodyKey: "measureCards.cognitive.body",
    tintBg: "linear-gradient(160deg, rgba(92,115,251,0.10), rgba(255,255,255,0.6))",
    tintBorder: "rgba(92,115,251,0.22)",
    spark: "M2 22 L10 16 L18 19 L28 10 L38 12 L48 6",
    sparkColor: "rgba(92,115,251,0.55)",
  },
  {
    icon: "cube",
    titleKey: "measureCards.technical.title",
    bodyKey: "measureCards.technical.body",
    tintBg: "linear-gradient(160deg, rgba(167,139,250,0.16), rgba(255,255,255,0.6))",
    tintBorder: "rgba(139,107,217,0.26)",
    spark: "M2 20 L12 18 L22 12 L32 14 L42 6 L48 9",
    sparkColor: "rgba(124,90,200,0.6)",
  },
  {
    icon: "pulse",
    titleKey: "measureCards.timeOnTask.title",
    bodyKey: "measureCards.timeOnTask.body",
    tintBg: "linear-gradient(160deg, rgba(140,220,200,0.20), rgba(255,255,255,0.6))",
    tintBorder: "rgba(80,180,150,0.28)",
    spark: "M2 14 L8 20 L14 12 L20 18 L26 10 L32 16 L38 8 L44 14 L48 10",
    sparkColor: "rgba(60,160,130,0.65)",
  },
] as const;

const TIMELINE_STEPS = [
  { icon: "check", labelKey: "timeline.candidateCompletes.label", timeKey: "timeline.candidateCompletes.time" },
  { icon: "spark", labelKey: "timeline.resultsProcessed.label", timeKey: "timeline.resultsProcessed.time" },
  { icon: "users", labelKey: "timeline.panelNotified.label", timeKey: "timeline.panelNotified.time" },
] as const;

const STANDARD_POINTS = [
  "standardPoints.scopedHiring",
  "standardPoints.endsAtOffer",
  "standardPoints.singleScore",
] as const;

const WELLOWIZE_POINTS = [
  { labelKey: "welloWizePoints.prePost.label", whyKey: "welloWizePoints.prePost.why" },
  { labelKey: "welloWizePoints.continuous.label", whyKey: "welloWizePoints.continuous.why" },
  { labelKey: "welloWizePoints.profile.label", whyKey: "welloWizePoints.profile.why" },
] as const;

export default async function AssessmentPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("platformAssessment");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: t("crumbs.platform"), href: "/#platform" },
    { name: t("crumbs.current"), href: "/platform/assessment" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWize — Cognitive & technical assessments",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Hiring and internal assessment",
      areaServed: ["EU", "UK"],
      url: localizedUrl("/platform/assessment", loc),
      inLanguage: inLanguage(loc),
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
                <span className="eyebrow">{t("hero.eyebrow")}</span>
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
                  {t("hero.titleLead")}{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    {t("hero.titleAccent")}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  {t("hero.lede")}
                </p>
              </Reveal>
            </div>
            <Reveal delay={3}>
              <AssessmentResultsCard
                windowLabel={t("resultsCard.windowLabel")}
                sampleData={t("resultsCard.sampleData")}
                candidateName={t("resultsCard.candidateName")}
                candidateRole={t("resultsCard.candidateRole")}
                normalisedProfile={t("resultsCard.normalisedProfile")}
                aboveBenchmark={t("resultsCard.aboveBenchmark")}
                aboveLabel={t("resultsCard.above")}
                belowLabel={t("resultsCard.below")}
                scaleLow={t("resultsCard.scaleLow")}
                scaleHigh={t("resultsCard.scaleHigh")}
                scaleBenchmark={t("resultsCard.scaleBenchmark")}
                domainLabels={{
                  workingMemory: t("resultsCard.domains.workingMemory"),
                  processingSpeed: t("resultsCard.domains.processingSpeed"),
                  attention: t("resultsCard.domains.attention"),
                  problemSolving: t("resultsCard.domains.problemSolving"),
                  cognitiveFlexibility: t("resultsCard.domains.cognitiveFlexibility"),
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Short answer block */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>{t("answer.label")}</strong> {t("answer.body")}
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
                {t("measureSection.headingLead")}{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("measureSection.headingAccent")}
                </span>
              </h2>
              <p style={SECTION_INTRO}>
                {t("measureSection.intro")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-3">
            {MEASURE_CARDS.map((c, i) => (
              <Reveal key={c.titleKey} delay={((i % 3) + 1) as 1 | 2 | 3}>
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
                    {t(c.titleKey)}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "var(--ink-2)",
                    }}
                  >
                    {t(c.bodyKey)}
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
                  {t("panelSection.headingLead")}{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    {t("panelSection.headingAccent")}
                  </span>
                </h2>
                <p style={{ ...SECTION_INTRO, marginTop: 16 }}>
                  {t("panelSection.body")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <TimelineCard
                steps={TIMELINE_STEPS.map((s) => ({
                  icon: s.icon,
                  label: t(s.labelKey),
                  time: t(s.timeKey),
                }))}
                eyebrow={t("timelineCard.eyebrow")}
                endToEnd={t("timelineCard.endToEnd")}
                footnote={t("timelineCard.footnote")}
              />
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
              <BenchmarkChart
                eyebrow={t("benchmarkChart.eyebrow")}
                title={t("benchmarkChart.title")}
                sampleData={t("benchmarkChart.sampleData")}
                employeeLegend={t("benchmarkChart.legend.employee")}
                benchmarkLegend={t("benchmarkChart.legend.benchmark")}
              />
            </Reveal>
            <Reveal>
              <div>
                <h2 style={SECTION_HEADING}>
                  {t("benchmarkSection.headingLead")}{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    {t("benchmarkSection.headingAccent")}
                  </span>
                </h2>
                <p style={{ ...SECTION_INTRO, marginTop: 16 }}>
                  {t("benchmarkSection.body")}
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
                {t("differSection.headingLead")}{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("differSection.headingAccent")}
                </span>
              </h2>
              <p style={SECTION_INTRO}>
                {t("differSection.intro")}
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
                  {t("differSection.standardLabel")}
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
                      {t(p)}
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
                      key={p.labelKey}
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
                          {t(p.labelKey)}
                        </span>
                        <span
                          style={{
                            fontSize: 13.5,
                            color: "var(--ink-2)",
                            lineHeight: 1.5,
                          }}
                        >
                          {t(p.whyKey)}
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
        eyebrow={t("features.eyebrow")}
        title={t("features.title")}
        items={[
          {
            icon: "target",
            title: t("features.oneFramework.title"),
            body: t("features.oneFramework.body"),
          },
          {
            icon: "flow",
            title: t("features.panelReports.title"),
            body: t("features.panelReports.body"),
          },
          {
            icon: "scale",
            title: t("features.benchmarks.title"),
            body: t("features.benchmarks.body"),
          },
          {
            icon: "search",
            title: t("features.auditable.title"),
            body: t("features.auditable.body"),
          },
          {
            icon: "chart",
            title: t("features.feedsTrends.title"),
            body: t("features.feedsTrends.body"),
          },
          {
            icon: "lock",
            title: t("features.gdpr.title"),
            body: t("features.gdpr.body"),
          },
        ]}
      />

      <CTASection
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/book-a-demo" }}
        secondary={{ label: t("cta.secondary"), href: "/research" }}
      />
    </SiteShell>
  );
}

/* ----- Hero mock: assessment results card ----- */

type DomainKey =
  | "workingMemory"
  | "processingSpeed"
  | "attention"
  | "problemSolving"
  | "cognitiveFlexibility";

type DomainBar = {
  labelKey: DomainKey;
  fill: number; // 0..1 candidate score
  benchmark: number; // 0..1 role benchmark line
  above: boolean;
};

const DOMAINS: ReadonlyArray<DomainBar> = [
  { labelKey: "workingMemory", fill: 0.82, benchmark: 0.7, above: true },
  { labelKey: "processingSpeed", fill: 0.66, benchmark: 0.72, above: false },
  { labelKey: "attention", fill: 0.78, benchmark: 0.65, above: true },
  { labelKey: "problemSolving", fill: 0.88, benchmark: 0.75, above: true },
  { labelKey: "cognitiveFlexibility", fill: 0.58, benchmark: 0.68, above: false },
];

type ResultsCardProps = {
  windowLabel: string;
  sampleData: string;
  candidateName: string;
  candidateRole: string;
  normalisedProfile: string;
  aboveBenchmark: string;
  aboveLabel: string;
  belowLabel: string;
  scaleLow: string;
  scaleHigh: string;
  scaleBenchmark: string;
  domainLabels: Record<DomainKey, string>;
};

function AssessmentResultsCard({
  windowLabel,
  sampleData,
  candidateName,
  candidateRole,
  normalisedProfile,
  aboveBenchmark,
  aboveLabel,
  belowLabel,
  scaleLow,
  scaleHigh,
  scaleBenchmark,
  domainLabels,
}: ResultsCardProps) {
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
          <Icon name="lock" size={11} /> {windowLabel}
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
          {sampleData}
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
              {candidateName}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--ink-3)",
                letterSpacing: "0.02em",
              }}
            >
              {candidateRole}
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
            {normalisedProfile}
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
            <DomainRow
              key={d.labelKey}
              label={domainLabels[d.labelKey]}
              fill={d.fill}
              benchmark={d.benchmark}
              above={d.above}
              aboveLabel={aboveLabel}
              belowLabel={belowLabel}
            />
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
            <span>{scaleLow}</span>
            <span style={{ fontStyle: "italic" }}>{scaleBenchmark}</span>
            <span>{scaleHigh}</span>
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
          {aboveBenchmark}
        </div>
      </div>
    </div>
  );
}

type DomainRowProps = {
  label: string;
  fill: number;
  benchmark: number;
  above: boolean;
  aboveLabel: string;
  belowLabel: string;
};

function DomainRow({ label, fill, benchmark, above, aboveLabel, belowLabel }: DomainRowProps) {
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
          {above ? aboveLabel : belowLabel}
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
  eyebrow,
  endToEnd,
  footnote,
}: {
  steps: ReadonlyArray<{ icon: string; label: string; time: string }>;
  eyebrow: string;
  endToEnd: string;
  footnote: string;
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
          {eyebrow}
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
          {endToEnd}
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
        {footnote}
      </div>
    </div>
  );
}

/* ----- Section 3: benchmark chart ----- */

function BenchmarkChart({
  eyebrow,
  title,
  sampleData,
  employeeLegend,
  benchmarkLegend,
}: {
  eyebrow: string;
  title: string;
  sampleData: string;
  employeeLegend: string;
  benchmarkLegend: string;
}) {
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
            {eyebrow}
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
            {title}
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
          {sampleData}
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
          {employeeLegend}
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
          {benchmarkLegend}
        </span>
      </div>
    </div>
  );
}
