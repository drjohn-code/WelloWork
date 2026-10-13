import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { getView, loadContext } from "@/app/lib/game/service";
import { PlayShell } from "@/app/components/play/PlayShell";
import { PlayClient } from "@/app/components/play/PlayClient";
import { InvalidLink } from "@/app/components/play/InvalidLink";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string; token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as AppLocale, namespace: "play" });
  return {
    title: t("metaTitle"),
    // Personal link: never index it, and never leak the token via Referer.
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function PlayLobbyPage({ params }: PageProps) {
  const { locale, token } = await params;
  setRequestLocale(locale as AppLocale);
  const ctx = await loadContext(token);
  const view = ctx ? await getView(ctx) : null;
  return <PlayShell>{view ? <PlayClient token={token} initial={view} page="lobby" /> : <InvalidLink />}</PlayShell>;
}
