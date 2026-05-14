import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Proactive Care — biomarker testing for longevity & health | WelloWork",
  description:
    "Blood panels for longevity markers and urine panels for general health and drug screening. Employees see their report; managers only see anonymised, aggregated trends.",
  path: "/platform/proactive-care",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Proactive Care", href: "/platform/proactive-care" },
];

export default function ProactiveCarePage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWork Proactive Care — Biomarker sample testing",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Biomarker testing",
      areaServed: ["EU", "UK", "Nordics"],
      url: `${SITE_URL}/platform/proactive-care`,
      description:
        "Workplace biomarker sample testing for longevity, general health, and drug screening — with strict employee-data ownership.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Proactive Care"
        title={
          <>
            Biomarker testing for longevity, health, and{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              drug screening.
            </span>
          </>
        }
        lede="Blood panels for longevity markers and urine panels for general health and drug screening. Employees see their full report. Managers only see anonymised, aggregated trends."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What is Proactive Care?</strong> Proactive Care is WelloWork's biomarker
            sample-testing service. Pilot engagements run on-site or via partnered labs, with
            blood panels focused on longevity-relevant markers (HbA1c, ApoB, hs-CRP, lipids,
            vitamin D, etc.) and urine panels for general health and substance screening.
            Employees own their report; managers see participation rates and high-level trends
            only.
          </>
        }
      >
        <h2>What does Proactive Care test?</h2>
        <ul>
          <li>
            <strong>Blood (longevity):</strong> a panel oriented around metabolic, inflammatory,
            and cardiovascular markers commonly used in longevity-oriented preventive care.
            Examples include HbA1c, ApoB, lipid sub-fractions, hs-CRP, vitamin D, and a complete
            blood count.
          </li>
          <li>
            <strong>Urine (general health):</strong> standard general-health markers plus, where
            scoped, substance-use screening configured to the customer's policy.
          </li>
        </ul>
        <p>
          Note: WelloWork is not a clinical diagnostic service. Reports identify out-of-range
          markers and recommend follow-up with the employee's own physician. We do not diagnose
          conditions, and we do not provide medical advice.
        </p>

        <h2>Who sees the results?</h2>
        <p>
          The employee is the only person who sees their full biomarker report. Managers and
          HR see aggregated, anonymised trends across a minimum team size — never an
          individual's values. This is a hard architectural rule of the platform, not a policy
          someone can override.
        </p>

        <h2>How is it run logistically?</h2>
        <p>
          Sample collection runs on-site for larger pilots, or via partnered labs near the
          employee. Sample chain-of-custody and lab handling follow the standard practice of the
          accredited lab partner used in that geography. Drug-screening scope is configured per
          customer policy and consented to per-employee before the sample is taken.
        </p>

        <h2>Why testing as part of a performance platform?</h2>
        <p>
          A small number of biomarkers materially bend cognitive performance over time — sleep
          architecture (proxied via metabolic markers), glucose variability, inflammation, and
          basic micronutrient status. Treating biomarker data as part of the same longitudinal
          view as cognitive training and assessments lets employees and their physicians act on
          it, rather than discovering it once a year at a physical.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="What's included"
        title="What does a Proactive Care engagement ship with?"
        items={[
          {
            icon: "drop",
            title: "Longevity blood panel",
            body: "A configurable panel of longevity-relevant markers, drawn on-site or via partnered labs.",
          },
          {
            icon: "flask",
            title: "Urine health & screening",
            body: "General-health markers plus, where scoped, drug screening configured per customer policy.",
          },
          {
            icon: "shield",
            title: "Employee-owned reports",
            body: "Only the employee sees their results. They can share with their physician, export, or request deletion.",
          },
          {
            icon: "users",
            title: "Aggregated manager view",
            body: "Managers see participation rates and anonymised, aggregated trends — never an individual value.",
          },
          {
            icon: "chart",
            title: "Linked to performance trends",
            body: "Where the employee consents, biomarker data is annotated on their own cognitive trend view.",
          },
          {
            icon: "lock",
            title: "Lab-grade chain of custody",
            body: "Sample handling and chain-of-custody follow the accredited lab partner's standard practice in each geography.",
          },
        ]}
      />

      <CTASection
        title="Scope a Proactive Care engagement."
        body="Panels, geographies, and screening scope are confirmed in a scoping call. Pilots typically combine biomarker testing with Workshops in the Platform + Services tier."
        primary={{ label: "Book a scoping call", href: "/book-a-demo" }}
        secondary={{ label: "Talk to sales", href: "/contact" }}
      />
    </SiteShell>
  );
}
