import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Measure — longitudinal cognitive performance trends | WelloWork",
  description:
    "WelloWork Measure turns every training session, assessment, and workshop into a longitudinal performance trend — 90-day, 6-month, and 12-month views for managers.",
  path: "/platform/measure",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Measure — Performance trends", href: "/platform/measure" },
];

export default function MeasurePage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWork Measure — Longitudinal performance trends",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Workforce analytics",
      areaServed: ["EU", "UK"],
      url: `${SITE_URL}/platform/measure`,
      description:
        "Longitudinal cognitive performance trends, aggregated for managers and itemised for employees, auto-annotated against work events.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Measure — Performance trends"
        title={
          <>
            Longitudinal performance —{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              not a one-time score.
            </span>
          </>
        }
        lede="Measure is the trend layer of the WelloWork platform. Every session, every assessment, and every workshop is a data point — aggregated for managers and itemised for the employee who owns it."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What is WelloWork Measure?</strong> Measure turns every training session,
            assessment, and workshop interaction into a longitudinal performance signal. Managers
            see 90-day, 6-month, and 12-month aggregated trends, auto-annotated against work
            events such as sprint reviews, on-call rotations, and shift changes.
          </>
        }
      >
        <h2>Why is a trend better than a score?</h2>
        <p>
          A single cognitive score on a given day reflects sleep, caffeine, stress, and noise as
          much as it does the underlying domain. A trend across weeks and months filters that
          noise and shows direction — which is the only thing a manager can act on without
          unfair single-point decisions.
        </p>

        <h2>What can you actually see?</h2>
        <ul>
          <li>Aggregated team trend across the five cognitive domains.</li>
          <li>Variability within the team — useful for safety-critical or operations-critical roles.</li>
          <li>Auto-annotation against sprint reviews, on-call rotations, and similar work events.</li>
          <li>Promotion-readiness signal grounded in trend slope, not a single test.</li>
        </ul>

        <h2>Promotion-readiness based on trend, not one test</h2>
        <p>
          We're deliberate that promotion-readiness is a <em>signal</em>, not a verdict. It's a
          starting point for a conversation between a manager, HR, and the employee — one that
          they can run with months of comparable data behind them rather than a single
          assessment day.
        </p>

        <h2>What does it look like for the employee?</h2>
        <p>
          Employees see their own data — the same trend a manager sees in aggregate, plus their
          per-session results. They control what their manager and HR can see at the team level
          and can request export or deletion under the GDPR at any time.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="What's included"
        title="What does Measure ship with?"
        items={[
          {
            icon: "chart",
            title: "90 / 180 / 365-day views",
            body: "Three trend horizons — sprint-cadence, half-year, and full-year. Reads stay stable when one bad week happens.",
          },
          {
            icon: "calendar",
            title: "Auto-annotated against work events",
            body: "Sprint reviews, releases, shift changes, and on-call rotations are overlaid on the trend so dips don't read as mysteries.",
          },
          {
            icon: "users",
            title: "Aggregated team views",
            body: "Managers and HR see anonymised trends per team and per cohort — never individual employees.",
          },
          {
            icon: "spark",
            title: "Variability metrics",
            body: "Where variability hurts (safety, ops), Measure exposes it. Where it's healthy (creative work), it's not punished.",
          },
          {
            icon: "scale",
            title: "Promotion-readiness signal",
            body: "Trend slope, role benchmark, and tenure-relative performance combine into a single, defensible signal.",
          },
          {
            icon: "lock",
            title: "Privacy-by-design",
            body: "Aggregations enforce a minimum team size before any number is shown. Employees retain export and erasure rights.",
          },
        ]}
      />

      <CTASection
        title={
          <>
            See six months of trend in{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              one screen.
            </span>
          </>
        }
        body="Realistic sample data from your industry, with the privacy model wired up live."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "How we measure it", href: "/research/methodology" }}
      />
    </SiteShell>
  );
}
