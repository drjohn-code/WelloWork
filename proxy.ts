import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { geolocation } from '@vercel/functions';
import { isbot } from 'isbot';
import { routing } from './i18n/routing';
import { shouldRedirect } from './i18n/detection';

/*
 * Next.js 16 renamed the `middleware` file convention to `proxy` (this file must
 * be `proxy.ts` at the repo root — `middleware.ts` is deprecated). It runs on the
 * Node.js runtime.
 *
 * This is the SINGLE redirect authority for locale (next-intl's built-in
 * localeDetection is disabled in routing.ts). It implements the SEO-safe rules
 * from SEO_GUIDELINES §9 / §14:
 *
 *   • Bots are NEVER redirected — every locale URL stays directly crawlable and
 *     indexable (Googlebot crawls from US IPs).
 *   • Auto-redirect happens ONLY at the x-default root ("/"), ONLY for non-bots,
 *     ONLY when no NEXT_LOCALE cookie is set. Deep URLs (/about, /platform/...)
 *     are never auto-redirected — a visitor who lands on a specific URL stays.
 *   • The redirect is personalized, so it is marked no-store.
 */

const COOKIE = 'NEXT_LOCALE';
const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isBot = isbot(request.headers.get('user-agent') ?? '');
  const hasCookie = request.cookies.has(COOKIE);

  // Only read geolocation when a redirect is even possible (root, non-bot,
  // no cookie). geolocation() returns {} off-Vercel (e.g. local dev).
  const eligible = pathname === '/' && !isBot && !hasCookie;
  const country = eligible ? geolocation(request).country : undefined;

  const target = shouldRedirect({
    pathname,
    isBot,
    hasCookie,
    acceptLanguage: request.headers.get('accept-language'),
    country,
  });

  if (target) {
    const response = NextResponse.redirect(new URL(`/${target}`, request.url), 307);
    response.cookies.set(COOKIE, target, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    // Personalized redirect — do not cache.
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  return handleI18nRouting(request);
}

export const config = {
  // Run on everything EXCEPT /api, /trpc, Next & Vercel internals, and any path
  // containing a dot (favicon.ico, robots.txt, sitemap.xml, static assets).
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
