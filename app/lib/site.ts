import type { Metadata } from "next";
import {
  ENABLED_LOCALES,
  defaultLocale,
  getLocaleMeta,
  LOCALES,
  type AppLocale,
} from "@/i18n/locales";

// Canonical base for ALL absolute SEO URLs (canonical, hreflang, og:url, sitemap,
// robots host, JSON-LD). Must match the serving host: Vercel's primary domain is
// www.wellowork.net (apex wellowork.net 307-redirects to it), so the fallback is
// www to avoid emitting canonicals that resolve through a redirect.
// `NEXT_PUBLIC_SITE_URL` (set in Vercel) overrides this and should also be www.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.wellowork.net";

// Brand entity — identical across every locale (SEO_GUIDELINES §2.1). Never
// translate SITE_NAME / ORG_LEGAL_NAME or interpolate them into translatable
// message strings.
export const SITE_NAME = "WelloWork";
export const SITE_TAGLINE = "The workplace performance platform";
export const ORG_LEGAL_NAME = "WelloWork AB";
export const ORG_CITY = "Uppsala";
export const ORG_COUNTRY = "Sweden";
export const ORG_EMAIL = "info@wellowork.net";
export const ORG_PHONE = "+46 760 28 1272";
export const ORG_PHONE_TEL = "+46760281272";
export const ORG_FOUNDED = "2024";

/* ────────────────────────────────────────────────────────────────────────
 * Locale-aware URL helpers (SEO_GUIDELINES §9 international SEO, §6.3 canonical)
 *
 * localePrefix is 'as-needed': the default locale (en) has NO prefix; other
 * enabled locales are prefixed (/de/...). A leading "#hash" on a path (e.g. the
 * "/#platform" breadcrumb anchor) is preserved and only the path part is
 * localized.
 * ──────────────────────────────────────────────────────────────────────── */

function splitHash(path: string): [string, string] {
  const i = path.indexOf("#");
  return i === -1 ? [path, ""] : [path.slice(0, i), path.slice(i)];
}

/** Locale-prefixed pathname (relative). "/" + default -> "" (bare origin). */
export function localizedPath(path: string, locale: AppLocale = defaultLocale): string {
  const [p, hash] = splitHash(path);
  const clean = p === "/" ? "" : p;
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${prefix}${clean}${hash}`;
}

/** Absolute, locale-prefixed, self-canonical URL for a path. */
export function localizedUrl(path: string, locale: AppLocale = defaultLocale): string {
  return `${SITE_URL}${localizedPath(path, locale)}`;
}

/** BCP-47 tag for hreflang / JSON-LD inLanguage. */
export function inLanguage(locale: AppLocale = defaultLocale): string {
  return getLocaleMeta(locale).hreflang;
}

/**
 * hreflang alternates for a path — ONLY enabled locales, plus x-default -> the
 * default locale. Disabled locales never appear (SEO_GUIDELINES §6 config-driven,
 * §9 hreflang coverage). Returned shape matches Next's Metadata.alternates.languages.
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const code of ENABLED_LOCALES) {
    languages[LOCALES[code].hreflang] = localizedUrl(path, code);
  }
  languages["x-default"] = localizedUrl(path, defaultLocale);
  return languages;
}

type MetaInput = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  /** Defaults to the default locale, so legacy `buildMetadata({...})` calls keep
   *  working. Pass the request locale (from params) for per-locale correctness. */
  locale?: AppLocale;
};

export function buildMetadata({
  title,
  description,
  path,
  ogType = "website",
  locale = defaultLocale,
}: MetaInput): Metadata {
  const canonical = localizedUrl(path, locale);
  const meta = getLocaleMeta(locale);
  const alternateLocale = ENABLED_LOCALES.filter((c) => c !== locale).map(
    (c) => LOCALES[c].ogLocale
  );

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      // Self-referencing canonical per locale (SEO_GUIDELINES §6.3).
      canonical,
      // Full hreflang coverage for enabled locales + x-default (§9).
      languages: languageAlternates(path),
    },
    openGraph: {
      type: ogType,
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      locale: meta.ogLocale,
      ...(alternateLocale.length ? { alternateLocale } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export type Crumb = { name: string; href: string };

export function breadcrumbList(crumbs: Crumb[], locale: AppLocale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: inLanguage(locale),
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localizedUrl(c.href, locale),
    })),
  };
}

export function organizationSchema(locale: AppLocale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    // Stable, locale-neutral @id — one canonical Organization referenced by all
    // pages (do not fork per locale). SEO_GUIDELINES §2.1, §7.
    "@id": `${SITE_URL}#org`,
    name: SITE_NAME,
    legalName: ORG_LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    foundingDate: ORG_FOUNDED,
    email: ORG_EMAIL,
    telephone: ORG_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: ORG_CITY,
      addressCountry: ORG_COUNTRY,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: ORG_EMAIL,
        telephone: ORG_PHONE,
        areaServed: "EU",
        availableLanguage: ["English", "Swedish"],
      },
    ],
    inLanguage: inLanguage(locale),
    sameAs: [],
  };
}
