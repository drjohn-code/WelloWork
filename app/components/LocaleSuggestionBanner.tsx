"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  enabledLocaleMetas,
  isEnabledLocale,
  type AppLocale,
  type LocaleMeta,
} from "@/i18n/locales";

const COOKIE = "NEXT_LOCALE";
const DISMISS_KEY = "ww_locale_suggestion_dismissed";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Dismissible, non-blocking "view in <language>?" prompt — the SEO-safe
 * alternative to force-redirecting users whose browser language differs from
 * the page they're on (SEO_GUIDELINES §9, §14: no cloaking, URL stays the
 * source of truth). Dismissal persists in localStorage. Renders nothing for
 * bots-friendly SSR (it only mounts client-side after a language match).
 */
export function LocaleSuggestionBanner() {
  const t = useTranslations("localeSwitcher.banner");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<({ code: AppLocale } & LocaleMeta) | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }
    const preferred = navigator.languages?.[0] ?? navigator.language;
    if (!preferred) return;
    const base = preferred.toLowerCase().split("-")[0];
    if (!isEnabledLocale(base) || base === activeLocale) return;
    const meta = enabledLocaleMetas().find((l) => l.code === base);
    // Client-only detection on mount (navigator is unavailable during SSR), so
    // setting state here is intentional and runs at most once per match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (meta) setSuggested(meta);
  }, [activeLocale]);

  if (!suggested) return null;

  function persistDismissed() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage unavailable — non-blocking */
    }
  }

  return (
    <div className="locale-banner" role="region" aria-label={t("region")}>
      <span className="locale-banner__text" lang={suggested.hreflang}>
        {t("question", { language: suggested.endonym })}
      </span>
      <Link
        href={pathname}
        locale={suggested.code}
        lang={suggested.hreflang}
        hrefLang={suggested.hreflang}
        className="locale-banner__cta"
        onClick={() => {
          document.cookie = `${COOKIE}=${suggested.code}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
          persistDismissed();
        }}
      >
        {t("switch", { language: suggested.endonym })}
      </Link>
      <button
        type="button"
        className="locale-banner__dismiss"
        onClick={() => {
          persistDismissed();
          setSuggested(null);
        }}
      >
        {t("dismiss")}
      </button>
    </div>
  );
}
