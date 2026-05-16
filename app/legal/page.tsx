import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { PageHero } from "../components/PageHero";
import { JsonLd } from "../components/JsonLd";
import { LegalNav } from "../components/LegalNav";
import {
  PrivacyTrustBar,
  ControllerDiagram,
  DataCollectedGrid,
  LegalBasisStrip,
  EuDataCard,
  RetentionTimeline,
  GdprRightsGrid,
  SecurityStrip,
  TermsAnchorStrip,
  EntityCard,
  AcceptableUseSplit,
  IpOwnershipDiagram,
  WarrantyCallout,
  GoverningLawLine,
  CookieTrustBadge,
  CookieTable,
  CookieControlSteps,
  CookieChangesCallout,
  DpaRelationshipDiagram,
  DpaSubjectStrip,
  DpaProcessingSplit,
  SubProcessorCallout,
  DpaContactCta,
} from "../components/LegalVisuals";
import {
  SITE_URL,
  buildMetadata,
  breadcrumbList,
  ORG_EMAIL,
  ORG_LEGAL_NAME,
  ORG_CITY,
  ORG_COUNTRY,
} from "../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Legal — WelloWork",
  description:
    "Privacy policy, terms of service, cookie policy, and data processing summary for WelloWork — Swedish and EU markets, GDPR-native.",
  path: "/legal",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Legal", href: "/legal" },
];

function SectionIcon({ name }: { name: "lock" | "scale" | "cookie" | "stack" }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  const stroke = "var(--primary)";
  switch (name) {
    case "lock":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3v18M5 6h14M6 6l-3 7a3 3 0 006 0L6 6zm12 0l-3 7a3 3 0 006 0l-3-7z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "cookie":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M21 12a9 9 0 11-9-9 5 5 0 005 5 4 4 0 004 4z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="10" r="1" fill={stroke} />
          <circle cx="14" cy="14" r="1" fill={stroke} />
          <circle cx="10" cy="15" r="1" fill={stroke} />
        </svg>
      );
    case "stack":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="4" width="18" height="6" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <circle cx="7" cy="7" r="0.9" fill={stroke} />
          <circle cx="7" cy="17" r="0.9" fill={stroke} />
        </svg>
      );
  }
}

