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
  DomainCardGrid,
  DomainPillStrip,
  ScenarioCard,
  GamesVsScenarioPanel,
  ExcludePanel,
  MethodologyBanner,
} from "@/app/components/CognitiveConstructsVisuals";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("researchCognitiveConstructs.title"),
    description: t("researchCognitiveConstructs.description"),
    path: "/research/cognitive-constructs",
  });
}

export default async function ConstructsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("researchCognitiveConstructs");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: t("crumbs.research"), href: "/research" },
    { name: t("crumbs.current"), href: "/research/cognitive-constructs" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Cognitive constructs behind WelloWork",
      url: localizedUrl("/research/cognitive-constructs", loc),
      inLanguage: inLanguage(loc),
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: { "@type": "Organization", name: SITE_NAME },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — two-column (text left, domain card grid right) */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div className="cc-hero-grid">
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
              <DomainCardGrid />
            </Reveal>
          </div>
        </div>
      </section>

      {/* "Which cognitive constructs..." answer callout with pill strip */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
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

      {/* Per-domain sections (text left, scenario card right) */}
      <section style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div className="container">
          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>{t("wm.heading")}</h2>
                <p>{t("wm.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="wm" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>{t("ps.heading")}</h2>
                <p>{t("ps.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="ps" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>{t("att.heading")}</h2>
                <p>{t("att.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="att" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>{t("prob.heading")}</h2>
                <p>{t("prob.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="prob" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>{t("flex.heading")}</h2>
                <p>{t("flex.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="flex" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* NEW: Why not just use cognitive games? */}
      <section style={{ paddingTop: 40, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("gamesSection.heading")}</h2>
              <p className="cc-compare-bridge">
                {t("gamesSection.bridge")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <GamesVsScenarioPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* "What about constructs we don't measure?" — prose + exclude panel */}
      <section style={{ paddingTop: 32, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("excludeSection.heading")}</h2>
              <p>{t("excludeSection.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <ExcludePanel />
          </Reveal>
        </div>
      </section>

      {/* Methodology banner */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <MethodologyBanner />
          </Reveal>
        </div>
      </section>

      <CTASection
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/book-a-demo" }}
        secondary={{ label: t("cta.secondary"), href: "/research/methodology" }}
      />
    </SiteShell>
  );
}
