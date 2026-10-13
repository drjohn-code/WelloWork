import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PlayShell } from "@/app/components/play/PlayShell";
import { AdminLogin } from "@/app/components/admin/AdminLogin";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as AppLocale, namespace: "admin" });
  return { title: t("login.metaTitle"), robots: { index: false, follow: false } };
}

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  return (
    <PlayShell>
      <AdminLogin />
    </PlayShell>
  );
}
