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
import { buildMetadata, breadcrumbList, localizedUrl, inLanguage } from "@/app/lib/site";
import {
  ResearchNotebookCard,
  ContentScopeStrip,
  NoteAnatomyCard,
  NotePipelineStrip,
  PositioningSpectrum,
  FieldVsGamesPanel,
  TrustSignalStrip,
} from "@/app/components/ScienceInsightVisuals";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("researchScienceInsight.title"),
    description: t("researchScienceInsight.description"),
    path: "/research/science-insight",
  });
}

export default async function ScienceInsightPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("researchScienceInsight");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: t("crumbs.research"), href: "/research" },
    { name: t("crumbs.current"), href: "/research/science-insight" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t("crumbs.current"),
      url: localizedUrl("/research/science-insight", loc),
      inLanguage: inLanguage(loc),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — text left, research notebook card right */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div className="si-hero-grid">
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
              <ResearchNotebookCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scope: what lives under Science & insight? — answer card + 3-column callout */}
      <section style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="cc-answer-block">
              <p className="cc-answer-text">
                <strong>{t("scope.label")}</strong> {t("scope.body")}
              </p>
              <ContentScopeStrip />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What can readers expect here? — prose + note anatomy diagram */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <div className="si-split-row">
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>{t("expect.heading")}</h2>
                <p>{t("expect.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <NoteAnatomyCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* What will be published first? — pipeline preview strip */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("publishedFirst.heading")}</h2>
              <p>{t("publishedFirst.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <NotePipelineStrip />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What this is not — positioning spectrum */}
      <section style={{ paddingTop: 40, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("notThis.heading")}</h2>
              <p>{t("notThis.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <PositioningSpectrum />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why field-based research changes what we measure */}
      <section style={{ paddingTop: 40, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("fieldSection.heading")}</h2>
              <p className="si-field-bridge">{t("fieldSection.bridge")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <FieldVsGamesPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How to follow updates — prose + trust signal strip */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("follow.heading")}</h2>
              <p>{t("follow.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <TrustSignalStrip />
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/contact" }}
        secondary={{ label: t("cta.secondary"), href: "/research" }}
      />
    </SiteShell>
  );
}
