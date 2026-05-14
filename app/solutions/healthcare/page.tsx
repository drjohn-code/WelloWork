import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "WelloWork for healthcare organisations — workforce performance & wellbeing",
  description:
    "How healthcare organisations use WelloWork for shift-aware cognitive performance, workshop-based recovery, and biomarker testing — without conflating it with clinical care.",
  path: "/solutions/healthcare",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Healthcare", href: "/solutions/healthcare" },
];

export default function HealthcarePage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "WelloWork for Healthcare",
      url: `${SITE_URL}/solutions/healthcare`,
      audience: { "@type": "BusinessAudience", audienceType: "Healthcare organisations" },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="For healthcare organisations"
        title={
          <>
            Workforce performance for{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              healthcare teams.
            </span>
          </>
        }
        lede="Healthcare organisations face the toughest shift patterns and the strictest privacy constraints. WelloWork is a workforce-performance platform — not a clinical tool — built for both."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What does WelloWork do for healthcare organisations?</strong> It runs
            daily cognitive training, aggregated team trends, on-site workshops, and
            biomarker sample testing for the healthcare workforce. It is explicitly a
            workforce-performance platform, not a clinical or diagnostic system; it does not
            replace any clinical record, and it does not exchange data with patient records.
          </>
        }
      >
        <h2>What is — and is not — in scope</h2>
        <ul>
          <li>
            <strong>In scope:</strong> daily cognitive training and assessment for clinical and
            non-clinical staff, aggregated team performance trends, biomarker sample testing
            for staff (as an HR/wellbeing benefit), and live workshops.
          </li>
          <li>
            <strong>Not in scope:</strong> patient care, patient records, clinical decision
            support, diagnosis or treatment. WelloWork does not connect to EHR/EMR systems.
          </li>
        </ul>

        <h2>Why shift-aware matters in healthcare</h2>
        <p>
          Few sectors have rotation patterns as demanding as healthcare. Aggregated
          processing-speed and sustained-attention trends, read against shift calendars,
          surface where rotation patterns are bending team-level performance — and where a
          workshop or schedule change might be worth piloting.
        </p>

        <h2>Privacy for clinical staff</h2>
        <p>
          The privacy model is identical to the rest of the platform: individual cognitive
          training, assessment, and biomarker results stay with the employee. Aggregated team
          views enforce minimum team size. No data leaves the EU residency boundary.
        </p>

        <h2>Compliance</h2>
        <p>
          GDPR-native today, ISO 27001 in progress. We work with hospital procurement and
          compliance teams to fit local data-protection requirements and any union or works-
          council requirements that apply to staff data.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="Use cases"
        title="What healthcare teams build on top"
        items={[
          {
            icon: "users",
            title: "Shift-aware performance trends",
            body: "Aggregated cognitive trends read against shift rotation and on-call patterns.",
          },
          {
            icon: "drop",
            title: "Staff biomarker testing",
            body: "Optional longevity blood and general health urine panels for staff, scoped per engagement.",
          },
          {
            icon: "calendar",
            title: "Recovery workshops",
            body: "Sleep, recovery, nutrition, and focus workshops scheduled at the cadence shift-based teams can actually attend.",
          },
          {
            icon: "shield",
            title: "Strict privacy posture",
            body: "Employee-private records, manager-aggregated views, minimum team size enforced, EU-resident data.",
          },
          {
            icon: "scale",
            title: "Compliance-aware roll-out",
            body: "Designed to fit hospital procurement and works-council requirements where they apply.",
          },
          {
            icon: "lock",
            title: "No EHR integration",
            body: "WelloWork is explicitly not a clinical system. It does not exchange data with patient records.",
          },
        ]}
      />

      <CTASection
        title="Scope a healthcare pilot."
        body="Bring your shift patterns and any compliance constraints — we'll walk through pilot scope, privacy, and the workforce/biomarker mix in one call."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Talk to sales", href: "/contact" }}
      />
    </SiteShell>
  );
}
