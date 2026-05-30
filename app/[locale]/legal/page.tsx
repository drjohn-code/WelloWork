import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/PageHero";
import { JsonLd } from "@/app/components/JsonLd";
import { LegalNav } from "@/app/components/LegalNav";
import {
  PrivacyTrustBar,
  ControllerDiagram,
  DataCollectedGrid,
  LegalBasisStrip,
  EuDataCard,
  RetentionTimeline,
  GdprRightsGrid,
  SecurityStrip,
  TermsAnchorStrip,
  EntityCard,
  AcceptableUseSplit,
  IpOwnershipDiagram,
  WarrantyCallout,
  GoverningLawLine,
  CookieTrustBadge,
  CookieTable,
  CookieControlSteps,
  CookieChangesCallout,
  DpaRelationshipDiagram,
  DpaSubjectStrip,
  DpaProcessingSplit,
  SubProcessorCallout,
  DpaContactCta,
} from "@/app/components/LegalVisuals";
import {
  buildMetadata,
  breadcrumbList,
  localizedUrl,
  inLanguage,
  ORG_EMAIL,
  ORG_LEGAL_NAME,
  ORG_CITY,
  ORG_COUNTRY,
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
    title: t("legal.title"),
    description: t("legal.description"),
    path: "/legal",
  });
}

function SectionIcon({ name }: { name: "lock" | "scale" | "cookie" | "stack" }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  const stroke = "var(--primary)";
  switch (name) {
    case "lock":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3v18M5 6h14M6 6l-3 7a3 3 0 006 0L6 6zm12 0l-3 7a3 3 0 006 0l-3-7z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "cookie":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M21 12a9 9 0 11-9-9 5 5 0 005 5 4 4 0 004 4z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="10" r="1" fill={stroke} />
          <circle cx="14" cy="14" r="1" fill={stroke} />
          <circle cx="10" cy="15" r="1" fill={stroke} />
        </svg>
      );
    case "stack":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="4" width="18" height="6" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <circle cx="7" cy="7" r="0.9" fill={stroke} />
          <circle cx="7" cy="17" r="0.9" fill={stroke} />
        </svg>
      );
  }
}

