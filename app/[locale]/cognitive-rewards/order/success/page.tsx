import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { JsonLd } from "@/app/components/JsonLd";
import { OrderSuccess } from "@/app/components/order/OrderSuccess";
import { buildMetadata, breadcrumbList } from "@/app/lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
  // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD: mock_order added alongside session_id.
  searchParams: Promise<{ session_id?: string | string[]; mock_order?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("cognitiveRewardsOrderSuccess.title"),
    description: t("cognitiveRewardsOrderSuccess.description"),
    path: "/cognitive-rewards/order/success",
  });
}

export default async function CognitiveRewardsOrderSuccessPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { session_id: sessionIdParam, mock_order: mockOrderParam } = await searchParams;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("cognitiveRewardsOrder");
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam;
  // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
  const mockOrderId = Array.isArray(mockOrderParam) ? mockOrderParam[0] : mockOrderParam;

  const CRUMBS = [
    { name: t("crumbs.home"), href: "/" },
    { name: t("crumbs.cognitiveRewards"), href: "/cognitive-rewards" },
    { name: t("crumbs.current"), href: "/cognitive-rewards/order" },
    { name: t("crumbs.success"), href: "/cognitive-rewards/order/success" },
  ];

  const schema = [breadcrumbList(CRUMBS, loc)];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow={t("success.eyebrow")}
        title={
          <>
            {t("success.titleLead")}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {t("success.titleAccent")}
            </span>
          </>
        }
        lede={t("success.lede")}
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 8, paddingBottom: 80 }}>
        <div className="container">
          <Reveal>
            <OrderSuccess sessionId={sessionId} mockOrderId={mockOrderId} locale={loc} />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
