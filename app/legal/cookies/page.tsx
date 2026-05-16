import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { JsonLd } from "../../components/JsonLd";
import {
  CookieTrustBadge,
  CookieTable,
  CookieControlSteps,
  CookieChangesCallout,
} from "../../components/LegalVisuals";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Cookie policy — WelloWork",
  description:
    "Which cookies WelloWork uses, why, and how to control them. We default to minimal cookie use in line with our privacy-first stance.",
  path: "/legal/cookies",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Legal", href: "/legal/cookies" },
  { name: "Cookie policy", href: "/legal/cookies" },
];

export default function CookiePage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Cookie policy",
      url: `${SITE_URL}/legal/cookies`,
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Legal"
        title="Cookie policy."
        lede="We default to minimal cookie use in line with the rest of the privacy stance."
        crumbs={CRUMBS}
      >
        <CookieTrustBadge />
      </PageHero>

      <ProseSection
        answer={
          <>
            <strong>What cookies does the WelloWork website use?</strong> The marketing site
            uses only essential cookies needed to keep the site working (e.g. preserving form
            state across reload). Analytics and marketing cookies are not enabled by default;
            if they ever are, they will be opt-in via a consent banner, and itemised below.
          </>
        }
      >
        <h2>What is a cookie?</h2>
        <p>
          A cookie is a small text file stored on your device by a website. Cookies are used
          for things like keeping you logged in, remembering preferences, and (in some cases)
          tracking usage for analytics or advertising.
        </p>

        <h2>What cookies are used here?</h2>
        <CookieTable />

        <h2>How can you control cookies?</h2>
        <CookieControlSteps />

        <h2>Changes</h2>
        <p>
          If we add any non-essential cookies, this page will be updated with a revision date
          and the consent banner will offer an opt-in.
        </p>
        <CookieChangesCallout />
      </ProseSection>
    </SiteShell>
  );
}
