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
import { ExternalCTA } from "@/app/components/ExternalCTA";
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

const STEP_KEYS = ["receive", "solve", "unlock"] as const;
const STEP_ICONS: Record<(typeof STEP_KEYS)[number], string> = {
  receive: "flow",
  solve: "brain",
  unlock: "star",
};
const FORMAT_ROW_KEYS = ["how", "bestFor", "builds", "reward"] as const;
const WHY_KEYS = ["play", "exercise", "collaboration", "recognition"] as const;
const WHY_ICONS: Record<(typeof WHY_KEYS)[number], string> = {
  play: "spark",
  exercise: "brain",
  collaboration: "users",
  recognition: "star",
};
const ROLE_KEYS = ["hr", "culture", "rewards"] as const;
const FAQ_KEYS = ["ordering", "individualGroup", "languages", "delivery", "privacy"] as const;
const RELATED = [
  { key: "growth", href: "/platform/growth" },
  { key: "workshops", href: "/platform/workshops" },
  { key: "assessment", href: "/platform/assessment" },
  { key: "measure", href: "/platform/measure" },
  { key: "research", href: "/research" },
] as const;

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
    title: t("cognitiveRewards.title"),
    description: t("cognitiveRewards.description"),
    path: "/cognitive-rewards",
  });
}

