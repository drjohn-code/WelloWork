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
import { LeadForm } from "@/app/components/LeadForm";
import {
  buildMetadata,
  breadcrumbList,
  organizationSchema,
  ORG_EMAIL,
  ORG_PHONE,
  ORG_PHONE_TEL,
  ORG_CITY,
  ORG_COUNTRY,
} from "@/app/lib/site";
import { Icon } from "@/app/components/Icons";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("contact.title"),
    description: t("contact.description"),
    path: "/contact",
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("contact");
  const tb = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tb("home"), href: "/" },
    { name: tb("contact"), href: "/contact" },
  ];

  const schema = [breadcrumbList(CRUMBS, loc), organizationSchema(loc)];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", {
          italic: (chunks) => (
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {chunks}
            </span>
          ),
        })}
        lede={t("hero.lede")}
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 48,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, margin: "0 0 14px" }}>
                  {t("reach.title")}
                </h2>
                <div className="answer-block">
                  <strong>{t("reach.answerLead")}</strong>{" "}
                  {t.rich("reach.answerBody", {
                    demoLink: (chunks) => <Link href="/book-a-demo">{chunks}</Link>,
                    email: ORG_EMAIL,
                    phone: ORG_PHONE,
                  })}
                </div>

                <div
                  style={{
                    marginTop: 28,
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 14,
                  }}
                >
                  <ContactRow icon="lock" label={t("row.email.label")} value={ORG_EMAIL} href={`mailto:${ORG_EMAIL}`} />
                  <ContactRow icon="bolt" label={t("row.phone.label")} value={ORG_PHONE} href={`tel:${ORG_PHONE_TEL}`} />
                  <ContactRow
                    icon="layers"
                    label={t("row.area.label")}
                    value={t("row.area.value", { city: ORG_CITY, country: ORG_COUNTRY })}
                  />
                  <ContactRow
                    icon="calendar"
                    label={t("row.hours.label")}
                    value={t("row.hours.value")}
                  />
                </div>

                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, margin: "36px 0 14px" }}>
                  {t("based.title")}
                </h2>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  {t("based.body")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <LeadForm
                endpoint="/api/contact-messages"
                submitLabel={t("form.submitLabel")}
                successTitle={t("form.successTitle")}
                successBody={t("form.successBody")}
                messageRequired
                companyRequired={false}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="glass" style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}>
      <div
        style={{
          width: 38,
          height: 38,
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
        <Icon name={icon} size={18} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-3)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-1)" }}>{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} style={{ display: "block" }}>
      {content}
    </a>
  ) : (
    content
  );
}
