import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/app/components/SiteShell";
import { Reveal } from "@/app/components/Reveal";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { CTASection } from "@/app/components/CTASection";
import { JsonLd } from "@/app/components/JsonLd";
import {
  IntroCard,
  RoleCards,
  HiringFlow,
  WorkingNorms,
  ReachOutTiles,
} from "@/app/components/CareersVisuals";
import {
  buildMetadata,
  breadcrumbList,
  localizedUrl,
  inLanguage,
  ORG_EMAIL,
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
    title: t("careers.title"),
    description: t("careers.description"),
    path: "/careers",
  });
}

export default async function CareersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("careers");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: tc("careers"), href: "/careers" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("schema.webPageName"),
      url: localizedUrl("/careers", loc),
      inLanguage: inLanguage(loc),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — two-column with floating intro card */}
      <section style={{ paddingTop: 48, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
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
                  {t.rich("hero.title", {
                    italic: (chunks) => (
                      <span
                        className="italic-serif"
                        style={{ color: "var(--accent)" }}
                      >
                        {chunks}
                      </span>
                    ),
                  })}
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  {t("hero.lede")}
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <IntroCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Anchor answer */}
      <section style={{ paddingTop: 16, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>{t("anchor.q")}</strong>{" "}
              {t.rich("anchor.body", {
                email: () => <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>,
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* What kind of people are we likely to hire first? */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "70ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("hireFirst.title")}</h2>
              <ul>
                <li>{t("hireFirst.li1")}</li>
                <li>{t("hireFirst.li2")}</li>
                <li>{t("hireFirst.li3")}</li>
                <li>{t("hireFirst.li4")}</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 24 }}>
              <RoleCards />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How do we run a hiring process? */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "70ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("process.title")}</h2>
              <p>{t("process.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 24 }}>
              <HiringFlow />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What is it like to work at WelloWork? */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "70ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("life.title")}</h2>
              <p>{t("life.body")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 24 }}>
              <WorkingNorms />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How can I reach you about a role? */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "70ch" }}>
              <h2 style={{ marginTop: 0 }}>{t("reach.title")}</h2>
              <p>
                {t.rich("reach.body", {
                  email: () => <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>,
                  contactLink: (chunks) => <Link href="/contact">{chunks}</Link>,
                })}
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 20 }}>
              <ReachOutTiles />
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/contact" }}
        secondary={{ label: t("cta.secondary"), href: "/about" }}
      />
    </SiteShell>
  );
}
