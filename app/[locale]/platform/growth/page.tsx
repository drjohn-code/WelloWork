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
    title: t("platformGrowth.title"),
    description: t("platformGrowth.description"),
    path: "/platform/growth",
  });
}

type ConstructTint = {
  bg: string;
  border: string;
  iconBg: string;
  spark: string;
};

type ConstructStyle = {
  key:
    | "workingMemory"
    | "processingSpeed"
    | "attention"
    | "problemSolving"
    | "cognitiveFlexibility";
  icon: string;
  tint: ConstructTint;
  spark: string;
};

const CONSTRUCTS: ReadonlyArray<ConstructStyle> = [
  {
    key: "workingMemory",
    icon: "brain",
    tint: {
      bg: "linear-gradient(160deg, rgba(92,115,251,0.10), rgba(255,255,255,0.6))",
      border: "rgba(92,115,251,0.22)",
      iconBg: "linear-gradient(135deg, rgba(92,115,251,0.28), rgba(227,238,249,0.7))",
      spark: "rgba(92,115,251,0.55)",
    },
    spark: "M2 22 L10 16 L18 19 L28 10 L38 12 L48 6",
  },
  {
    key: "processingSpeed",
    icon: "bolt",
    tint: {
      bg: "linear-gradient(160deg, rgba(245,200,130,0.18), rgba(255,255,255,0.6))",
      border: "rgba(220,170,90,0.28)",
      iconBg: "linear-gradient(135deg, rgba(245,200,130,0.40), rgba(255,247,232,0.85))",
      spark: "rgba(202,143,52,0.65)",
    },
    spark: "M2 18 L9 14 L16 17 L24 9 L32 12 L40 5 L48 8",
  },
  {
    key: "attention",
    icon: "target",
    tint: {
      bg: "linear-gradient(160deg, rgba(140,220,200,0.20), rgba(255,255,255,0.6))",
      border: "rgba(80,180,150,0.28)",
      iconBg: "linear-gradient(135deg, rgba(140,220,200,0.40), rgba(232,250,244,0.85))",
      spark: "rgba(60,160,130,0.65)",
    },
    spark: "M2 14 L10 16 L18 10 L26 12 L34 6 L42 9 L48 4",
  },
  {
    key: "problemSolving",
    icon: "cube",
    tint: {
      bg: "linear-gradient(160deg, rgba(167,139,250,0.16), rgba(255,255,255,0.6))",
      border: "rgba(139,107,217,0.26)",
      iconBg: "linear-gradient(135deg, rgba(167,139,250,0.36), rgba(244,239,254,0.85))",
      spark: "rgba(124,90,200,0.65)",
    },
    spark: "M2 20 L10 18 L18 14 L26 16 L34 8 L42 10 L48 6",
  },
  {
    key: "cognitiveFlexibility",
    icon: "swap",
    tint: {
      bg: "linear-gradient(160deg, rgba(244,168,184,0.16), rgba(255,255,255,0.6))",
      border: "rgba(220,130,150,0.26)",
      iconBg: "linear-gradient(135deg, rgba(244,168,184,0.36), rgba(254,238,242,0.85))",
      spark: "rgba(200,90,120,0.6)",
    },
    spark: "M2 12 L10 18 L18 10 L26 16 L34 8 L42 14 L48 6",
  },
];

const CONSUMER_POINT_KEYS = [
  "optimisedEngagement",
  "standaloneScore",
  "personalEntertainment",
  "singleUserData",
  "noWorkContext",
] as const;

const WELLORISE_POINT_KEYS = [
  "stableSignal",
  "longitudinal",
  "workplaceLayer",
  "feedsDashboard",
  "annotated",
] as const;

type BenefitCardStyle<K extends string = string> = {
  key: K;
  icon: string;
  accent: string;
  tintBg: string;
  tintBorder: string;
};

const EMPLOYEE_CARDS: ReadonlyArray<
  BenefitCardStyle<"adaptive" | "tokens" | "peers" | "privacy">
