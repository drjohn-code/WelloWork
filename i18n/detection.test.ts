import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocale, shouldRedirect } from './detection';

// These tests inject `enabled`/`fallback` so they don't depend on the live
// ENABLED_LOCALES (which is en-only in production). They prove the guarantees
// that protect SEO: never resolve/redirect to a locale that isn't enabled.

const EN_DE = ['en', 'de'] as const; // a hypothetical 2-locale launch
const EN_ONLY = ['en'] as const; // the real production config

test('(a) an enabled locale resolves normally', () => {
  // Accept-Language exact + base-subtag match.
  assert.equal(resolveLocale({ acceptLanguage: 'de', enabled: EN_DE, fallback: 'en' }), 'de');
  assert.equal(
    resolveLocale({ acceptLanguage: 'de-AT,de;q=0.9,en;q=0.5', enabled: EN_DE, fallback: 'en' }),
    'de'
  );
  // Highest q-value wins even when listed later.
  assert.equal(
    resolveLocale({ acceptLanguage: 'en;q=0.3, de;q=0.9', enabled: EN_DE, fallback: 'en' }),
    'de'
  );
  // Country maps to an enabled locale when there's no language signal.
  assert.equal(resolveLocale({ country: 'DE', enabled: EN_DE, fallback: 'en' }), 'de');
  // The default itself resolves to the default.
  assert.equal(resolveLocale({ acceptLanguage: 'en-US,en', enabled: EN_DE, fallback: 'en' }), 'en');
});

test('(b) a DISABLED locale (via Accept-Language or country) clamps to default', () => {
  // Accept-Language asks for German, but only English is enabled -> default.
  assert.equal(resolveLocale({ acceptLanguage: 'de-DE,de;q=0.9', enabled: EN_ONLY, fallback: 'en' }), 'en');
  // Country maps to a disabled locale -> default (never a 404 target).
  assert.equal(resolveLocale({ country: 'DE', enabled: EN_ONLY, fallback: 'en' }), 'en');
  assert.equal(resolveLocale({ country: 'FR', acceptLanguage: 'fr', enabled: EN_ONLY, fallback: 'en' }), 'en');
  // Unknown country + unknown language -> default.
  assert.equal(resolveLocale({ country: 'ZZ', acceptLanguage: 'xx', enabled: EN_ONLY, fallback: 'en' }), 'en');
  // Mixed: first choice disabled, second choice enabled -> the enabled one.
  assert.equal(
    resolveLocale({ acceptLanguage: 'de;q=0.9, en;q=0.8', enabled: EN_ONLY, fallback: 'en' }),
    'en'
  );
  // GUARANTEE (against the LIVE config): a DISABLED locale (pt is not in
  // PUBLISHED_LOCALES) is clamped to the default, never returned.
  assert.equal(resolveLocale({ acceptLanguage: 'pt', country: 'PT' }), 'en');
  // ENABLED locales in the live config resolve normally.
  assert.equal(resolveLocale({ acceptLanguage: 'de', country: 'DE' }), 'de');
  assert.equal(resolveLocale({ country: 'SE' }), 'sv'); // Swedish IP -> sv
});

test('(c) bot-skip, cookie, and deep-URL paths never redirect', () => {
  const base = { acceptLanguage: 'de', country: 'DE', enabled: EN_DE, fallback: 'en' } as const;

  // Bot at the root -> no redirect (every locale URL stays crawlable).
  assert.equal(shouldRedirect({ pathname: '/', isBot: true, hasCookie: false, ...base }), null);
  // Existing cookie -> no redirect (the user already chose).
  assert.equal(shouldRedirect({ pathname: '/', isBot: false, hasCookie: true, ...base }), null);
  // Deep URL -> no redirect even for a fresh non-bot visitor.
  assert.equal(shouldRedirect({ pathname: '/about', isBot: false, hasCookie: false, ...base }), null);
  assert.equal(
    shouldRedirect({ pathname: '/platform/growth', isBot: false, hasCookie: false, ...base }),
    null
  );
});

test('redirect fires only at the root for a fresh non-bot whose locale != default', () => {
  // Fresh non-bot, German preference, German enabled -> 307 to /de.
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, hasCookie: false, acceptLanguage: 'de', enabled: EN_DE, fallback: 'en' }),
    'de'
  );
  // Resolved == default -> no redirect (already on the prefix-free default).
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, hasCookie: false, acceptLanguage: 'en', enabled: EN_DE, fallback: 'en' }),
    null
  );
  // Live config: a DISABLED locale (pt) clamps to en -> NEVER redirected to an
  // unrouted /pt. The core SEO/crawlability guarantee.
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, hasCookie: false, acceptLanguage: 'pt', country: 'PT' }),
    null
  );
  // Live config: a Swedish visitor (IP) -> 307 to /sv (sv is published). This is
  // the IP-based default-language requirement.
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, hasCookie: false, country: 'SE' }),
    'sv'
  );
});