export default function LegalPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Legal",
      url: `${SITE_URL}/legal`,
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Legal"
        title="Legal."
        lede="Privacy policy, terms of service, cookie policy, and a data processing summary — all in one place, governed by Swedish law and the GDPR."
        crumbs={CRUMBS}
      />

      <section className="legal-wrap">
        <div className="container">
          <div className="legal-layout">
            <aside className="legal-sidebar">
              <LegalNav />
            </aside>

            <div className="legal-content">
              {/* Privacy Policy */}
              <article id="privacy" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="lock" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">Section 1</div>
                    <h2 className="legal-section-title">Privacy Policy</h2>
                  </div>
                </header>
                <p className="legal-section-lede">
                  How WelloWork collects, uses, and protects personal data, under the GDPR and
                  Swedish law.
                </p>
                <div className="legal-section-visual">
                  <PrivacyTrustBar />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>What does this privacy policy cover?</strong> It explains what personal
                  data WelloWork collects when you use this website or the WelloWork platform,
                  what we do with it, the legal bases we rely on under the GDPR, your rights, and
                  how to reach us about them.
                </div>

                <div className="prose legal-prose">
                  <h3>Who is the controller of your data?</h3>
                  <p>
                    {ORG_LEGAL_NAME}, registered in Sweden and operating from {ORG_CITY},{" "}
                    {ORG_COUNTRY}, is the controller for personal data collected on this website
                    and through enquiries. For data processed inside the WelloWork platform on
                    behalf of a customer organisation, {ORG_LEGAL_NAME} acts as processor and the
                    customer organisation is the controller — that relationship is governed by a
                    separate Data Processing Agreement.
                  </p>
                  <ControllerDiagram />

                  <h3>What personal data do we collect?</h3>
                  <DataCollectedGrid />

                  <h3>What is the legal basis for processing?</h3>
                  <LegalBasisStrip />

                  <h3>Where is your data stored?</h3>
                  <p>
                    All personal data is stored on infrastructure resident in the European
                    Union. WelloWork does not transfer personal data outside the EU/EEA without
                    an appropriate transfer mechanism in place.
                  </p>
                  <EuDataCard note="No transfers outside the EU/EEA without an appropriate mechanism." />

                  <h3>How long do we keep it?</h3>
                  <RetentionTimeline />

                  <h3>What rights do you have?</h3>
                  <p>
                    Under the GDPR you can request access, rectification, erasure, restriction,
                    portability, and the right to object. You can also lodge a complaint with the
                    Swedish data protection authority (IMY).
                  </p>
                  <GdprRightsGrid />

                  <h3>How do we secure data?</h3>
                  <p>
                    Transport encryption, encryption at rest, role-based access, audit logging,
                    and a minimum-team-size threshold for all manager-visible aggregates.
                  </p>
                  <SecurityStrip />

                  <h3>Changes to this policy</h3>
                  <p>
                    Material changes will be posted here with a revision date. Last revision
                    date: this page is dated by its current deploy and will be updated when
                    counsel-reviewed.
                  </p>

                  <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 12 }}>
                    To exercise any right, email{" "}
                    <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> with "privacy request" in the
                    subject.
                  </p>
                </div>
              </article>

              {/* Terms of Service */}
              <article id="terms" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="scale" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">Section 2</div>
                    <h2 className="legal-section-title">Terms of Service</h2>
                  </div>
                </header>
                <p className="legal-section-lede">
                  The terms under which you use this website and the WelloWork platform. Customer
                  agreements supersede this page where applicable.
                </p>
                <div className="legal-section-visual">
                  <TermsAnchorStrip />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>What do these terms cover?</strong> Acceptable use of the WelloWork
                  website, the legal entity behind the service, intellectual property, warranties
                  and disclaimers, limitation of liability, and the governing law. Where you are
                  a paying customer, the order form and master services agreement take
                  precedence.
                </div>

                <div className="prose legal-prose">
                  <h3 id="entity">Who are you contracting with?</h3>
                  <p>
                    {ORG_LEGAL_NAME}, a Swedish company. These terms govern use of the website
                    at this domain and any demo/trial environments we make available. Use of the
                    production platform under a paid contract is governed by the order form and
                    accompanying agreement.
                  </p>
                  <EntityCard />

                  <h3 id="acceptable-use">What is acceptable use?</h3>
                  <AcceptableUseSplit />

                  <h3 id="ip">What about intellectual property?</h3>
                  <p>
                    All content, branding, source code, design, and other materials on this site
                    are owned by {ORG_LEGAL_NAME} or its licensors. Nothing on the site grants
                    you a licence to those materials except as explicitly stated.
                  </p>
                  <IpOwnershipDiagram />

                  <h3 id="warranties">Warranties and limitations</h3>
                  <p>
                    The website is provided on an "as is" basis. We make no warranty as to
                    availability, fitness for a particular purpose, or accuracy of any
                    third-party information linked from the site. Liability for use of the
                    website is limited to the maximum extent allowed by Swedish and applicable EU
                    law.
                  </p>
                  <WarrantyCallout />

                  <h3 id="law">Governing law</h3>
                  <p>
                    These terms are governed by Swedish law. Disputes arising from the use of
                    this website fall under the exclusive jurisdiction of the Swedish courts
                    unless mandatory law in your jurisdiction provides otherwise.
                  </p>
                  <GoverningLawLine />

                  <h3 id="changes">Changes</h3>
                  <p>
                    We may update these terms over time. Material changes will be posted here
                    with a revision date.
                  </p>
                </div>
              </article>

              {/* Cookie Policy */}
              <article id="cookies" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="cookie" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">Section 3</div>
                    <h2 className="legal-section-title">Cookie Policy</h2>
                  </div>
                </header>
                <p className="legal-section-lede">
                  We default to minimal cookie use in line with the rest of the privacy stance.
                </p>
                <div className="legal-section-visual">
                  <CookieTrustBadge />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>What cookies does the WelloWork website use?</strong> The marketing
                  site uses only essential cookies needed to keep the site working (e.g.
                  preserving form state across reload). Analytics and marketing cookies are not
                  enabled by default; if they ever are, they will be opt-in via a consent banner,
                  and itemised below.
                </div>

                <div className="prose legal-prose">
                  <h3>What is a cookie?</h3>
                  <p>
                    A cookie is a small text file stored on your device by a website. Cookies are
                    used for things like keeping you logged in, remembering preferences, and (in
                    some cases) tracking usage for analytics or advertising.
                  </p>

                  <h3>What cookies are used here?</h3>
                  <CookieTable />

                  <h3>How can you control cookies?</h3>
                  <CookieControlSteps />

                  <h3>Changes</h3>
                  <p>
                    If we add any non-essential cookies, this page will be updated with a
                    revision date and the consent banner will offer an opt-in.
                  </p>
                  <CookieChangesCallout />
                </div>
              </article>

              {/* Data Processing */}
              <article id="data-processing" className="legal-section glass-strong">
                <header className="legal-section-head">
                  <span className="legal-section-icon">
                    <SectionIcon name="stack" />
                  </span>
                  <div>
                    <div className="legal-section-eyebrow">Section 4</div>
                    <h2 className="legal-section-title">Data Processing</h2>
                  </div>
                </header>
                <p className="legal-section-lede">
                  A summary of how WelloWork acts as processor for customer organisations under
                  the GDPR. The executed DPA for a given customer takes precedence.
                </p>
                <div className="legal-section-visual">
                  <DpaRelationshipDiagram />
                </div>

                <div className="answer-block" style={{ maxWidth: "70ch", marginTop: 24 }}>
                  <strong>What is the data processing relationship?</strong> When you use the
                  WelloWork platform as an employee of a customer organisation, your employer is
                  the controller of your data and {ORG_LEGAL_NAME} is the processor acting on
                  documented instructions. The terms of that processing are set out in a Data
                  Processing Agreement (DPA) executed between WelloWork and your employer.
                </div>

                <div className="prose legal-prose">
                  <h3>Subject matter and duration</h3>
                  <DpaSubjectStrip />

                  <h3>Nature, purpose, and categories of data</h3>
                  <p>
                    We process personal data of the customer's end users to deliver the
                    WelloWork platform and produce aggregated, anonymised reporting to authorised
                    admins.
                  </p>
                  <DpaProcessingSplit />

                  <h3>Categories of data subjects</h3>
                  <p>End users of the WelloWork platform — typically employees of the customer.</p>

                  <h3>Sub-processors</h3>
                  <SubProcessorCallout />

                  <h3>International transfers</h3>
                  <p>
                    We do not transfer personal data outside the EU/EEA without an appropriate
                    transfer mechanism. Where a transfer is required (e.g. operational support
                    tooling), it is documented in the DPA.
                  </p>
                  <EuDataCard
                    label="No transfers outside the EU/EEA"
                    note="Without an appropriate transfer mechanism in place."
                  />

                  <h3>Security</h3>
                  <p>
                    Encryption in transit and at rest, role-based access, audit logging,
                    minimum-team-size enforcement on manager-visible aggregates, periodic
                    security review.
                  </p>
                  <SecurityStrip />

                  <h3>Sub-processor or DPA questions</h3>
                  <DpaContactCta />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
