import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { JsonLd } from "../../components/JsonLd";
import {
  PrivacyTrustBar,
  ControllerDiagram,
  DataCollectedGrid,
  LegalBasisStrip,
  EuDataCard,
  RetentionTimeline,
  GdprRightsGrid,
  SecurityStrip,
} from "../../components/LegalVisuals";
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
      >
        <PrivacyTrustBar />
      </PageHero>

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
        <ControllerDiagram />

        <h2>What personal data do we collect?</h2>
        <DataCollectedGrid />

        <h2>What is the legal basis for processing?</h2>
        <LegalBasisStrip />

        <h2>Where is your data stored?</h2>
        <p>
          All personal data is stored on infrastructure resident in the European Union.
          WelloWork does not transfer personal data outside the EU/EEA without an appropriate
          transfer mechanism in place.
        </p>
        <EuDataCard note="No transfers outside the EU/EEA without an appropriate mechanism." />

        <h2>How long do we keep it?</h2>
        <RetentionTimeline />

        <h2>What rights do you have?</h2>
        <p>
          Under the GDPR you can request access, rectification, erasure, restriction,
          portability, and the right to object. You can also lodge a complaint with the Swedish
          data protection authority (IMY).
        </p>
        <GdprRightsGrid />

        <h2>How do we secure data?</h2>
        <p>
          Transport encryption, encryption at rest, role-based access, audit logging, and a
          minimum-team-size threshold for all manager-visible aggregates.
        </p>
        <SecurityStrip />

        <h2>Changes to this policy</h2>
        <p>
          Material changes will be posted here with a revision date. Last revision date: this
          page is dated by its current deploy and will be updated when counsel-reviewed.
        </p>

        <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 12 }}>
          To exercise any right, email{" "}
          <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> with "privacy request" in the subject.
        </p>
      </ProseSection>
    </SiteShell>
  );
}