export default async function LegalPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("legal");
  const tb = await getTranslations("breadcrumbs");

  const crumbs = [
    { name: tb("home"), href: "/" },
    { name: tb("legal"), href: "/legal" },
  ];

  const schema = [
    breadcrumbList(crumbs, loc),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("schema.webPageName"),
      url: localizedUrl("/legal", loc),
      inLanguage: inLanguage(loc),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lede={t("hero.lede")}
        crumbs={crumbs}
      />

      <section className="legal-wrap">
        <div className="container">
          <div className="legal-layout">
            <aside className="legal-sidebar">
              <LegalNav />
            </aside>

            <div className="legal-content">
              {/* Privacy Policy */}
              <article id="privacy" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="lock" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">{t("section.label", { n: 1 })}</div>
                    <h2 className="legal-section-title">{t("privacy.title")}</h2>
                  </div>
                </header>
                <p className="legal-section-lede">{t("privacy.lede")}</p>
                <div className="legal-section-visual">
                  <PrivacyTrustBar />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>{t("privacy.coverQ")}</strong> {t("privacy.coverA")}
                </div>

                <div className="prose legal-prose">
                  <h3>{t("privacy.controllerQ")}</h3>
                  <p>
                    {t("privacy.controllerBody", {
                      legalName: ORG_LEGAL_NAME,
                      city: ORG_CITY,
                      country: ORG_COUNTRY,
                    })}
                  </p>
                  <ControllerDiagram />

                  <h3>{t("privacy.dataQ")}</h3>
                  <DataCollectedGrid />

                  <h3>{t("privacy.basisQ")}</h3>
                  <LegalBasisStrip />

                  <h3>{t("privacy.storedQ")}</h3>
                  <p>{t("privacy.storedBody")}</p>
                  <EuDataCard note={t("visual.euCard.privacyNote")} />

                  <h3>{t("privacy.retentionQ")}</h3>
                  <RetentionTimeline />

                  <h3>{t("privacy.rightsQ")}</h3>
                  <p>{t("privacy.rightsBody")}</p>
                  <GdprRightsGrid />

                  <h3>{t("privacy.securityQ")}</h3>
                  <p>{t("privacy.securityBody")}</p>
                  <SecurityStrip />

                  <h3>{t("privacy.changesQ")}</h3>
                  <p>{t("privacy.changesBody")}</p>

                  <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 12 }}>
                    {t("privacy.exerciseNote", { email: ORG_EMAIL })}
                  </p>
                </div>
              </article>

              {/* Terms of Service */}
              <article id="terms" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="scale" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">{t("section.label", { n: 2 })}</div>
                    <h2 className="legal-section-title">{t("terms.title")}</h2>
                  </div>
                </header>
                <p className="legal-section-lede">{t("terms.lede")}</p>
                <div className="legal-section-visual">
                  <TermsAnchorStrip />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>{t("terms.coverQ")}</strong> {t("terms.coverA")}
                </div>

                <div className="prose legal-prose">
                  <h3 id="entity">{t("terms.entityQ")}</h3>
                  <p>{t("terms.entityBody", { legalName: ORG_LEGAL_NAME })}</p>
                  <EntityCard />

                  <h3 id="acceptable-use">{t("terms.useQ")}</h3>
                  <AcceptableUseSplit />

                  <h3 id="ip">{t("terms.ipQ")}</h3>
                  <p>{t("terms.ipBody", { legalName: ORG_LEGAL_NAME })}</p>
                  <IpOwnershipDiagram />

                  <h3 id="warranties">{t("terms.warrantiesQ")}</h3>
                  <p>{t("terms.warrantiesBody")}</p>
                  <WarrantyCallout />

                  <h3 id="law">{t("terms.lawQ")}</h3>
                  <p>{t("terms.lawBody")}</p>
                  <GoverningLawLine />

                  <h3 id="changes">{t("terms.changesQ")}</h3>
                  <p>{t("terms.changesBody")}</p>
                </div>
              </article>

              {/* Cookie Policy */}
              <article id="cookies" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="cookie" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">{t("section.label", { n: 3 })}</div>
                    <h2 className="legal-section-title">{t("cookies.title")}</h2>
                  </div>
                </header>
                <p className="legal-section-lede">{t("cookies.lede")}</p>
                <div className="legal-section-visual">
                  <CookieTrustBadge />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>{t("cookies.coverQ")}</strong> {t("cookies.coverA")}
                </div>

                <div className="prose legal-prose">
                  <h3>{t("cookies.whatQ")}</h3>
                  <p>{t("cookies.whatBody")}</p>

                  <h3>{t("cookies.usedHereQ")}</h3>
                  <CookieTable />

                  <h3>{t("cookies.controlQ")}</h3>
                  <CookieControlSteps />

                  <h3>{t("cookies.changesQ")}</h3>
                  <p>{t("cookies.changesBody")}</p>
                  <CookieChangesCallout />
                </div>
              </article>

              {/* Data Processing */}
              <article id="data-processing" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="stack" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">{t("section.label", { n: 4 })}</div>
                    <h2 className="legal-section-title">{t("dpa.title")}</h2>
                  </div>
                </header>
                <p className="legal-section-lede">{t("dpa.lede")}</p>
                <div className="legal-section-visual">
                  <DpaRelationshipDiagram />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>{t("dpa.coverQ")}</strong>{" "}
                  {t("dpa.coverA", { legalName: ORG_LEGAL_NAME })}
                </div>

                <div className="prose legal-prose">
                  <h3>{t("dpa.subjectQ")}</h3>
                  <DpaSubjectStrip />

                  <h3>{t("dpa.natureQ")}</h3>
                  <p>{t("dpa.natureBody")}</p>
                  <DpaProcessingSplit />

                  <h3>{t("dpa.subjectsQ")}</h3>
                  <p>{t("dpa.subjectsBody")}</p>

                  <h3>{t("dpa.subprocessorsQ")}</h3>
                  <SubProcessorCallout />

                  <h3>{t("dpa.transfersQ")}</h3>
                  <p>{t("dpa.transfersBody")}</p>
                  <EuDataCard
                    label={t("visual.euCard.dpaLabel")}
                    note={t("visual.euCard.dpaNote")}
                  />

                  <h3>{t("dpa.securityQ")}</h3>
                  <p>{t("dpa.securityBody")}</p>
                  <SecurityStrip />

                  <h3>{t("dpa.contactQ")}</h3>
                  <DpaContactCta />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
