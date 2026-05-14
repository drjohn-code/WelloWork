import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "WelloRise — daily cognitive training for teams | WelloWork",
  description:
    "WelloRise is daily cognitive training across working memory, processing speed, attention, problem solving, and cognitive flexibility — built for busy work weeks.",
  path: "/platform/growth",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Growth — WelloRise", href: "/platform/growth" },
];

export default function GrowthPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloRise — Daily cognitive training",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Cognitive training",
      areaServed: ["EU", "UK"],
      url: `${SITE_URL}/platform/growth`,
      description:
        "Adaptive daily cognitive exercises across five validated constructs, integrated with team composition and longitudinal performance trends.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="WelloRise — Growth"
        title={
          <>
            Daily cognitive training that fits in a{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              coffee break.
            </span>
          </>
        }
        lede="WelloRise is a daily cognitive training product designed for working weeks, not lab conditions. Five to ten minutes a day across five validated cognitive constructs — with a token economy that funds learning."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What is WelloRise?</strong> WelloRise is the daily cognitive-training layer
            of the WelloWork platform. It runs adaptive exercises across working memory,
            processing speed, attention, problem solving, and cognitive flexibility, awards
            tokens that unlock courses or peer help, and feeds every session into the same
            longitudinal performance trend that managers see in aggregate.
          </>
        }
      >
        <h2>What does daily cognitive training actually do?</h2>
        <p>
          Cognitive training is well-studied as a category, with substantial heterogeneity in
          how much it transfers to broader work performance. WelloRise is built on the
          constructs the field already validates (working memory tasks such as N-back, classic
          processing-speed paradigms, sustained-attention designs, Raven-style reasoning, and
          task-switching) rather than novel metrics we invented.
        </p>
        <p>
          What we make defensible is the operational claim: regular short sessions produce a
          measurable, longitudinal signal at the team level — useful for fatigue patterns,
          variability, and trend-based promotion-readiness, not as a single-point employee
          score.
        </p>

        <h2>How is it different from a brain-training app?</h2>
        <p>
          Consumer brain-training apps optimise for engagement and retention. WelloRise is a
          B2B layer of a workplace performance platform: sessions feed the same data model that
          drives manager dashboards, hiring assessments (Wellowize), workshops, and biomarker
          reports. The point is not to maximise a score in the app — it is to keep a stable,
          comparable signal across the people you work with.
        </p>

        <h2>What's in it for the employee?</h2>
        <ul>
          <li>Adaptive difficulty per cognitive domain, calibrated to the individual.</li>
          <li>Tokens earned per session redeem for courses, growth tracks, or peer help.</li>
          <li>A task marketplace where colleagues can answer one another's questions and earn tokens.</li>
          <li>Full visibility on their own data — and a guarantee that managers see only aggregates.</li>
        </ul>

        <h2>What's in it for managers?</h2>
        <ul>
          <li>90-day, 6-month, and 12-month trend views across teams.</li>
          <li>Team-composition recommendations rooted in cognitive strengths, not gut feel.</li>
          <li>Variability and consistency metrics where they matter most — operations-critical roles.</li>
          <li>Auto-annotation against work events (sprint reviews, releases, on-call rotations).</li>
        </ul>
      </ProseSection>

      <FeatureGrid
        eyebrow="What's included"
        title={
          <>
            What does <span className="italic-serif" style={{ color: "var(--accent)" }}>WelloRise</span> ship with?
          </>
        }
        items={[
          {
            icon: "brain",
            title: "Five validated cognitive domains",
            body: "Working memory, processing speed, attention, problem solving, and cognitive flexibility — mapped to construct-level literature.",
          },
          {
            icon: "spark",
            title: "Adaptive difficulty",
            body: "Each session calibrates per domain. Underchallenged employees don't plateau; overstretched ones don't burn out.",
          },
          {
            icon: "star",
            title: "Token economy",
            body: "Sessions earn tokens that redeem for courses, growth tracks, or peer help — funding learning the team already wants.",
          },
          {
            icon: "users",
            title: "Team Composition engine",
            body: "Recommends optimal team blends per project, based on aggregated cognitive profiles and prior performance.",
          },
          {
            icon: "chart",
            title: "Longitudinal trends",
            body: "Every session is a data point. Trends, not single scores, drive the manager view and promotion-readiness signals.",
          },
          {
            icon: "lock",
            title: "Employee-first privacy",
            body: "Individual session results are private to the employee. Managers see anonymised, aggregated trends only.",
          },
        ]}
      />

      <CTASection
        title={
          <>
            See WelloRise inside the{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              manager dashboard.
            </span>
          </>
        }
        body="A 30-minute walkthrough with sample data from your industry — and a candid pilot conversation."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Compare platform tiers", href: "/#pricing" }}
      />
    </SiteShell>
  );
}
