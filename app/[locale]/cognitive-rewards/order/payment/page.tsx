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
import { PaymentPlaceholder } from "@/app/components/order/PaymentPlaceholder";
import { buildMetadata, breadcrumbList } from "@/app/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("cognitiveRewardsOrderPayment.title"),
    description: t("cognitiveRewardsOrderPayment.description"),
    path: "/cognitive-rewards/order/payment",
  });
}

export default async function CognitiveRewardsOrderPaymentPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("cognitiveRewardsOrder");

  const CRUMBS = [
    { name: t("crumbs.home"), href: "/" },
    { name: t("crumbs.cognitiveRewards"), href: "/cognitive-rewards" },
    { name: t("crumbs.current"), href: "/cognitive-rewards/order" },
    { name: t("crumbs.payment"), href: "/cognitive-rewards/order/payment" },
  ];

  const schema = [breadcrumbList(CRUMBS, loc)];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow={t("payment.eyebrow")}
        title={
          <>
            {t("payment.titleLead")}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {t("payment.titleAccent")}
            </span>
          </>
        }
        lede={t("payment.lede")}
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 8, paddingBottom: 80 }}>
        <div className="container">
          <Reveal>
            <Suspense fallback={null}>
              <PaymentPlaceholder />
            </Suspense>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
