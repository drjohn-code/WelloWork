import type { routing } from '@/i18n/routing';
import type messages from './messages/en.json';

/**
 * Type-safe i18n. next-intl v4 reads `Locale` and `Messages` from the augmented
 * `AppConfig`, so `useTranslations('nav')('items.platform')` is autocompleted
 * and a typo'd key fails the build. Types come from the default (en) catalog —
 * the fully-written source of truth.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
