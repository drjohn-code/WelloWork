import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { Reveal } from "@/app/components/Reveal";
import { Icon } from "@/app/components/Icons";
import { DayTwentyThreeCTA } from "@/app/components/DayTwentyThreeCTA";
import { PrivacyChip } from "@/app/components/Chips";
import { TwentyThirdVisual } from "@/app/components/TwentyThirdVisuals";
import { Link } from "@/i18n/navigation";
import {
  SITE_URL,
  SITE_NAME,
  buildMetadata,
  breadcrumbList,
  localizedUrl,
  inLanguage,
} from "@/app/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

const STEP_KEYS = ["intake", "analysis", "ongoing", "connections", "report"] as const;
const STEP_ICONS: Record<(typeof STEP_KEYS)[number], string> = {
  intake: "flow",
  analysis: "brain",
  ongoing: "calendar",
  connections: "users",
  report: "chart",
};
const INDIVIDUAL_KEYS = ["selfUnderstanding", "dreamGoalAlignment", "blockClearing"] as const;
const INDIVIDUAL_ICONS: Record<(typeof INDIVIDUAL_KEYS)[number], string> = {
  selfUnderstanding: "brain",
  dreamGoalAlignment: "spark",
  blockClearing: "target",
};
const COMPANY_KEYS = ["performanceCulture", "employeeOwned", "companyWide"] as const;
const COMPANY_ICONS: Record<(typeof COMPANY_KEYS)[number], string> = {
  performanceCulture: "chart",
  employeeOwned: "lock",
  companyWide: "users",
};

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("twentyThird.title"),
    description: t("twentyThird.description"),
    path: "/twentythird",
  });
}

export default async function TwentyThirdPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("twentyThird");

  const CRUMBS = [
    { name: t("crumbs.home"), href: "/" },
    { name: t("crumbs.current"), href: "/twentythird" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "TwentyThird",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Psychodynamic AI self-discovery platform",
      areaServed: ["EU", "UK"],
      url: localizedUrl("/twentythird", loc),
      inLanguage: inLanguage(loc),
      description: t("hero.answerBody"),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero */}
      <section style={{ paddingTop: 48, paddingBottom: 16 }}>
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
              gap: 48,
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
                  style={{ margin: "10px 0 18px", maxWidth: "22ch", fontSize: "clamp(34px, 5vw, 58px)" }}
                >
                  {t("hero.titleLead")}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    {t("hero.titleAccent")}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0, maxWidth: "56ch" }}>
                  {t("hero.lede")}
                </p>
              </Reveal>
              <Reveal delay={2}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                  <DayTwentyThreeCTA label={t("hero.primaryCta")} event="twentythird_daytwentythree_hero" />
                  <a href="#how-it-works" className="btn btn-glass">
                    {t("hero.secondaryCta")}
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <TwentyThirdVisual alt={t("hero.visualAlt")} label={t("hero.visualLabel")} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Direct answer block */}
      <section style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "72ch" }}>
              <strong>{t("hero.answerLabel")}</strong> {t("hero.answerBody")}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "48px 0", scrollMarginTop: 96 }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>{t("howItWorks.heading")}</h2>
              <p style={SECTION_INTRO}>{t("howItWorks.intro")}</p>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {STEP_KEYS.map((k, i) => (
              <Reveal key={k} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <article
                  className="glass lift"
                  style={{
                    padding: 26,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    minHeight: 200,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      aria-hidden="true"
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
                      <Icon name={STEP_ICONS[k]} size={22} />
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: "0.06em",
                        color: "var(--accent)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
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
                    {t(`howItWorks.steps.${k}.title`)}
                  </h3>
                  <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                    {t(`howItWorks.steps.${k}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* For individuals */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>{t("forIndividuals.heading")}</h2>
              <p style={SECTION_INTRO}>{t("forIndividuals.intro")}</p>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {INDIVIDUAL_KEYS.map((k, i) => (
              <Reveal key={k} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <article
                  className="glass lift"
                  style={{
                    padding: 26,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 170,
                  }}
                >
                  <span
                    aria-hidden="true"
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
                    <Icon name={INDIVIDUAL_ICONS[k]} size={22} />
                  </span>
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
                    {t(`forIndividuals.points.${k}.title`)}
                  </h3>
                  <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                    {t(`forIndividuals.points.${k}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={1}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 28 }}>
              <DayTwentyThreeCTA label={t("forIndividuals.cta")} event="twentythird_daytwentythree_individuals" />
              <span style={{ fontSize: 13.5, color: "var(--ink-3)" }}>{t("forIndividuals.trialNote")}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* For companies */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>{t("forCompanies.heading")}</h2>
              <p style={SECTION_INTRO}>{t("forCompanies.intro")}</p>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {COMPANY_KEYS.map((k, i) => (
              <Reveal key={k} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <article
                  className="glass lift"
                  style={{
                    padding: 26,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 170,
                  }}
                >
                  <span
                    aria-hidden="true"
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
                    <Icon name={COMPANY_ICONS[k]} size={22} />
                  </span>
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
                    {t(`forCompanies.points.${k}.title`)}
                  </h3>
                  <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                    {t(`forCompanies.points.${k}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={1}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 28 }}>
              <Link href="/book-a-demo" className="btn btn-primary" style={{ background: "var(--navy)" }}>
                {t("forCompanies.cta")}
              </Link>
              <span style={{ fontSize: 13.5, color: "var(--ink-3)" }}>{t("forCompanies.note")}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Privacy & trust */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div
              className="glass"
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxWidth: 820,
              }}
            >
              <PrivacyChip>{t("privacy.chip")}</PrivacyChip>
              <h2 style={{ ...SECTION_HEADING, fontSize: "clamp(22px, 2.4vw, 28px)" }}>
                {t("privacy.heading")}
              </h2>
              <p className="body" style={{ margin: 0, fontSize: 15 }}>
                {t("privacy.body")}
              </p>
              <div>
                <Link href="/legal#privacy" className="btn btn-glass">
                  {t("privacy.cta")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA band */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <Reveal>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 32,
                padding: "56px 40px",
                background: `
                  radial-gradient(40% 60% at 8% 30%, color-mix(in oklch, var(--accent) 35%, transparent) 0%, transparent 60%),
                  radial-gradient(45% 70% at 95% 70%, color-mix(in oklch, var(--secondary-deep) 55%, transparent) 0%, transparent 65%),
                  linear-gradient(135deg, #FBFCFE 0%, #EEF3FE 100%)
                `,
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 24px 80px rgba(15,29,69,0.10)",
                textAlign: "center",
              }}
            >
              <h2
                className="h-section"
                style={{ margin: "0 auto 14px", maxWidth: "22ch", fontSize: "clamp(28px,3.6vw,44px)" }}
              >
                {t("finalCta.headingLead")}
                <span className="italic-serif" style={{ color: "var(--accent)" }}>
                  {t("finalCta.headingAccent")}
                </span>
              </h2>
              <p className="lede" style={{ margin: "0 auto 28px", maxWidth: "56ch" }}>
                {t("finalCta.body")}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <DayTwentyThreeCTA label={t("finalCta.primaryCta")} event="twentythird_daytwentythree_footer" />
                <Link href="/book-a-demo" className="btn btn-glass">
                  {t("finalCta.secondaryCta")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
