import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Methodology overview — how WelloWork measures cognitive performance",
  description:
    "How WelloWork maps exercises to validated cognitive constructs, scores them, and aggregates results into longitudinal performance trends — with privacy by design.",
  path: "/research/methodology",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Research", href: "/research" },
  { name: "Methodology", href: "/research/methodology" },
];

export default function MethodologyPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "WelloWork methodology overview",
      url: `${SITE_URL}/research/methodology`,
      author: { "@type": "Organization", name: "WelloWork" },
      publisher: { "@type": "Organization", name: "WelloWork" },
      description:
        "How exercises map to validated cognitive constructs, how scores aggregate, and the commitment to publish methodology as pilot data is generated.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Methodology"
        title={
          <>
            How we measure cognitive performance —{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              and what we don't claim.
            </span>
          </>
        }
        lede="A short walk through the construct mapping, scoring, aggregation, and privacy posture behind the WelloWork platform. We publish methodology as we generate pilot data."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What is the WelloWork methodology, in one paragraph?</strong> WelloWork
            measures cognitive performance via short adaptive tasks mapped to five validated
            constructs — working memory, processing speed, attention, problem solving, and
            cognitive flexibility. Per-session scores are normalised against a per-employee
            baseline and aggregated into team-level trends with minimum-team-size enforcement.
            We make no clinical or diagnostic claims about biomarker reports.
          </>
        }
      >
        <h2>How are exercises mapped to constructs?</h2>
        <p>
          Each task on the platform maps to one primary construct and at most one secondary
          construct. The primary mapping drives scoring; the secondary mapping is captured for
          methodology audit but does not contribute to the headline metric. We use established
          paradigms — N-back, span tasks, symbol-substitution, Posner cueing, Raven-style
          reasoning, task-switching — adapted for short on-platform sessions.
        </p>

        <h2>How are scores computed?</h2>
        <p>
          Per-session performance is normalised against the employee's own running baseline
          (z-scored within the last 90 days). This deliberately avoids comparing one employee
          against another at the individual level, since population-relative scoring is
          sensitive to noise that doesn't matter in a workplace context.
        </p>

        <h2>How are aggregations done?</h2>
        <ul>
          <li>Minimum team size before any aggregate is shown to a manager.</li>
          <li>Trends are smoothed weekly to avoid single-day spikes driving manager attention.</li>
          <li>Annotations against work events (sprint reviews, releases, on-call rotations) are added by configurable rules.</li>
          <li>Variability metrics are reported separately from level metrics — they answer different questions.</li>
        </ul>

        <h2>What do we deliberately not claim?</h2>
        <ul>
          <li>We do not claim transfer of cognitive training to specific business outcomes (revenue, productivity).</li>
          <li>We do not claim clinical or diagnostic value for biomarker reports.</li>
          <li>We do not claim individual employee ranking is reliable from short adaptive tasks. We only claim trends are.</li>
          <li>
            We do not invent metrics. Every claim ties back to a published construct or to a
            methodology note we will publish under <code>/research</code>.
          </li>
        </ul>

        <h2>How do we publish updates?</h2>
        <p>
          Methodology notes will be posted under{" "}
          <a href="/research/science-insight">/research/science-insight</a> as pilot cohorts
          produce enough data to write something defensible. We will not publish individual
          customer data, and we will not publish aggregates that don't meet our minimum-team
          threshold.
        </p>

        <h2>Privacy in the methodology</h2>
        <p>
          Methodology and privacy are linked. The platform's choice to normalise within an
          employee, not against a population, is also what makes it harder to "de-anonymise" an
          aggregate.
        </p>
      </ProseSection>

      <CTASection
        title="Want the methodology walked through live?"
        body="A demo includes a 5–10 minute slot to dig into how a specific exercise maps to a construct, and how the score lands in the manager view."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Back to research", href: "/research" }}
      />
    </SiteShell>
  );
}
