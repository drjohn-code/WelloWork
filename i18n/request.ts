import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

/**
 * Request-scoped i18n config consumed by Server Components. The next-intl plugin
 * (createNextIntlPlugin in next.config.ts) points here by default.
 *
 * Loads ONLY the active locale's messages, so non-active catalogs never reach
 * the client bundle (protects LCP / bundle size — SEO_GUIDELINES §6.1).
 *
 * Missing-key fallback to the default locale is configured here via
 * `onError` / `getMessageFallback`: an enabled locale missing a key renders the
 * English string instead of an empty node (SEO_GUIDELINES §14: never ship bad
 * or empty translations).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  // Default-locale fallback for any key missing in a non-default locale.
  const fallbackMessages =
    locale === routing.defaultLocale
      ? messages
      : (await import(`../messages/${routing.defaultLocale}.json`)).default;

  return {
    locale,
    messages,
    onError(error) {
      // Surface missing keys loudly in dev; stay quiet in production.
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] ${error.code} (${locale}): ${error.message}`);
      }
    },
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter(Boolean).join('.');
      // Walk the default-locale catalog for the requested path.
      const resolved = path
        .split('.')
        .reduce<unknown>(
          (acc, part) =>
            acc && typeof acc === 'object'
              ? (acc as Record<string, unknown>)[part]
              : undefined,
          fallbackMessages
        );
      return typeof resolved === 'string' ? resolved : path;
    },
  };
});
