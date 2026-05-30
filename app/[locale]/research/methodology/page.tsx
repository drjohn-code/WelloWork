import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { Reveal } from "@/app/components/Reveal";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { CTASection } from "@/app/components/CTASection";
import { JsonLd } from "@/app/components/JsonLd";
import {
  SITE_NAME,
  buildMetadata,
  breadcrumbList,
  localizedUrl,
  inLanguage,
} from "@/app/lib/site";
import {
  DomainPillStrip,
  MeasurementPipeline,
  ConstructMappingCard,
  NormalisationCompareCard,
  AggregationGrid,
  ClaimsContrastPanel,
  PublishTimeline,
  PrivacyExplainerGrid,
  ScenariosVsGamesPanel,
  ClosingMethodologyBanner,
} from "@/app/components/MethodologyVisuals";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("researchMethodology.title"),
    description: t("researchMethodology.description"),
    path: "/research/methodology",
  });
}

export default async function MethodologyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("researchMethodology");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: t("crumbs.research"), href: "/research" },
    { name: t("crumbs.current"), href: "/research/methodology" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "WelloWork methodology overview",
      url: localizedUrl("/research/methodology", loc),
      inLanguage: inLanguage(loc),
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: { "@type": "Organization", name: SITE_NAME },
      description:
        "How exercises map to validated cognitive constructs, how scores aggregate, and the commitment to publish methodology as pilot data is generated.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — text left, measurement pipeline right */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div className="mp-hero-grid">
            <div>
              <Reveal delay={1}>
                <div style={{ marginTop: 18 }}>
                  <span className="eyebrow">{t("hero.eyebrow")}</span>
                </div>
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

            <Reveal delay={2}>
              <MeasurementPipeline />
            </Reveal>
          </div>
        </div>
      </section>

      {/* "What is the WelloWork methodology, in one paragraph?" — pill strip + answer card */}
      <section style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="cc-answer-block">
              <DomainPillStrip />
              <p className="cc-answer-text">
                <strong>{t("answer.label")}</strong>{" "}
                {t("answer.body")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How are exercises mapped to constructs? — text left, mapping card right */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <div className="mp-split-row">
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>{t("mapping.heading")}</h2>
                <p>{t("mapping.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ConstructMappingCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* NEW — Why WelloWork scenarios, not cognitive games? */}
      <section style={{ paddingTop: 40, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>
                {t("scenariosSection.heading")}
              </h2>
              <p className="cc-compare-bridge">
                {t("scenariosSection.bridge")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <ScenariosVsGamesPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How are scores computed? — text left, normalisation compare right */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <div className="mp-split-row">
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>{t("scoring.heading")}</h2>
                <p>{t("scoring.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <NormalisationCompareCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* How are aggregations done? — prose intro + 2x2 grid */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("aggregations.heading")}</h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <AggregationGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What do we deliberately not claim? — contrast panel */}
      <section style={{ paddingTop: 40, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("notClaim.heading")}</h2>
              <p>{t("notClaim.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 12 }}>
              <ClaimsContrastPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How do we publish updates? — prose + timeline */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("publish.heading")}</h2>
              <p>{t("publish.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <PublishTimeline />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Privacy in the methodology — prose + 2-col privacy card */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("privacy.heading")}</h2>
              <p>{t("privacy.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 12 }}>
              <PrivacyExplainerGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing methodology banner */}
      <section style={{ paddingTop: 40, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <ClosingMethodologyBanner />
          </Reveal>
        </div>
      </section>

      <CTASection
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/book-a-demo" }}
        secondary={{ label: t("cta.secondary"), href: "/research" }}
      />
    </SiteShell>
  );
}
