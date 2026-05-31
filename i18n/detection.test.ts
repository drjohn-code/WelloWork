import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocale, shouldRedirect } from './detection';

// Tests inject `enabled`/`fallback` where they assert config-independent logic,
// and omit them (using the live PUBLISHED_LOCALES) where they assert the shipped
// behavior. The live config currently enables: en, sv, nl, de, fr, es, it, lt.

const EN_DE = ['en', 'de'] as const;
const EN_ONLY = ['en'] as const;

test('(a) country (IP) is the PRIMARY signal; Accept-Language is the fallback', () => {
  // Country maps to an enabled locale -> used directly.
  assert.equal(resolveLocale({ country: 'DE', enabled: EN_DE, fallback: 'en' }), 'de');
  // THE FIX: a Lithuanian IP with an English-language browser still gets Lithuanian.
  assert.equal(
    resolveLocale({ country: 'LT', acceptLanguage: 'en-US,en;q=0.9', enabled: ['en', 'lt'], fallback: 'en' }),
    'lt'
  );
  // No country -> Accept-Language fallback (highest q-value first).
  assert.equal(resolveLocale({ acceptLanguage: 'en;q=0.3, de;q=0.9', enabled: EN_DE, fallback: 'en' }), 'de');
  assert.equal(resolveLocale({ acceptLanguage: 'de-AT,de;q=0.9,en;q=0.5', enabled: EN_DE, fallback: 'en' }), 'de');
  // Country resolves to default -> default.
  assert.equal(resolveLocale({ country: 'US', acceptLanguage: 'en-US,en', enabled: EN_DE, fallback: 'en' }), 'en');
});

test('(b) a DISABLED locale (country or Accept-Language) clamps to the default', () => {
  // Country maps to a disabled locale -> default (never a 404 target).
  assert.equal(resolveLocale({ country: 'DE', enabled: EN_ONLY, fallback: 'en' }), 'en');
  assert.equal(resolveLocale({ country: 'FR', acceptLanguage: 'fr', enabled: EN_ONLY, fallback: 'en' }), 'en');
  // Accept-Language disabled -> default.
  assert.equal(resolveLocale({ acceptLanguage: 'de-DE,de;q=0.9', enabled: EN_ONLY, fallback: 'en' }), 'en');
  // Unknown country + unknown language -> default.
  assert.equal(resolveLocale({ country: 'ZZ', acceptLanguage: 'xx', enabled: EN_ONLY, fallback: 'en' }), 'en');
  // GUARANTEE against the LIVE config: a country mapping to a DISABLED locale (PT
  // -> pt, not enabled) clamps to default; ENABLED ones resolve normally.
  assert.equal(resolveLocale({ country: 'PT', acceptLanguage: 'pt' }), 'en');
  assert.equal(resolveLocale({ country: 'DE' }), 'de'); // German IP
  assert.equal(resolveLocale({ country: 'SE' }), 'sv'); // Swedish IP
  assert.equal(resolveLocale({ country: 'LT' }), 'lt'); // Lithuanian IP
  assert.equal(resolveLocale({ country: 'NL' }), 'nl'); // Dutch IP
});

test('(c) bots & deep URLs never redirect; the cookie (toolbar choice) is honored', () => {
  const geo = { acceptLanguage: 'de', country: 'DE', enabled: EN_DE, fallback: 'en' } as const;
  // Bot at root -> never redirected (every locale URL stays crawlable).
  assert.equal(shouldRedirect({ pathname: '/', isBot: true, ...geo }), null);
  // Deep URLs -> never redirected.
  assert.equal(shouldRedirect({ pathname: '/about', isBot: false, ...geo }), null);
  assert.equal(shouldRedirect({ pathname: '/platform/growth', isBot: false, ...geo }), null);
  // Returning visitor: the NEXT_LOCALE cookie (explicit toolbar choice) wins over geo.
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, cookieLocale: 'de', country: 'SE', enabled: EN_DE, fallback: 'en' }),
    'de'
  );
  // Cookie == default -> stay on the prefix-free default (no redirect).
  assert.equal(shouldRedirect({ pathname: '/', isBot: false, cookieLocale: 'en', enabled: EN_DE, fallback: 'en' }), null);
  // A disabled cookie value is ignored -> falls through to geo (DE -> de).
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, cookieLocale: 'pt', country: 'DE', enabled: EN_DE, fallback: 'en' }),
    'de'
  );
});

test('(d) fresh visitor: root redirect by IP, ahead of Accept-Language', () => {
  // Swedish IP + English browser -> /sv (IP wins). The reported behavior.
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, country: 'SE', acceptLanguage: 'en-US,en', enabled: ['en', 'sv'], fallback: 'en' }),
    'sv'
  );
  // Lithuanian IP + English browser -> /lt.
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, country: 'LT', acceptLanguage: 'en-US,en', enabled: ['en', 'lt'], fallback: 'en' }),
    'lt'
  );
  // No country (local dev) -> Accept-Language fallback.
  assert.equal(shouldRedirect({ pathname: '/', isBot: false, acceptLanguage: 'de', enabled: EN_DE, fallback: 'en' }), 'de');
  // Resolves to default -> no redirect.
  assert.equal(
    shouldRedirect({ pathname: '/', isBot: false, country: 'US', acceptLanguage: 'en', enabled: EN_DE, fallback: 'en' }),
    null
  );
});
