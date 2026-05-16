import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { JsonLd } from "../../components/JsonLd";
import {
  DpaRelationshipDiagram,
  DpaSubjectStrip,
  DpaProcessingSplit,
  SubProcessorCallout,
  EuDataCard,
  SecurityStrip,
  DpaContactCta,
} from "../../components/LegalVisuals";
import { SITE_URL, buildMetadata, breadcrumbList, ORG_LEGAL_NAME } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Data processing — WelloWork",
  description:
    "How WelloWork processes personal data on behalf of customer organisations under the GDPR.",
  path: "/legal/data-processing",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Legal", href: "/legal/data-processing" },
  { name: "Data processing", href: "/legal/data-processing" },
];

export default function DataProcessingPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Data processing",
      url: `${SITE_URL}/legal/data-processing`,
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Legal"
        title="Data processing."
        lede="A summary of how WelloWork acts as processor for customer organisations under the GDPR. The executed DPA for a given customer takes precedence."
        crumbs={CRUMBS}
      >
        <DpaRelationshipDiagram />
      </PageHero>

      <ProseSection
        answer={
          <>
            <strong>What is the data processing relationship?</strong> When you use the
            WelloWork platform as an employee of a customer organisation, your employer is the
            controller of your data and {ORG_LEGAL_NAME} is the processor acting on documented
            instructions. The terms of that processing are set out in a Data Processing
            Agreement (DPA) executed between WelloWork and your employer.
          </>
        }
      >
        <h2>Subject matter and duration</h2>
        <DpaSubjectStrip />

        <h2>Nature, purpose, and categories of data</h2>
        <p>
          We process personal data of the customer's end users to deliver the WelloWork
          platform and produce aggregated, anonymised reporting to authorised admins.
        </p>
        <DpaProcessingSplit />

        <h2>Categories of data subjects</h2>
        <p>End users of the WelloWork platform — typically employees of the customer.</p>

        <h2>Sub-processors</h2>
        <SubProcessorCallout />

        <h2>International transfers</h2>
        <p>
          We do not transfer personal data outside the EU/EEA without an appropriate transfer
          mechanism. Where a transfer is required (e.g. operational support tooling), it is
          documented in the DPA.
        </p>
        <EuDataCard
          label="No transfers outside the EU/EEA"
          note="Without an appropriate transfer mechanism in place."
        />

        <h2>Security</h2>
        <p>
          Encryption in transit and at rest, role-based access, audit logging, minimum-team-
          size enforcement on manager-visible aggregates, periodic security review.
        </p>
        <SecurityStrip />

        <h2>Sub-processor or DPA questions</h2>
        <DpaContactCta />
      </ProseSection>
    </SiteShell>
  );
}
