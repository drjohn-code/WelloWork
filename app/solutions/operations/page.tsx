import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "WelloWork for Operations leaders — schedule around real performance",
  description:
    "How Operations leaders use WelloWork to spot fatigue patterns by shift, optimise team composition for ops-critical projects, and reduce variability where it hurts safety.",
  path: "/solutions/operations",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Operations", href: "/solutions/operations" },
];

export default function OperationsPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "WelloWork for Operations",
      url: `${SITE_URL}/solutions/operations`,
      audience: { "@type": "BusinessAudience", audienceType: "Operations leaders" },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="For Operations leaders"
        title={
          <>
            Schedule shifts around how people{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              actually perform.
            </span>
          </>
        }
        lede="Shift patterns, on-call rotations, and project-team composition affect cognitive performance in measurable ways. WelloWork makes the pattern visible — by team, never by individual."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>How does WelloWork help Operations leaders?</strong> By turning cognitive
            performance into a longitudinal signal you can read against shift patterns, on-call
            rotations, and project allocations. Variability and fatigue patterns surface at the
            team level — useful for safety-critical and ops-critical roles — and the
            team-composition engine helps match roles to cognitive profiles for specific
            projects.
          </>
        }
      >
        <h2>What does this look like for a shift-based team?</h2>
        <p>
          Sustained attention and processing speed are both sensitive to sleep deprivation and
          shift rotation. WelloWork shows the aggregated team trend in these domains alongside
          the shift calendar, so a recurring dip after a particular rotation pattern becomes
          legible rather than anecdotal — and you can plan around it.
        </p>

        <h2>What does this look like for a project-based team?</h2>
        <p>
          The Team Composition engine recommends optimal team blends per project based on
          aggregated cognitive profiles and prior performance. It's a recommendation, not a
          mandate — but a defensible one when ops decisions need to be justified to leadership.
        </p>

        <h2>Variability where variability hurts</h2>
        <p>
          In ops and safety-critical work, variability often matters as much as level.
          WelloWork reports variability separately from level metrics — so consistency in
          attention can be tracked even when average attention is stable.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="Use cases"
        title="What Operations teams build on top"
        items={[
          {
            icon: "layers",
            title: "Fatigue patterns by shift",
            body: "Aggregated team-level dips overlaid on shift rotation, on-call, and release cadence.",
          },
          {
            icon: "users",
            title: "Team composition per project",
            body: "Recommendations grounded in aggregated cognitive profiles — useful when ops decisions need defending.",
          },
          {
            icon: "scale",
            title: "Variability in attention",
            body: "Track consistency separately from level — critical for safety- and ops-critical roles.",
          },
          {
            icon: "chart",
            title: "Trend annotated with events",
            body: "Sprint reviews, release windows, and on-call rotations auto-annotated on the team trend.",
          },
          {
            icon: "calendar",
            title: "Workshops at ops cadence",
            body: "Sleep, recovery, and focus workshops scheduled at the cadence that actually fits operations.",
          },
          {
            icon: "lock",
            title: "Privacy preserved",
            body: "Aggregated team views with minimum-team-size. Individual values are never exposed to operations leadership.",
          },
        ]}
      />

      <CTASection
        title="See ops trends with shift overlays."
        body="Bring a real (anonymised) shift schedule and we'll walk through how WelloWork would read against it."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Methodology", href: "/research/methodology" }}
      />
    </SiteShell>
  );
}
