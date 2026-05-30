import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { JsonLd } from "@/app/components/JsonLd";
import { CTASection } from "@/app/components/CTASection";
import { Icon } from "@/app/components/Icons";
import { buildMetadata, breadcrumbList, localizedUrl, inLanguage } from "@/app/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("research.title"),
    description: t("research.description"),
    path: "/research",
  });
}

const CONSTRUCT_KEYS = [
  "workingMemory",
  "processingSpeed",
  "attention",
  "problemSolving",
  "cognitiveFlexibility",
] as const;

const SUBPAGES = [
  { key: "methodology", href: "/research/methodology", icon: "search" },
  { key: "constructs", href: "/research/cognitive-constructs", icon: "brain" },
  { key: "scienceInsight", href: "/research/science-insight", icon: "spark" },
] as const;

export default async function ResearchPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("researchIndex");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: t("crumbs.current"), href: "/research" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "WelloWork Research",
      url: localizedUrl("/research", loc),
      inLanguage: inLanguage(loc),
      description:
        "Research hub for the cognitive constructs, methodology, and privacy architecture behind the WelloWork platform.",
      hasPart: SUBPAGES.map((s) => ({
        "@type": "WebPage",
        name: t(`subpages.${s.key}.title`),
        url: localizedUrl(s.href, loc),
      })),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.titleLead")}{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {t("hero.titleAccent")}
            </span>
          </>
        }
        lede={t("hero.lede")}
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>{t("answer.label")}</strong> {t("answer.body")}
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 24px", fontSize: "clamp(26px,3.2vw,40px)" }}
            >
              {t("constructsSection.heading")}
            </h2>
          </Reveal>
          <div className="glass" style={{ padding: 6, background: "rgba(255,255,255,0.6)" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {CONSTRUCT_KEYS.map((key, i) => (
                <li
                  key={key}
                  style={{
                    padding: "18px 20px",
                    display: "flex",
                    gap: 16,
                    borderBottom: i < CONSTRUCT_KEYS.length - 1 ? "1px solid rgba(15,29,69,0.06)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "linear-gradient(135deg, var(--accent), var(--primary))",
                      color: "white",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 17,
                        color: "var(--ink-1)",
                      }}
                    >
                      {t(`constructs.${key}.name`)}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
                      {t(`constructs.${key}.cap`)}
                    </div>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 14.5,
                        color: "var(--ink-2)",
                        lineHeight: 1.55,
                        maxWidth: "70ch",
                      }}
                    >
                      {t(`constructs.${key}.body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 0 24px" }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 24px", fontSize: "clamp(26px,3.2vw,40px)" }}
            >
              {t("subpagesSection.heading")}
            </h2>
          </Reveal>
          <div className="grid grid-2">
            {SUBPAGES.map((s, i) => (
              <Reveal key={s.href} delay={((i % 2) + 1) as 1 | 2}>
                <Link href={s.href} style={{ display: "block", height: "100%" }}>
                  <article
                    className="glass lift"
                    style={{
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      height: "100%",
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
                      <Icon name={s.icon} size={22} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 19,
                        margin: 0,
                        color: "var(--ink-1)",
                      }}
                    >
                      {t(`subpages.${s.key}.title`)}
                    </h3>
                    <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                      {t(`subpages.${s.key}.body`)}
                    </p>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
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
