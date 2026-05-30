import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation wrappers. Import Link / redirect / usePathname /
 * useRouter / getPathname from HERE instead of `next/link` or `next/navigation`
 * so `localePrefix: 'as-needed'` prefixing is applied automatically:
 *   <Link href="/about" />  ->  "/about" (en)  |  "/de/about" (de active)
 * `usePathname()` returns the pathname WITHOUT the locale prefix, so route
 * matching in the header/nav stays locale-agnostic.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
