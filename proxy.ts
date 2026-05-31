import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { geolocation } from '@vercel/functions';
import { isbot } from 'isbot';
import { routing } from './i18n/routing';
import { shouldRedirect } from './i18n/detection';

/*
 * Next.js 16 renamed the `middleware` file convention to `proxy` (this file must
 * be `proxy.ts` at the repo root — `middleware.ts` is deprecated). Node.js runtime.
 *
 * SINGLE redirect authority for locale (next-intl's built-in localeDetection is
 * disabled in routing.ts). SEO-safe rules (SEO_GUIDELINES §9 / §14):
 *   • Bots are NEVER redirected — every locale URL stays crawlable.
 *   • Auto-redirect ONLY at the x-default root ("/"); deep URLs never redirect.
 *   • Default-by-IP: a fresh visitor is routed by their COUNTRY first
 *     (Vercel x-vercel-ip-country), Accept-Language only as a fallback — so a
 *     Lithuanian IP -> /lt even with an English-language browser.
 *   • A returning visitor's NEXT_LOCALE cookie (their toolbar choice) is honored
 *     over geolocation.
 *   • The redirect is personalized -> no-store.
 */

const COOKIE = 'NEXT_LOCALE';
const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isBot = isbot(request.headers.get('user-agent') ?? '');
  const eligible = pathname === '/' && !isBot;

  // geolocation() reads Vercel's x-vercel-ip-country header ({} off-Vercel / local dev).
  const country = eligible ? geolocation(request).country : undefined;
  const cookieLocale = request.cookies.get(COOKIE)?.value;

  const target = shouldRedirect({
    pathname,
    isBot,
    cookieLocale,
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
    response.headers.set('Cache-Control', 'no-store'); // personalized redirect
    // Temporary diagnostic header (safe to remove): detected country + chosen target.
    response.headers.set('x-ww-geo', `country=${country ?? 'none'};target=${target}`);
    return response;
  }

  const response = handleI18nRouting(request);
  if (eligible) response.headers.set('x-ww-geo', `country=${country ?? 'none'};target=none`);
  return response;
}

export const config = {
  // Everything EXCEPT /api, /trpc, Next & Vercel internals, and dotted paths
  // (favicon.ico, robots.txt, sitemap.xml, static assets).
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
