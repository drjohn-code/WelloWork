import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList, ORG_EMAIL, ORG_LEGAL_NAME, ORG_CITY, ORG_COUNTRY } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy — WelloWork",
  description:
    "How WelloWork collects, uses, and protects personal data under the GDPR, for the Swedish and EU markets.",
  path: "/legal/privacy",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Legal", href: "/legal/privacy" },
  { name: "Privacy policy", href: "/legal/privacy" },
];

export default function PrivacyPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy policy",
      url: `${SITE_URL}/legal/privacy`,
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Legal"
        title="Privacy policy."
        lede="How WelloWork collects, uses, and protects personal data, under the GDPR and Swedish law."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What does this privacy policy cover?</strong> It explains what personal
            data WelloWork collects when you use this website or the WelloWork platform, what
            we do with it, the legal bases we rely on under the GDPR, your rights, and how to
            reach us about them.
          </>
        }
      >
        <h2>Who is the controller of your data?</h2>
        <p>
          {ORG_LEGAL_NAME}, registered in Sweden and operating from {ORG_CITY}, {ORG_COUNTRY},
          is the controller for personal data collected on this website and through enquiries.
          For data processed inside the WelloWork platform on behalf of a customer organisation,
          {" "}{ORG_LEGAL_NAME} acts as processor and the customer organisation is the
          controller — that relationship is governed by a separate Data Processing Agreement.
        </p>

        <h2>What personal data do we collect?</h2>
        <ul>
          <li>
            Contact data you provide via forms on this site (name, work email, company, role,
            industry, optional message).
          </li>
          <li>
            Limited technical data (IP address, user-agent string) at the moment a form is
            submitted, used for spam control and security.
          </li>
          <li>
            Operational data from the platform (training session results, assessment results,
            biomarker reports) — only where you are an end user of the WelloWork platform; that
            data is processed under the customer organisation's DPA.
          </li>
        </ul>

        <h2>What is the legal basis for processing?</h2>
        <ul>
          <li>
            <strong>Consent</strong> for marketing follow-up after a demo or contact request.
            You can withdraw at any time.
          </li>
          <li>
            <strong>Legitimate interests</strong> for responding to enquiries, basic security
            logging, and protecting our service from abuse.
          </li>
          <li>
            <strong>Contract</strong> where you are an end user of the WelloWork platform and
            we process your data to deliver the contracted service to your employer.
          </li>
          <li>
            <strong>Legal obligation</strong> for retention periods imposed by Swedish or EU
            law (e.g. tax records for invoiced customers).
          </li>
        </ul>

        <h2>Where is your data stored?</h2>
        <p>
          All personal data is stored on infrastructure resident in the European Union.
          WelloWork does not transfer personal data outside the EU/EEA without an appropriate
          transfer mechanism in place.
        </p>

        <h2>How long do we keep it?</h2>
        <ul>
          <li>Enquiry forms: up to 24 months unless you ask us to delete sooner.</li>
          <li>Platform records (as processor): per the customer's DPA and retention configuration.</li>
          <li>Backups: routine retention for up to 90 days.</li>
        </ul>

        <h2>What rights do you have?</h2>
        <p>
          Under the GDPR you can request access, rectification, erasure, restriction,
          portability, and the right to object. You can also lodge a complaint with the Swedish
          data protection authority (IMY). To exercise any right, email{" "}
          <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> with "privacy request" in the subject.
        </p>

        <h2>How do we secure data?</h2>
        <p>
          Transport encryption, encryption at rest, role-based access, audit logging, and a
          minimum-team-size threshold for all manager-visible aggregates. ISO 27001
          certification is in progress.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          Material changes will be posted here with a revision date. Last revision date: this
          page is dated by its current deploy and will be updated when counsel-reviewed.
        </p>
      </ProseSection>
    </SiteShell>
  );
}
