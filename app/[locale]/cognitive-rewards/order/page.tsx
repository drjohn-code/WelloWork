import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { JsonLd } from "@/app/components/JsonLd";
import { OrderWizard } from "@/app/components/order/OrderWizard";
import { Link } from "@/i18n/navigation";
import { buildMetadata, breadcrumbList } from "@/app/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("cognitiveRewardsOrder.title"),
    description: t("cognitiveRewardsOrder.description"),
    path: "/cognitive-rewards/order",
  });
}

export default async function CognitiveRewardsOrderPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("cognitiveRewardsOrder");

  const CRUMBS = [
    { name: t("crumbs.home"), href: "/" },
    { name: t("crumbs.cognitiveRewards"), href: "/cognitive-rewards" },
    { name: t("crumbs.current"), href: "/cognitive-rewards/order" },
  ];

  const schema = [breadcrumbList(CRUMBS, loc)];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow={t("eyebrow")}
        title={
          <>
            {t("titleLead")}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {t("titleAccent")}
            </span>
          </>
        }
        lede={t("lede")}
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 8, paddingBottom: 80 }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <Suspense fallback={null}>
                <OrderWizard />
              </Suspense>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div
              style={{
                maxWidth: 760,
                margin: "28px auto 0",
                padding: "26px 30px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.35)",
                border: "1px dashed rgba(15,29,69,0.18)",
                textAlign: "center",
              }}
            >
              <h2 className="h-card" style={{ margin: "0 0 8px", fontSize: 18 }}>
                {t("bulk.heading")}
              </h2>
              <p
                className="body"
                style={{ margin: "0 auto 18px", fontSize: 14.5, maxWidth: "56ch" }}
              >
                {t("bulk.body")}
              </p>
              <Link href="/book-a-demo" className="btn btn-glass">
                {t("bulk.cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
