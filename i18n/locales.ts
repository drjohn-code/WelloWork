/**
 * Single source of truth for locale enablement and per-locale metadata.
 *
 * ──────────────────────────────────────────────────────────────────────────
 *  TO PUBLISH A LOCALE: add its code to `PUBLISHED_LOCALES` below. That one
 *  array drives routing, the language switcher, hreflang alternates and the
 *  sitemap (via the derived `ENABLED_LOCALES`). A locale that is NOT enabled
 *  never appears in any of them (SEO_GUIDELINES §6 config-driven enablement;
 *  §9 international SEO).
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  Brand rule (SEO_GUIDELINES §2.1): "WelloWork" (and the product sub-brands
 *  "WelloRise" / "WelloWize") are NEVER translated or transliterated in any
 *  locale. They live in the message catalogs verbatim.
 */

/**
 * Every locale the system KNOWS ABOUT (BCP-47, language-only subtags for now;
 * region variants like `pt-PT` / `en-GB` can be added later without a refactor).
 * Enablement is separate — see `ENABLED_LOCALES`.
 *
 * `en-XA` is a pseudo-locale used only for layout/overflow testing
 * (see messages/en-XA.json) and must never be enabled in production.
 */
export const ALL_LOCALE_CODES = [
  // Tier 1 — launch candidates
  'en', 'de', 'fr', 'es', 'it',
  // Tier 2 — next
  'pt', 'nl', 'pl', 'sv', 'da', 'fi', 'nb', 'cs', 'el', 'ro', 'hu', 'lt', 'lv', 'et',
  // Tier 3 — remainder of the EU-24 + wider Europe
  'bg', 'hr', 'sk', 'sl', 'ga', 'mt', 'is', 'uk',
  // Pseudo-locale (testing only — never enable in production)
  'en-XA',
] as const;

export type AppLocale = (typeof ALL_LOCALE_CODES)[number];

export type LocaleMeta = {
  /** Native name, shown in the switcher (SEO_GUIDELINES §9: endonyms, no flags). */
  endonym: string;
  /** English name, for docs / aria fallbacks. */
  englishName: string;
  /** Open Graph locale tag (og:locale), e.g. `de_DE`. */
  ogLocale: string;
  /** hreflang / inLanguage BCP-47 tag. Language-only for now. */
  hreflang: string;
  /** Publishing tier (documentation only). */
  tier: 1 | 2 | 3 | 'test';
};

