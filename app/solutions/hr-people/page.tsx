import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "WelloWork for HR & People leaders — performance, not just engagement",
  description:
    "How HR and People leaders use WelloWork to see burnout signals before exits, defend wellness ROI, and run promotion-readiness on trend rather than annual reviews.",
  path: "/solutions/hr-people",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/#solutions" },
  { name: "HR & People", href: "/solutions/hr-people" },
];

export default function HRPeoplePage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "WelloWork for HR & People",
      url: `${SITE_URL}/solutions/hr-people`,
      audience: { "@type": "BusinessAudience", audienceType: "HR and People leaders" },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="For HR & People leaders"
        title={
          <>
            See burnout signals before they become{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              exits.
            </span>
          </>
        }
        lede="Engagement scores tell you how people feel. WelloWork shows you how performance is changing — which is what actually predicts attrition."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>How does WelloWork help HR & People leaders?</strong> It adds a
            longitudinal performance signal alongside your existing engagement and pulse data,
            with an architecture that protects individual employees. HR sees aggregated trend
            deltas across teams, defensible wellness ROI rooted in performance data, and a
            promotion-readiness signal that doesn't depend on annual reviews.
          </>
        }
      >
        <h2>Why pair performance with engagement?</h2>
        <p>
          Engagement and pulse surveys answer the question "how do people feel?" They are
          essential and they don't go away here. What they don't answer is "how is performance
          actually changing under the hood?" — and that's the question HR is increasingly being
          asked to weigh in on, especially around burnout and retention.
        </p>

        <h2>What does this look like operationally?</h2>
        <ul>
          <li>Aggregate cognitive trend deltas across teams, flagged when they cross a threshold.</li>
          <li>Defensible wellness ROI — workshops and biomarker participation are visible alongside trend.</li>
          <li>Promotion-readiness signals that ride on months of data rather than one annual review.</li>
          <li>Same platform houses training, assessments, workshops, and biomarker reports.</li>
        </ul>

        <h2>What about employee trust?</h2>
        <p>
          This is the part that makes HR's life easier in practice. The architecture splits
          employee-visible records from manager-aggregated views, with minimum-team-size
          enforcement. You can roll out the platform with a defensible "your data stays yours"
          story rather than a policy promise that's hard to police.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="Use cases"
        title="What HR & People teams build on top"
        items={[
          {
            icon: "users",
            title: "Burnout early-warning",
            body: "Aggregated trend dips, variability changes, and missed workshops flagged for review by team — never by individual.",
          },
          {
            icon: "chart",
            title: "Defensible wellness ROI",
            body: "Workshop and biomarker participation visible alongside performance trends — a fairer ROI story than vibes-only surveys.",
          },
          {
            icon: "scale",
            title: "Promotion-readiness on trend",
            body: "Trend slope and tenure-adjusted benchmarks support promotion conversations that don't pivot on one annual review.",
          },
          {
            icon: "shield",
            title: "Privacy your people can read",
            body: "Anonymised aggregates with minimum team size. Employees can see exactly what their manager sees about them.",
          },
          {
            icon: "calendar",
            title: "Workshop cadence built-in",
            body: "Sleep, recovery, nutrition, focus, longevity — bookable in the same platform, attendance feeds trend.",
          },
          {
            icon: "lock",
            title: "GDPR-native",
            body: "EU-resident data, lawful-basis schema, deletion and export at the employee's request. ISO 27001 in progress.",
          },
        ]}
      />

      <CTASection
        title="See the HR view."
        body="Aggregated team trends, anonymised wellness ROI, and a defensible promotion-readiness signal — live in 30 minutes."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Privacy by design", href: "/research/privacy-by-design" }}
      />
    </SiteShell>
  );
}
