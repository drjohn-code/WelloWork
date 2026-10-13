import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { OrderWizard } from "@/app/components/order/OrderWizard";
import { Link } from "@/i18n/navigation";
import { buildMetadata, breadcrumbList } from "@/app/lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ checkout?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return {
    ...buildMetadata({
      locale: loc,
      title: t("cognitiveRewardsOrder.title"),
      description: t("cognitiveRewardsOrder.description"),
      path: "/cognitive-rewards/order",
    }),
    // Checkout page: keep it out of the index, but let crawlers follow its links.
    robots: { index: false, follow: true },
  };
}

export default async function CognitiveRewardsOrderPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { checkout } = await searchParams;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("cognitiveRewardsOrder");
  const tNav = await getTranslations("nav");

  const SCHEMA_CRUMBS = [
    { name: t("crumbs.home"), href: "/" },
    { name: t("crumbs.cognitiveRewards"), href: "/cognitive-rewards" },
    { name: t("crumbs.current"), href: "/cognitive-rewards/order" },
  ];
  const VISIBLE_CRUMBS = [
    { name: tNav("items.gameReward"), href: "/cognitive-rewards" },
    { name: t("crumbs.current"), href: "/cognitive-rewards/order" },
  ];

  const schema = [breadcrumbList(SCHEMA_CRUMBS, loc)];
  const checkoutCancelled = (Array.isArray(checkout) ? checkout[0] : checkout) === "cancelled";

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <section className="order-page">
        <div className="container">
          <div className="order-page-head">
            <Breadcrumbs items={VISIBLE_CRUMBS} separator="›" />
            <h1 className="order-page-title">
              {t("titleLead")}
              <span className="italic-serif" style={{ color: "var(--accent)" }}>
                {t("titleAccent")}
              </span>
              {t("titleTail")}
            </h1>
            <p className="order-page-lede">{t("lede")}</p>
          </div>

          <OrderWizard checkoutCancelled={checkoutCancelled} />

          <div className="order-bulk">
            <p>{t("bulk.body")}</p>
            <Link href="/book-a-demo" className="order-bulk-link">
              {t("bulk.cta")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
