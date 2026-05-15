import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList, ORG_EMAIL, ORG_LEGAL_NAME } from "../../lib/site";

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
      />

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
        <p>
          We process personal data of the customer's end users (typically the customer's
          employees) for the purpose of delivering the WelloWork platform. Processing lasts
          for the duration of the customer agreement and the retention period specified in the
          DPA.
        </p>

        <h2>Nature and purpose</h2>
        <ul>
          <li>Cognitive training, assessment, and longitudinal performance reporting.</li>
          <li>Workshop scheduling and attendance.</li>
          <li>Biomarker sample reporting (where Proactive Care is in scope).</li>
          <li>Aggregated, anonymised reporting to the customer's authorised admins.</li>
        </ul>

        <h2>Categories of data</h2>
        <ul>
          <li>Identification and contact data (name, work email, role).</li>
          <li>Cognitive performance data (session results, assessment scores).</li>
          <li>Biomarker reports (where Proactive Care is in scope).</li>
          <li>Operational metadata (device, browser, time of access).</li>
        </ul>

        <h2>Categories of data subjects</h2>
        <p>End users of the WelloWork platform — typically employees of the customer.</p>

        <h2>Sub-processors</h2>
        <p>
          We engage a small number of sub-processors for hosting, email, and lab partners. A
          current list is provided to customers under their DPA and updated with notice as
          required. Sub-processors are all bound by GDPR-compliant terms and EU-resident where
          relevant.
        </p>

        <h2>International transfers</h2>
        <p>
          We do not transfer personal data outside the EU/EEA without an appropriate transfer
          mechanism. Where a transfer is required (e.g. operational support tooling), it is
          documented in the DPA.
        </p>

        <h2>Security</h2>
        <p>
          Encryption in transit and at rest, role-based access, audit logging, minimum-team-
          size enforcement on manager-visible aggregates, periodic security review. ISO 27001
          certification is in progress.
        </p>

        <h2>Sub-processor or DPA questions</h2>
        <p>
          Email <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> with "DPA request" in the
          subject and we will route you to the right person.
        </p>
      </ProseSection>
    </SiteShell>
  );
}
