import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { JsonLd } from "../../components/JsonLd";
import {
  TermsAnchorStrip,
  EntityCard,
  AcceptableUseSplit,
  IpOwnershipDiagram,
  WarrantyCallout,
  GoverningLawLine,
} from "../../components/LegalVisuals";
import { SITE_URL, buildMetadata, breadcrumbList, ORG_LEGAL_NAME } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of service — WelloWork",
  description:
    "Terms of service for the WelloWork website and platform — Sweden and the EU.",
  path: "/legal/terms",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Legal", href: "/legal/terms" },
  { name: "Terms of service", href: "/legal/terms" },
];

export default function TermsPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms of service",
      url: `${SITE_URL}/legal/terms`,
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Legal"
        title="Terms of service."
        lede="The terms under which you use this website and the WelloWork platform. Customer agreements supersede this page where applicable."
        crumbs={CRUMBS}
      >
        <TermsAnchorStrip />
      </PageHero>

      <ProseSection
        answer={
          <>
            <strong>What do these terms cover?</strong> Acceptable use of the WelloWork
            website, the legal entity behind the service, intellectual property, warranties
            and disclaimers, limitation of liability, and the governing law. Where you are a
            paying customer, the order form and master services agreement take precedence.
          </>
        }
      >
        <h2 id="entity">Who are you contracting with?</h2>
        <p>
          {ORG_LEGAL_NAME}, a Swedish company. These terms govern use of the website at this
          domain and any demo/trial environments we make available. Use of the production
          platform under a paid contract is governed by the order form and accompanying
          agreement.
        </p>
        <EntityCard />

        <h2 id="acceptable-use">What is acceptable use?</h2>
        <AcceptableUseSplit />

        <h2 id="ip">What about intellectual property?</h2>
        <p>
          All content, branding, source code, design, and other materials on this site are
          owned by {ORG_LEGAL_NAME} or its licensors. Nothing on the site grants you a licence
          to those materials except as explicitly stated.
        </p>
        <IpOwnershipDiagram />

        <h2 id="warranties">Warranties and limitations</h2>
        <p>
          The website is provided on an "as is" basis. We make no warranty as to availability,
          fitness for a particular purpose, or accuracy of any third-party information linked
          from the site. Liability for use of the website is limited to the maximum extent
          allowed by Swedish and applicable EU law.
        </p>
        <WarrantyCallout />

        <h2 id="law">Governing law</h2>
        <p>
          These terms are governed by Swedish law. Disputes arising from the use of this
          website fall under the exclusive jurisdiction of the Swedish courts unless mandatory
          law in your jurisdiction provides otherwise.
        </p>
        <GoverningLawLine />

        <h2 id="changes">Changes</h2>
        <p>
          We may update these terms over time. Material changes will be posted here with a
          revision date.
        </p>
      </ProseSection>
    </SiteShell>
  );
}