export const LOCALES: Record<AppLocale, LocaleMeta> = {
  en: { endonym: 'English', englishName: 'English', ogLocale: 'en_US', hreflang: 'en', tier: 1 },
  de: { endonym: 'Deutsch', englishName: 'German', ogLocale: 'de_DE', hreflang: 'de', tier: 1 },
  fr: { endonym: 'Français', englishName: 'French', ogLocale: 'fr_FR', hreflang: 'fr', tier: 1 },
  es: { endonym: 'Español', englishName: 'Spanish', ogLocale: 'es_ES', hreflang: 'es', tier: 1 },
  it: { endonym: 'Italiano', englishName: 'Italian', ogLocale: 'it_IT', hreflang: 'it', tier: 1 },

  pt: { endonym: 'Português', englishName: 'Portuguese', ogLocale: 'pt_PT', hreflang: 'pt', tier: 2 },
  nl: { endonym: 'Nederlands', englishName: 'Dutch', ogLocale: 'nl_NL', hreflang: 'nl', tier: 2 },
  pl: { endonym: 'Polski', englishName: 'Polish', ogLocale: 'pl_PL', hreflang: 'pl', tier: 2 },
  sv: { endonym: 'Svenska', englishName: 'Swedish', ogLocale: 'sv_SE', hreflang: 'sv', tier: 2 },
  da: { endonym: 'Dansk', englishName: 'Danish', ogLocale: 'da_DK', hreflang: 'da', tier: 2 },
  fi: { endonym: 'Suomi', englishName: 'Finnish', ogLocale: 'fi_FI', hreflang: 'fi', tier: 2 },
  nb: { endonym: 'Norsk bokmål', englishName: 'Norwegian Bokmål', ogLocale: 'nb_NO', hreflang: 'nb', tier: 2 },
  cs: { endonym: 'Čeština', englishName: 'Czech', ogLocale: 'cs_CZ', hreflang: 'cs', tier: 2 },
  el: { endonym: 'Ελληνικά', englishName: 'Greek', ogLocale: 'el_GR', hreflang: 'el', tier: 2 },
  ro: { endonym: 'Română', englishName: 'Romanian', ogLocale: 'ro_RO', hreflang: 'ro', tier: 2 },
  hu: { endonym: 'Magyar', englishName: 'Hungarian', ogLocale: 'hu_HU', hreflang: 'hu', tier: 2 },
  lt: { endonym: 'Lietuvių', englishName: 'Lithuanian', ogLocale: 'lt_LT', hreflang: 'lt', tier: 2 },
  lv: { endonym: 'Latviešu', englishName: 'Latvian', ogLocale: 'lv_LV', hreflang: 'lv', tier: 2 },
  et: { endonym: 'Eesti', englishName: 'Estonian', ogLocale: 'et_EE', hreflang: 'et', tier: 2 },

  bg: { endonym: 'Български', englishName: 'Bulgarian', ogLocale: 'bg_BG', hreflang: 'bg', tier: 3 },
  hr: { endonym: 'Hrvatski', englishName: 'Croatian', ogLocale: 'hr_HR', hreflang: 'hr', tier: 3 },
  sk: { endonym: 'Slovenčina', englishName: 'Slovak', ogLocale: 'sk_SK', hreflang: 'sk', tier: 3 },
  sl: { endonym: 'Slovenščina', englishName: 'Slovenian', ogLocale: 'sl_SI', hreflang: 'sl', tier: 3 },
  ga: { endonym: 'Gaeilge', englishName: 'Irish', ogLocale: 'ga_IE', hreflang: 'ga', tier: 3 },
  mt: { endonym: 'Malti', englishName: 'Maltese', ogLocale: 'mt_MT', hreflang: 'mt', tier: 3 },
  is: { endonym: 'Íslenska', englishName: 'Icelandic', ogLocale: 'is_IS', hreflang: 'is', tier: 3 },
  uk: { endonym: 'Українська', englishName: 'Ukrainian', ogLocale: 'uk_UA', hreflang: 'uk', tier: 3 },

  'en-XA': { endonym: 'Ƥşéúðø‑Ļöçàļé', englishName: 'Pseudo (test)', ogLocale: 'en_US', hreflang: 'en-XA', tier: 'test' },
};

/** Default / x-default locale. English copy is the fully-written source. */
export const defaultLocale: AppLocale = 'en';

/**
 * THE enablement switch — add a locale code here to publish it. Launch = English
 * only; the Tier-1/2/3 locales above are scaffolded as flagged DRAFTS
 * (messages/<code>.json) and stay disabled until a human-reviewed translation
 * lands — then add the code here.
 *
 * `en-XA` may be added here for LOCAL testing only. It is force-stripped from
 * production builds (see ENABLED_LOCALES below), so it can NEVER ship enabled
 * even if this toggle is accidentally left in.
 */
const PUBLISHED_LOCALES: AppLocale[] = ['en', 'sv', 'nl', 'de', 'fr', 'es', 'it', 'lt'];

/**
 * Effective enabled locales. Routing, the switcher, hreflang, the sitemap and
 * detection all derive from this. The pseudo-locale `en-XA` is removed in
 * production regardless of PUBLISHED_LOCALES — making it impossible to ship the
 * test locale enabled or indexable.
 */
export const ENABLED_LOCALES: AppLocale[] =
  process.env.NODE_ENV === "production"
    ? PUBLISHED_LOCALES.filter((locale) => locale !== "en-XA")
    : PUBLISHED_LOCALES;

/** Runtime guard: is this string an enabled (publishable) locale? */
export function isEnabledLocale(value: string): value is AppLocale {
  return (ENABLED_LOCALES as readonly string[]).includes(value);
}

/** Metadata for a known locale. */
export function getLocaleMeta(locale: AppLocale): LocaleMeta {
  return LOCALES[locale];
}

/** Enabled locales paired with their metadata (switcher / hreflang / sitemap). */
export function enabledLocaleMetas(): Array<{ code: AppLocale } & LocaleMeta> {
  return ENABLED_LOCALES.map((code) => ({ code, ...LOCALES[code] }));
}
