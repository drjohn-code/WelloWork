import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy by design — how WelloWork separates employee & manager data",
  description:
    "How WelloWork's architecture enforces that employees own their cognitive and biomarker data while managers see only anonymised, aggregated trends. GDPR-native, EU-resident.",
  path: "/research/privacy-by-design",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Research", href: "/research" },
  { name: "Privacy by design", href: "/research/privacy-by-design" },
];

export default function PrivacyDesignPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Privacy by design at WelloWork",
      url: `${SITE_URL}/research/privacy-by-design`,
      author: { "@type": "Organization", name: "WelloWork" },
      publisher: { "@type": "Organization", name: "WelloWork" },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Privacy by design"
        title={
          <>
            Privacy is the{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              architecture.
            </span>
          </>
        }
        lede="How WelloWork separates employee-private cognitive and biomarker data from the manager-aggregated view — not as a policy promise, but as an architectural decision."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What does privacy by design mean at WelloWork?</strong> The platform's data
            model splits employee-visible records from manager-visible aggregates. Individual
            cognitive results, biomarker reports, and assessment scores are scoped to the
            employee and their account; manager views are computed from aggregates that
            enforce a minimum team size and weekly smoothing. There is no policy override; the
            architecture is what enforces it.
          </>
        }
      >
        <h2>What can an employee see?</h2>
        <ul>
          <li>Every cognitive training session they have completed, with per-domain detail.</li>
          <li>Their own assessment results from WelloWize, including hiring-stage and any internal re-runs.</li>
          <li>Their own biomarker reports, with the option to share them with their physician.</li>
          <li>Their own longitudinal trend across all the above.</li>
          <li>Export and erasure of all of the above on request, under the GDPR.</li>
        </ul>

        <h2>What can a manager see?</h2>
        <ul>
          <li>Anonymised, aggregated team trends — minimum team size enforced.</li>
          <li>Workshop attendance and biomarker participation, aggregated.</li>
          <li>Team-composition recommendations from cognitive profiles, with the underlying values not exposed.</li>
          <li>Sprint-review and on-call-rotation annotations on the team trend.</li>
        </ul>

        <h2>What can a manager not see?</h2>
        <ul>
          <li>Any individual employee's cognitive scores, training sessions, or biomarker values.</li>
          <li>Any aggregate that falls below the minimum team-size threshold.</li>
          <li>Any data the employee has chosen not to share at the team level.</li>
        </ul>

        <h2>Where is data stored?</h2>
        <p>
          All customer and employee data is stored on EU-resident infrastructure. The platform
          is built to be GDPR-native — that means lawful basis, data minimisation, purpose
          limitation, and erasure are first-class concepts in the schema rather than features
          bolted on at the end.
        </p>

        <h2>Why architecture instead of policy?</h2>
        <p>
          Policy-only privacy depends on the people running the system. Architectural privacy
          depends on what the system makes possible to query. The latter is what we ship — so
          even a determined admin cannot pull an individual employee's cognitive score from a
          dashboard query path.
        </p>

        <h2>Compliance posture</h2>
        <p>
          GDPR-native today. ISO 27001 certification is in progress. SOC 2 readiness is on the
          near-term roadmap for customers who require it. See <a href="/legal/privacy">privacy
          policy</a> and <a href="/legal/data-processing">data processing</a> for the legal
          surface.
        </p>
      </ProseSection>

      <CTASection
        title="See the privacy model wired up live."
        body="In the demo we open the same record on the employee side and the manager side, so you can see exactly what each role does — and does not — see."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Privacy policy", href: "/legal/privacy" }}
      />
    </SiteShell>
  );
}
