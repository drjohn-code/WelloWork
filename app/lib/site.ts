import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://wellowork.net";

export const SITE_NAME = "WelloWork";
export const SITE_TAGLINE = "The workplace performance platform";
export const ORG_LEGAL_NAME = "WelloWork AB";
export const ORG_CITY = "Uppsala";
export const ORG_COUNTRY = "Sweden";
export const ORG_EMAIL = "info@wellowork.net";
export const ORG_PHONE = "+46 760 28 1272";
export const ORG_PHONE_TEL = "+46760281272";
export const ORG_FOUNDED = "2024";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
};

export function buildMetadata({ title, description, path, ogType = "website" }: MetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export type Crumb = { name: string; href: string };

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.href}`,
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
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
    sameAs: [],
  };
}