> = [
  {
    key: "adaptive",
    icon: "spark",
    accent: "var(--accent)",
    tintBg: "linear-gradient(155deg, rgba(92,115,251,0.10), rgba(255,255,255,0.55))",
    tintBorder: "rgba(92,115,251,0.22)",
  },
  {
    key: "tokens",
    icon: "star",
    accent: "#C99043",
    tintBg: "linear-gradient(155deg, rgba(245,200,130,0.18), rgba(255,255,255,0.55))",
    tintBorder: "rgba(220,170,90,0.26)",
  },
  {
    key: "peers",
    icon: "users",
    accent: "#3FA084",
    tintBg: "linear-gradient(155deg, rgba(140,220,200,0.20), rgba(255,255,255,0.55))",
    tintBorder: "rgba(80,180,150,0.26)",
  },
  {
    key: "privacy",
    icon: "lock",
    accent: "#7A5BC9",
    tintBg: "linear-gradient(155deg, rgba(167,139,250,0.16), rgba(255,255,255,0.55))",
    tintBorder: "rgba(139,107,217,0.24)",
  },
];

const MANAGER_CARDS: ReadonlyArray<
  BenefitCardStyle<"trends" | "composition" | "variability" | "annotated">
> = [
  {
    key: "trends",
    icon: "chart",
    accent: "var(--accent)",
    tintBg: "linear-gradient(155deg, rgba(92,115,251,0.10), rgba(255,255,255,0.55))",
    tintBorder: "rgba(92,115,251,0.22)",
  },
  {
    key: "composition",
    icon: "layers",
    accent: "#7A5BC9",
    tintBg: "linear-gradient(155deg, rgba(167,139,250,0.16), rgba(255,255,255,0.55))",
    tintBorder: "rgba(139,107,217,0.24)",
  },
  {
    key: "variability",
    icon: "pulse",
    accent: "#3FA084",
    tintBg: "linear-gradient(155deg, rgba(140,220,200,0.20), rgba(255,255,255,0.55))",
    tintBorder: "rgba(80,180,150,0.26)",
  },
  {
    key: "annotated",
    icon: "calendar",
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

export default async function GrowthPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("platformGrowth");

  const CRUMBS = [
    { name: t("crumbs.home"), href: "/" },
    { name: t("crumbs.platform"), href: "/#platform" },
    { name: t("crumbs.current"), href: "/platform/growth" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloRise — Daily cognitive training",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Cognitive training",
      areaServed: ["EU", "UK"],
      url: localizedUrl("/platform/growth", loc),
      inLanguage: inLanguage(loc),
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
              <strong>{t("answer.label")}</strong> {t("answer.body")}
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
                {t("constructsSection.headingLead")}{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("constructsSection.headingAccent")}
                </span>
              </h2>
              <p style={SECTION_INTRO}>{t("constructsSection.intro")}</p>
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
              <Reveal key={c.key} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
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
                    {t(`constructs.${c.key}.label`)}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "var(--ink-2)",
                    }}
                  >
                    {t(`constructs.${c.key}.desc`)}
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
                {t("comparison.headingLead")}{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("comparison.headingAccent")}
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
                  {t("comparison.consumerLabel")}
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
                  {CONSUMER_POINT_KEYS.map((pKey) => (
                    <li
                      key={pKey}
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
                      {t(`consumerPoints.${pKey}`)}
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
                  {WELLORISE_POINT_KEYS.map((pKey) => (
                    <li
                      key={pKey}
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
                          {t(`welloRisePoints.${pKey}.label`)}
                        </span>
                        <span
                          style={{
                            fontSize: 13.5,
                            color: "var(--ink-2)",
                            lineHeight: 1.5,
                          }}
                        >
                          {t(`welloRisePoints.${pKey}.why`)}
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
                {t("employeeSection.headingLead")}{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("employeeSection.headingAccent")}
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-2">
            {EMPLOYEE_CARDS.map((c, i) => (
              <Reveal key={c.key} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <BenefitCard
                  icon={c.icon}
                  title={t(`employeeCards.${c.key}.title`)}
                  sub={t(`employeeCards.${c.key}.sub`)}
                  body={t(`employeeCards.${c.key}.body`)}
                  accent={c.accent}
                  tintBg={c.tintBg}
                  tintBorder={c.tintBorder}
                />
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
                {t("managerSection.headingLead")}{" "}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("managerSection.headingAccent")}
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-2">
            {MANAGER_CARDS.map((c, i) => (
              <Reveal key={c.key} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <BenefitCard
                  icon={c.icon}
                  title={t(`managerCards.${c.key}.title`)}
                  sub={t(`managerCards.${c.key}.sub`)}
                  body={t(`managerCards.${c.key}.body`)}
                  accent={c.accent}
                  tintBg={c.tintBg}
                  tintBorder={c.tintBorder}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid
        eyebrow={t("features.eyebrow")}
        title={
          <>
            {t("features.titleLead")}{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {t("features.titleAccent")}
            </span>{" "}
            {t("features.titleTrail")}
          </>
        }
        items={[
          {
            icon: "brain",
            title: t("features.domains.title"),
            body: t("features.domains.body"),
          },
          {
            icon: "spark",
            title: t("features.adaptive.title"),
            body: t("features.adaptive.body"),
          },
          {
            icon: "star",
            title: t("features.tokens.title"),
            body: t("features.tokens.body"),
          },
          {
            icon: "users",
            title: t("features.teamComposition.title"),
            body: t("features.teamComposition.body"),
          },
          {
            icon: "chart",
            title: t("features.longitudinal.title"),
            body: t("features.longitudinal.body"),
          },
          {
            icon: "lock",
            title: t("features.privacy.title"),
            body: t("features.privacy.body"),
          },
        ]}
      />

      <CTASection
        title={
          <>
            {t("cta.titleLead")}{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {t("cta.titleAccent")}
            </span>
          </>
        }
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/book-a-demo" }}
        secondary={{ label: t("cta.secondary"), href: "/#pricing" }}
      />
    </SiteShell>
  );
}

type BenefitCardProps = {
  icon: string;
  title: string;
  sub: string;
  body: string;
  accent: string;
  tintBg: string;
  tintBorder: string;
};

function BenefitCard({
  icon,
  title,
  sub,
  body,
  accent,
  tintBg,
  tintBorder,
}: BenefitCardProps) {
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

async function DailySessionCard() {
  const t = await getTranslations("platformGrowth.sessionCard");

  // Progress ring: 3 of 5 constructs complete = 60%
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.6;
  const dashOffset = circumference * (1 - progress);

  const chips: ReadonlyArray<{
    key: "attention" | "flexibility" | "processing" | "memory" | "problemSolving";
    done: boolean;
    active?: boolean;
  }> = [
    { key: "attention", done: true },
    { key: "flexibility", done: true },
    { key: "processing", done: true },
    { key: "memory", done: false, active: true },
    { key: "problemSolving", done: false },
  ];

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
            {t("eyebrow")}
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
            {t("title")}
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
          {t("live")}
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
              {t("constructs")}
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
            {t("inProgress")}
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
            {t("currentTask")}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 13,
              color: "var(--ink-3)",
            }}
          >
            {t("taskOf")}
          </div>
          <div
            className="mini-bar"
            style={{ marginTop: 14, height: 6 }}
            aria-label={t("taskProgressAria")}
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
            <span>{t("elapsed")}</span>
            <span>{t("left")}</span>
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
        {chips.map((d) => (
          <span
            key={d.key}
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
            {t(`chip.${d.key}`)}
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
            {t("tokensEarned")}
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
            {t("tokensRedeem")}
          </span>
        </div>
      </div>
    </div>
  );
}
