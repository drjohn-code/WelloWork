import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import { ADMIN_COOKIE, listPayouts, purgeOldIbans, verifyAdminSession } from "@/app/lib/game/payouts";
import { PlayShell } from "@/app/components/play/PlayShell";
import { AdminPayouts } from "@/app/components/admin/AdminPayouts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as AppLocale, namespace: "admin" });
  return { title: t("payouts.metaTitle"), robots: { index: false, follow: false } };
}

export default async function AdminPayoutsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const jar = await cookies();
  if (!verifyAdminSession(jar.get(ADMIN_COOKIE)?.value)) redirect({ href: "/admin/login", locale: locale as AppLocale });
  const [rows, purged] = await Promise.all([listPayouts(), purgeOldIbans()]);
  return (
    <PlayShell wide>
      <AdminPayouts rows={rows} purged={purged} />
    </PlayShell>
  );
}
