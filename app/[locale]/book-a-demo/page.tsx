import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/app/components/SiteShell";
import { Reveal } from "@/app/components/Reveal";
import { JsonLd } from "@/app/components/JsonLd";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { CalcomEmbed } from "@/app/components/CalcomEmbed";
import { DemoFallbackForm } from "@/app/components/DemoFallbackForm";
import { Icon, ArrowRight } from "@/app/components/Icons";
import {
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
    title: t("bookDemo.title"),
    description: t("bookDemo.description"),
    path: "/book-a-demo",
  });
}

export default async function BookADemoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("bookDemo");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: tc("bookDemo"), href: "/book-a-demo" },
  ];

  const FAQS = [
    { q: t("faq.length.q"), a: t("faq.length.a") },
    { q: t("faq.prep.q"), a: t("faq.prep.a") },
    { q: t("faq.pitch.q"), a: t("faq.pitch.a") },
    { q: t("faq.reschedule.q"), a: t("faq.reschedule.a") },
    { q: t("faq.attend.q"), a: t("faq.attend.a") },
  ];

  const EXPECT = [
    { icon: "users", title: t("expect.who.title"), body: t("expect.who.body") },
    { icon: "chart", title: t("expect.show.title"), body: t("expect.show.body") },
    { icon: "calendar", title: t("expect.long.title"), body: t("expect.long.body") },
    {
      icon: "download",
      title: t("expect.leaveWith.title"),
      body: t("expect.leaveWith.body"),
    },
    {
      icon: "shield",
      title: t("expect.noPressure.title"),
      body: t("expect.noPressure.body"),
    },
  ] as const;

  const AGENDA = [
    {
      minutes: t("agenda.intro.minutes"),
      title: t("agenda.intro.title"),
      body: t("agenda.intro.body"),
    },
    {
      minutes: t("agenda.dashboard.minutes"),
      title: t("agenda.dashboard.title"),
      body: t("agenda.dashboard.body"),
    },
    {
      minutes: t("agenda.privacy.minutes"),
      title: t("agenda.privacy.title"),
      body: t("agenda.privacy.body"),
    },
    {
      minutes: t("agenda.pilot.minutes"),
      title: t("agenda.pilot.title"),
      body: t("agenda.pilot.body"),
    },
  ] as const;

  const AUDIENCE = [
    {
      eyebrow: t("audience.hr.eyebrow"),
      title: t("audience.hr.title"),
      body: t("audience.hr.body"),
    },
    {
      eyebrow: t("audience.ops.eyebrow"),
      title: t("audience.ops.title"),
      body: t("audience.ops.body"),
    },
    {
      eyebrow: t("audience.ld.eyebrow"),
      title: t("audience.ld.title"),
      body: t("audience.ld.body"),
    },
  ] as const;

  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK?.trim() || "";
  const hasCal = calLink.length > 0;

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("schema.webPageName"),
      url: localizedUrl("/book-a-demo", loc),
      inLanguage: inLanguage(loc),
      description: t("schema.webPageDescription"),
      potentialAction: {
        "@type": "ReserveAction",
        name: t("schema.webPageName"),
        target: {
          "@type": "EntryPoint",
          urlTemplate: localizedUrl("/book-a-demo", loc),
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: t("schema.reservationName"),
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: inLanguage(loc),
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero */}
      <section style={{ paddingTop: 48, paddingBottom: 20 }}>
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
              style={{
                margin: "10px 0 18px",
                maxWidth: "22ch",
                fontSize: "clamp(34px, 5vw, 58px)",
              }}
            >
              {t.rich("hero.title", {
                italic: (chunks) => (
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    {chunks}
                  </span>
                ),
              })}
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <div className="answer-block" style={{ maxWidth: "62ch" }}>
              <strong>{t("hero.answerLead")}</strong> {t("hero.answerBody")}
            </div>
          </Reveal>
          <Reveal delay={3}>
            <p
              className="small"
              style={{
                marginTop: 18,
                display: "inline-flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
                color: "var(--ink-3)",
              }}
            >
              <span>{t("hero.badgeMadeInSweden")}</span>
              <span aria-hidden="true">·</span>
              <span>{t("hero.badgeGdpr")}</span>
              <span aria-hidden="true">·</span>
              <span>{t("hero.badgeIso")}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Scheduler */}
      <section id="scheduler" aria-labelledby="scheduler-heading" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: hasCal ? "1.4fr 1fr" : "1fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div>
                <h2
                  id="scheduler-heading"
                  className="h-card"
                  style={{ fontSize: 26, margin: "0 0 12px" }}
                >
                  {t("scheduler.title")}
                </h2>
                <p className="small" style={{ margin: "0 0 18px", maxWidth: "52ch" }}>
                  {t("scheduler.body")}
                </p>

                {hasCal ? (
                  <div
                    className="glass"
                    style={{
                      padding: 0,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <CalcomEmbed calLink={calLink} />
                  </div>
                ) : (
                  <DemoFallbackForm />
                )}
              </div>
            </Reveal>

            <Reveal delay={1}>
              <aside
                aria-label={t("expect.eyebrow")}
                className="glass-strong"
                style={{ padding: "28px 28px", background: "rgba(255,255,255,0.78)" }}
              >
                <span className="eyebrow">{t("expect.eyebrow")}</span>
                <h2 className="h-card" style={{ fontSize: 22, margin: "8px 0 16px" }}>
                  {t("expect.title")}
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {EXPECT.map((e) => (
                    <li
                      key={e.title}
                      style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background:
                            "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: "1px solid rgba(255,255,255,0.7)",
                        }}
                      >
                        <Icon name={e.icon} size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--ink-1)", fontSize: 14.5 }}>
                          {e.title}
                        </div>
                        <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
                          {e.body}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <hr className="hr-soft" style={{ margin: "20px 0" }} />
                <p className="small" style={{ margin: 0 }}>
                  {t.rich("expect.cantFind", {
                    emailLink: (chunks) => (
                      <Link
                        href="/contact"
                        style={{ color: "var(--primary)", textDecoration: "underline" }}
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What happens on the call */}
      <section aria-labelledby="agenda-heading" style={{ paddingTop: 16, paddingBottom: 56 }}>
        <div className="container">
          <Reveal>
            <h2
              id="agenda-heading"
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 38px)" }}
            >
              {t("agenda.title")}
            </h2>
            <p className="lede" style={{ margin: "0 0 28px" }}>
              {t("agenda.lede")}
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ol
              aria-label={t("agenda.list.aria")}
              className="agenda-list"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              {AGENDA.map((step, i) => (
                <li
                  key={step.title}
                  className="glass lift"
                  style={{ padding: 22 }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      background:
                        "linear-gradient(135deg, color-mix(in oklch, var(--accent) 16%, white), color-mix(in oklch, var(--secondary) 65%, white))",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--primary)",
                      border: "1px solid rgba(255,255,255,0.7)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 17,
                      margin: "12px 0 6px",
                      color: "var(--ink-1)",
                    }}
                  >
                    <span style={{ color: "var(--ink-3)", fontSize: 11.5, display: "block", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                      {step.minutes}
                    </span>
                    {step.title}
                  </h3>
                  <p className="small" style={{ margin: 0 }}>
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Who should book */}
      <section aria-labelledby="audience-heading" style={{ paddingTop: 16, paddingBottom: 56 }}>
        <div className="container">
          <Reveal>
            <h2
              id="audience-heading"
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 38px)" }}
            >
              {t("audience.title")}
            </h2>
            <p className="lede" style={{ margin: "0 0 28px", maxWidth: "60ch" }}>
              {t("audience.lede")}
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div
              className="grid grid-3"
              style={{ gap: 20 }}
            >
              {AUDIENCE.map((a) => (
                <article
                  key={a.title}
                  className="glass lift"
                  style={{ padding: 24 }}
                >
                  <span className="eyebrow" style={{ fontSize: 11 }}>{a.eyebrow}</span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 19,
                      margin: "10px 0 8px",
                      color: "var(--ink-1)",
                    }}
                  >
                    {a.title}
                  </h3>
                  <p className="small" style={{ margin: 0 }}>
                    {a.body}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" style={{ paddingTop: 16, paddingBottom: 72 }}>
        <div className="container">
          <Reveal>
            <h2
              id="faq-heading"
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 38px)" }}
            >
              {t("faq.title")}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
                maxWidth: 880,
              }}
            >
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="glass"
                  style={{ padding: "18px 22px" }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 17,
                      color: "var(--ink-1)",
                      listStyle: "none",
                    }}
                  >
                    <h3 style={{ display: "inline", margin: 0, fontSize: "inherit", fontWeight: "inherit", fontFamily: "inherit" }}>
                      {f.q}
                    </h3>
                  </summary>
                  <p className="body" style={{ margin: "10px 0 0", maxWidth: "62ch" }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Secondary CTA */}
      <section style={{ padding: "20px 0 80px" }}>
        <div className="container">
          <Reveal>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 32,
                padding: "40px 32px",
                background: `
                  radial-gradient(40% 60% at 8% 30%, color-mix(in oklch, var(--accent) 28%, transparent) 0%, transparent 60%),
                  radial-gradient(45% 70% at 95% 70%, color-mix(in oklch, var(--secondary-deep) 50%, transparent) 0%, transparent 65%),
                  linear-gradient(135deg, #FBFCFE 0%, #EEF3FE 100%)
                `,
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 18px 50px rgba(15,29,69,0.08)",
                display: "grid",
                gridTemplateColumns: "1.4fr auto",
                alignItems: "center",
                gap: 24,
              }}
              className="cta-row"
            >
              <div>
                <h2
                  className="h-section"
                  style={{ margin: "0 0 8px", fontSize: "clamp(22px, 2.6vw, 30px)" }}
                >
                  {t("secondaryCta.title")}
                </h2>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  {t("secondaryCta.body")}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link href="/contact" className="btn btn-primary" style={{ background: "var(--navy)" }}>
                  {t("secondaryCta.primary")} <ArrowRight size={14} />
                </Link>
                <Link href="/#platform" className="btn btn-glass">
                  {t("secondaryCta.secondary")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
