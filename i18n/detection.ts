import {
  ENABLED_LOCALES,
  defaultLocale,
  type AppLocale,
} from './locales';

/**
 * Maps an IP-derived ISO-3166 country (Vercel `x-vercel-ip-country`) to a locale.
 * This is the PRIMARY signal for the default locale (see `resolveLocale`): a
 * visitor from a Lithuanian IP defaults to Lithuanian even if their browser is
 * set to English.
 *
 * Multilingual countries default to one language here; visitors can switch from
 * the toolbar (their choice is then remembered via the NEXT_LOCALE cookie).
 * Values may point at locales that aren't enabled yet — the resolver CLAMPS to
 * ENABLED_LOCALES, so a disabled mapping can never become a redirect target.
 */
export const COUNTRY_TO_LOCALE: Record<string, AppLocale> = {
  // English
  GB: 'en', IE: 'en', US: 'en', MT: 'en', CY: 'el', AU: 'en', NZ: 'en', CA: 'en',
  // German (AT/CH multilingual -> de default)
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  // French (BE/LU multilingual -> fr default)
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr',
  // Romance + Iberian
  ES: 'es', IT: 'it', PT: 'pt', RO: 'ro', SM: 'it', VA: 'it', AD: 'es',
  // Benelux / Nordics / Baltics
  NL: 'nl', SE: 'sv', DK: 'da', FI: 'fi', NO: 'nb', IS: 'is',
  PL: 'pl', LT: 'lt', LV: 'lv', EE: 'et',
  // Central / South-Eastern Europe
  CZ: 'cs', SK: 'sk', HU: 'hu', SI: 'sl', HR: 'hr', BG: 'bg', GR: 'el',
  // Eastern Europe
  UA: 'uk',
};

/** Parse an `Accept-Language` header into lower-cased tags, highest q-value first. */
function rankAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? Number.parseFloat(qParam.split('=')[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((x) => x.tag && x.tag !== '*')
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}

type ResolveInput = {
  acceptLanguage?: string | null;
  country?: string | null;
  /** Injectable for testing; defaults to the live config. */
  enabled?: readonly AppLocale[];
  /** Injectable for testing; defaults to the live config. Must be in `enabled`. */
  fallback?: AppLocale;
};

/**
 * Seed the initial locale choice at the x-default root. Resolution order:
 *
 *   1. COUNTRY (IP geolocation)  — the PRIMARY signal. "Default by IP": a
 *      Lithuanian IP -> Lithuanian, a Swedish IP -> Swedish, etc., regardless of
 *      the browser's Accept-Language.
 *   2. Accept-Language           — FALLBACK, used only when there is no usable
 *      country (e.g. local dev, or a country not in COUNTRY_TO_LOCALE).
 *   3. fallback (default)        — guaranteed enabled.
 *
 * GUARANTEE: the return value is ALWAYS a member of `enabled`. A signal that
 * resolves to a disabled locale is discarded, so we never 307 to an unrouted URL.
 */
export function resolveLocale({
  acceptLanguage,
  country,
  enabled = ENABLED_LOCALES,
  fallback = defaultLocale,
}: ResolveInput): AppLocale {
  const isEnabled = (value: string): value is AppLocale =>
    (enabled as readonly string[]).includes(value);

  // 1. Country (IP) — primary.
  if (country) {
    const mapped = COUNTRY_TO_LOCALE[country.toUpperCase()];
    if (mapped && isEnabled(mapped)) return mapped;
  }

  // 2. Accept-Language — fallback when there's no usable country signal.
  for (const tag of rankAcceptLanguage(acceptLanguage)) {
    if (isEnabled(tag)) return tag;
    const base = tag.split('-')[0];
    if (isEnabled(base)) return base;
  }

  // 3. Default.
  return fallback;
}

type RedirectInput = ResolveInput & {
  pathname: string;
  isBot: boolean;
  /** Value of the NEXT_LOCALE cookie, if present (a returning visitor's choice). */
  cookieLocale?: string | null;
};

/**
 * Pure decision for the root redirect (unit-testable without Next internals).
 * Returns the enabled locale to 307 to, or `null` when no redirect should happen.
 *
 * Redirect ONLY at the x-default root ("/") and ONLY for non-bots (SEO_GUIDELINES
 * §9, §14: deep URLs never redirect; bots never redirect, so every locale URL
 * stays crawlable). Then:
 *   • a returning visitor's NEXT_LOCALE cookie (their explicit toolbar choice) is
 *     honored over geolocation;
 *   • otherwise resolve by IP country (primary) -> Accept-Language (fallback).
 * In both cases, a result equal to the default means "stay on the prefix-free
 * default", i.e. no redirect.
 */
export function shouldRedirect({
  pathname,
  isBot,
  cookieLocale,
  acceptLanguage,
  country,
  enabled = ENABLED_LOCALES,
  fallback = defaultLocale,
}: RedirectInput): AppLocale | null {
  if (pathname !== '/' || isBot) return null;

  const isEnabled = (value: string): value is AppLocale =>
    (enabled as readonly string[]).includes(value);

  // Returning visitor: honor their explicit choice (the toolbar sets this cookie).
  if (cookieLocale && isEnabled(cookieLocale)) {
    return cookieLocale !== fallback ? cookieLocale : null;
  }

  // Fresh visitor: IP country (primary) -> Accept-Language (fallback) -> default.
  const locale = resolveLocale({ acceptLanguage, country, enabled, fallback });
  return locale !== fallback ? locale : null;
}

export { ENABLED_LOCALES, defaultLocale };
