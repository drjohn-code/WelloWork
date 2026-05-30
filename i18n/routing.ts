import { defineRouting } from 'next-intl/routing';
import { ENABLED_LOCALES, defaultLocale } from './locales';

/**
 * next-intl routing config. `locales` is driven by ENABLED_LOCALES (the single
 * enablement switch in ./locales.ts), so adding/removing a published locale is
 * a one-line change there.
 *
 * - localePrefix 'as-needed': the default locale (en) is served WITHOUT a prefix
 *   (`/`, `/about`); every other enabled locale is prefixed (`/de/about`). This
 *   keeps the primary market on clean URLs (SEO_GUIDELINES §9.2 subdirectory).
 * - localeDetection: false — the URL is the single source of truth for locale.
 *   All cookie / Accept-Language / IP seeding happens once, deterministically,
 *   in proxy.ts (SEO_GUIDELINES §9, §14: no cloaking, crawlable per-locale URLs).
 */
export const routing = defineRouting({
  locales: ENABLED_LOCALES,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
