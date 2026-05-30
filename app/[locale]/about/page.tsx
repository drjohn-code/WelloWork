import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { Reveal } from "@/app/components/Reveal";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { CTASection } from "@/app/components/CTASection";
import {
  UppsalaCard,
  FeatureIconGrid,
  GapDiagram,
  PersonaCards,
  PrivacyDiagram,
  SwedenMap,
} from "@/app/components/AboutVisuals";
import {
  SITE_URL,
  buildMetadata,
  breadcrumbList,
  organizationSchema,
  localizedUrl,
  inLanguage,
} from "@/app/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("about.title"),
    description: t("about.description"),
    path: "/about",
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("about");
  const tc = await getTranslations("breadcrumbs");

  const crumbs = [
    { name: tc("home"), href: "/" },
    { name: tc("about"), href: "/about" },
  ];

  const schema = [
    breadcrumbList(crumbs, loc),
    organizationSchema(loc),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: t("schema.aboutPageName"),
      url: localizedUrl("/about", loc),
      inLanguage: inLanguage(loc),
      about: { "@id": `${SITE_URL}#org` },
    },
  ];

  const italic = (chunks: ReactNode) => (
    <span className="italic-serif" style={{ color: "var(--accent)" }}>
      {chunks}
    </span>
  );

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — two-column with Uppsala location card */}
      <section style={{ paddingTop: 48, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={crumbs} />
          </Reveal>

          <div
            className="hero-grid"
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "1.15fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <Reveal delay={1}>
                <div style={{ marginBottom: 10 }}>
                  <span className="eyebrow">{t("hero.eyebrow")}</span>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <h1
                  className="h-section"
                  style={{
                    margin: "0 0 18px",
                    maxWidth: "22ch",
                    fontSize: "clamp(34px, 5vw, 58px)",
                  }}
                >
                  {t.rich("hero.title", { italic })}
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  {t("hero.lede")}
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <UppsalaCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* What does WelloWork do? — callout with icon grid */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="about-callout">
              <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                <strong style={{ color: "var(--ink-1)" }}>
                  {t("whatWeDo.title")}
                </strong>{" "}
                {t("whatWeDo.body")}
              </p>
              <FeatureIconGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why did we build this? — prose + gap diagram */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
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
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>{t("why.title")}</h2>
                <p>
                  {t.rich("why.body", { em: (chunks) => <em>{chunks}</em> })}
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <GapDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who is WelloWork for? — prose + persona cards row */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("who.title")}</h2>
              <p>{t("who.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 24 }}>
              <PersonaCards />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What is the privacy stance? — prose + privacy diagram */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
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
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>{t("privacy.title")}</h2>
                <p>{t("privacy.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <PrivacyDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Where is WelloWork based? — prose + Sweden map */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
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
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>{t("based.title")}</h2>
                <p>{t("based.body")}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <SwedenMap />
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        title={t.rich("cta.title", { italic })}
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/book-a-demo" }}
        secondary={{ label: t("cta.secondary"), href: "/contact" }}
      />
    </SiteShell>
  );
}