export default async function CognitiveRewardsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("cognitiveRewards");

  const CRUMBS = [
    { name: t("crumbs.home"), href: "/" },
    { name: t("crumbs.current"), href: "/cognitive-rewards" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Cognitive Rewards",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Gamified employee rewards",
      areaServed: ["EU", "UK"],
      url: localizedUrl("/cognitive-rewards", loc),
      inLanguage: inLanguage(loc),
      description: t("hero.answerBody"),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: inLanguage(loc),
      mainEntity: FAQ_KEYS.map((k) => ({
        "@type": "Question",
        name: t(`faq.items.${k}.q`),
        acceptedAnswer: { "@type": "Answer", text: t(`faq.items.${k}.a`) },
      })),
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
          <Reveal delay={1}>
            <div style={{ marginTop: 18 }}>
              <span className="eyebrow">{t("hero.eyebrow")}</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1
              className="h-section"
              style={{ margin: "10px 0 18px", maxWidth: "20ch", fontSize: "clamp(34px, 5vw, 58px)" }}
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
              <ExternalCTA
                label={t("hero.primaryCta")}
                newTabHint={t("external.newTab")}
                event="cognitive_rewards_order_hero"
              />
              <Link href="/book-a-demo" className="btn btn-glass">
                {t("hero.secondaryCta")}
              </Link>
            </div>
          </Reveal>
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

      {/* What it is */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760 }}>
              <h2 style={SECTION_HEADING}>{t("whatItIs.heading")}</h2>
              <p style={SECTION_INTRO}>{t("whatItIs.body1")}</p>
              <p style={{ ...SECTION_INTRO, marginTop: 14 }}>{t("whatItIs.body2")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How employees earn rewards */}
      <section style={{ padding: "48px 0" }}>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
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

      {/* Individual vs team — comparison table */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 28 }}>
              <h2 style={SECTION_HEADING}>{t("formats.heading")}</h2>
              <p style={SECTION_INTRO}>{t("formats.intro")}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="glass" style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
                <caption className="sr-only-caption" style={{ position: "absolute", left: -9999 }}>
                  {t("formats.caption")}
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{
                        textAlign: "left",
                        padding: "16px 20px",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--ink-3)",
                        background: "rgba(15,29,69,0.03)",
                        borderBottom: "1px solid rgba(15,29,69,0.08)",
                      }}
                    >
                      {t("formats.colDimension")}
                    </th>
                    <th
                      scope="col"
                      style={{
                        textAlign: "left",
                        padding: "16px 20px",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--ink-1)",
                        background: "rgba(15,29,69,0.03)",
                        borderBottom: "1px solid rgba(15,29,69,0.08)",
                      }}
                    >
                      {t("formats.colIndividual")}
                    </th>
                    <th
                      scope="col"
                      style={{
                        textAlign: "left",
                        padding: "16px 20px",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--primary)",
                        background: "color-mix(in oklch, var(--accent) 8%, white)",
                        borderBottom: "1px solid color-mix(in oklch, var(--accent) 22%, transparent)",
                      }}
                    >
                      {t("formats.colGroup")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FORMAT_ROW_KEYS.map((rk) => (
                    <tr key={rk}>
                      <th
                        scope="row"
                        style={{
                          textAlign: "left",
                          verticalAlign: "top",
                          padding: "16px 20px",
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "var(--ink-2)",
                          borderBottom: "1px solid rgba(15,29,69,0.06)",
                          width: "22%",
                        }}
                      >
                        {t(`formats.rows.${rk}.label`)}
                      </th>
                      <td
                        style={{
                          verticalAlign: "top",
                          padding: "16px 20px",
                          fontSize: 14,
                          lineHeight: 1.5,
                          color: "var(--ink-2)",
                          borderBottom: "1px solid rgba(15,29,69,0.06)",
                        }}
                      >
                        {t(`formats.rows.${rk}.individual`)}
                      </td>
                      <td
                        style={{
                          verticalAlign: "top",
                          padding: "16px 20px",
                          fontSize: 14,
                          lineHeight: 1.5,
                          color: "var(--ink-1)",
                          background: "color-mix(in oklch, var(--accent) 5%, white)",
                          borderBottom: "1px solid color-mix(in oklch, var(--accent) 14%, transparent)",
                        }}
                      >
                        {t(`formats.rows.${rk}.group`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why it works */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>{t("whyItWorks.heading")}</h2>
              <p style={SECTION_INTRO}>{t("whyItWorks.intro")}</p>
            </div>
          </Reveal>
          {/* TODO: verified stat + source — John to supply (e.g. engagement/participation lift). Do not fabricate. */}
          {/* TODO: first-hand / partner insight from Puzzify — John to supply. Do not fabricate. */}
          <div className="grid grid-2">
            {WHY_KEYS.map((k, i) => (
              <Reveal key={k} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <article
                  className="glass lift"
                  style={{
                    padding: 26,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 160,
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
                    <Icon name={WHY_ICONS[k]} size={22} />
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
                    {t(`whyItWorks.points.${k}.title`)}
                  </h3>
                  <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                    {t(`whyItWorks.points.${k}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 32 }}>
              <h2 style={SECTION_HEADING}>{t("whoFor.heading")}</h2>
              <p style={SECTION_INTRO}>{t("whoFor.intro")}</p>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {ROLE_KEYS.map((k, i) => (
              <Reveal key={k} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <article
                  className="glass lift"
                  style={{
                    padding: 26,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    minHeight: 150,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 17,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      margin: 0,
                      color: "var(--ink-1)",
                    }}
                  >
                    {t(`whoFor.roles.${k}.title`)}
                  </h3>
                  <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                    {t(`whoFor.roles.${k}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={1}>
            <p style={{ ...SECTION_INTRO, marginTop: 24 }}>{t("whoFor.orgSizes")}</p>
          </Reveal>
        </div>
      </section>

      {/* Related internal links */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 28 }}>
              <h2 style={SECTION_HEADING}>{t("related.heading")}</h2>
              <p style={SECTION_INTRO}>{t("related.intro")}</p>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {RELATED.map((r, i) => (
              <Reveal key={r.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Link
                  href={r.href}
                  className="glass lift"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: 22,
                    height: "100%",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 16,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      color: "var(--primary)",
                    }}
                  >
                    {t(`related.links.${r.key}.label`)}
                  </span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-2)" }}>
                    {t(`related.links.${r.key}.desc`)}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <Reveal>
            <h2 style={{ ...SECTION_HEADING, marginBottom: 28 }}>{t("faq.heading")}</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 820 }}>
            {FAQ_KEYS.map((k, i) => (
              <Reveal key={k} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <details
                  className="glass"
                  style={{ padding: "18px 22px" }}
                >
                  <summary
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 16.5,
                      color: "var(--ink-1)",
                      cursor: "pointer",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    {t(`faq.items.${k}.q`)}
                  </summary>
                  <p
                    className="body"
                    style={{ margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.6, maxWidth: "70ch" }}
                  >
                    {t(`faq.items.${k}.a`)}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
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
                <ExternalCTA
                  label={t("finalCta.primaryCta")}
                  newTabHint={t("external.newTab")}
                  event="cognitive_rewards_order_footer"
                />
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
