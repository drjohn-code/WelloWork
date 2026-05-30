import {
  ENABLED_LOCALES,
  defaultLocale,
  type AppLocale,
} from './locales';

/**
 * Maps an IP-derived ISO-3166 country to a likely locale. IP only ever yields a
 * COUNTRY (a region signal), so this is a TIEBREAKER — `Accept-Language` (an
 * explicit language signal) is checked first in `resolveLocale`.
 *
 * Multilingual countries default to one language here; `Accept-Language` will
 * override it when the browser expresses a clearer preference. Values may point
 * at locales that aren't enabled yet — the resolver CLAMPS to `enabled` so a
 * disabled mapping can never become a redirect target.
 */
export const COUNTRY_TO_LOCALE: Record<string, AppLocale> = {
  // English
  GB: 'en', IE: 'en', US: 'en', MT: 'en', CY: 'el', AU: 'en', NZ: 'en', CA: 'en',
  // German (AT/CH multilingual -> de default, Accept-Language overrides)
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
 * The single deterministic resolver used to SEED the initial locale choice at
 * the x-default root (SEO_GUIDELINES §9, §14). Resolution order:
 *
 *   1. NEXT_LOCALE cookie   — handled by proxy.ts (an existing cookie skips the
 *                             redirect entirely; the user already chose).
 *   2. Accept-Language      — strongest explicit language signal.
 *   3. COUNTRY_TO_LOCALE    — region tiebreaker from IP geolocation.
 *   4. fallback (default)   — guaranteed enabled.
 *
 * GUARANTEE: the return value is ALWAYS a member of `enabled`. A signal that
 * resolves to a disabled locale is discarded and falls through to `fallback`,
 * so we can never 307 a visitor to an unrouted locale (which would 404).
 */
export function resolveLocale({
  acceptLanguage,
  country,
  enabled = ENABLED_LOCALES,
  fallback = defaultLocale,
}: ResolveInput): AppLocale {
  const isEnabled = (value: string): value is AppLocale =>
    (enabled as readonly string[]).includes(value);

  let candidate: AppLocale | null = null;

  // 1. Accept-Language — first ranked tag (exact, then base subtag) that is enabled.
  for (const tag of rankAcceptLanguage(acceptLanguage)) {
    if (isEnabled(tag)) {
      candidate = tag;
      break;
    }
    const base = tag.split('-')[0];
    if (isEnabled(base)) {
      candidate = base;
      break;
    }
  }

  // 2. Country — region tiebreaker, only if it maps to an enabled locale.
  if (!candidate && country) {
    const mapped = COUNTRY_TO_LOCALE[country.toUpperCase()];
    if (mapped && isEnabled(mapped)) candidate = mapped;
  }

  // 3. Final clamp — only ever return an enabled locale.
  return candidate && isEnabled(candidate) ? candidate : fallback;
}

type RedirectInput = ResolveInput & {
  pathname: string;
  isBot: boolean;
  hasCookie: boolean;
};

/**
 * Pure decision for the root seeding redirect (kept separate from proxy.ts so it
 * is unit-testable without Next internals). Returns the enabled locale to 307 to,
 * or `null` when no redirect should happen.
 *
 * Redirect ONLY when ALL hold (SEO_GUIDELINES §9, §14):
 *   • pathname is exactly "/" (the x-default root) — deep URLs never redirect,
 *   • the visitor is NOT a bot — every locale URL stays crawlable,
 *   • there is NO NEXT_LOCALE cookie — the user hasn't already chosen,
 *   • the resolved (enabled) locale differs from the default.
 */
export function shouldRedirect({
  pathname,
  isBot,
  hasCookie,
  acceptLanguage,
  country,
  enabled = ENABLED_LOCALES,
  fallback = defaultLocale,
}: RedirectInput): AppLocale | null {
  if (pathname !== '/' || isBot || hasCookie) return null;
  const locale = resolveLocale({ acceptLanguage, country, enabled, fallback });
  return locale !== fallback ? locale : null;
}

export { ENABLED_LOCALES, defaultLocale };
