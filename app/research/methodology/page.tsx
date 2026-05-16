import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Reveal } from "../../components/Reveal";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";
import {
  DomainPillStrip,
  MeasurementPipeline,
  ConstructMappingCard,
  NormalisationCompareCard,
  AggregationGrid,
  ClaimsContrastPanel,
  PublishTimeline,
  PrivacyExplainerGrid,
  ScenariosVsGamesPanel,
  ClosingMethodologyBanner,
} from "../../components/MethodologyVisuals";

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

      {/* Hero — text left, measurement pipeline right */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div className="mp-hero-grid">
            <div>
              <Reveal delay={1}>
                <div style={{ marginTop: 18 }}>
                  <span className="eyebrow">Methodology</span>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <h1
                  className="h-section"
                  style={{
                    margin: "10px 0 18px",
                    maxWidth: "22ch",
                    fontSize: "clamp(34px, 5vw, 58px)",
                  }}
                >
                  How we measure cognitive performance —{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    and what we don't claim.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  A short walk through the construct mapping, scoring,
                  aggregation, and privacy posture behind the WelloWork
                  platform. We publish methodology as we generate pilot data.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <MeasurementPipeline />
            </Reveal>
          </div>
        </div>
      </section>

      {/* "What is the WelloWork methodology, in one paragraph?" — pill strip + answer card */}
      <section style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="cc-answer-block">
              <DomainPillStrip />
              <p className="cc-answer-text">
                <strong>
                  What is the WelloWork methodology, in one paragraph?
                </strong>{" "}
                WelloWork measures cognitive performance via short adaptive
                tasks mapped to five validated constructs — working memory,
                processing speed, attention, problem solving, and cognitive
                flexibility. Per-session scores are normalised against a
                per-employee baseline and aggregated into team-level trends
                with minimum-team-size enforcement. We make no clinical or
                diagnostic claims about biomarker reports.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How are exercises mapped to constructs? — text left, mapping card right */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <div className="mp-split-row">
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>
                  How are exercises mapped to constructs?
                </h2>
                <p>
                  Each task on the platform maps to one primary construct and
                  at most one secondary construct. The primary mapping drives
                  scoring; the secondary mapping is captured for methodology
                  audit but does not contribute to the headline metric. We use
                  established paradigms — N-back, span tasks,
                  symbol-substitution, Posner cueing, Raven-style reasoning,
                  task-switching — adapted for short on-platform sessions.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ConstructMappingCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* NEW — Why WelloWork scenarios, not cognitive games? */}
      <section style={{ paddingTop: 40, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>
                Why WelloWork scenarios — not cognitive games?
              </h2>
              <p className="cc-compare-bridge">
                Research consistently shows people get better at cognitive
                games — <em>not</em> at the complex decisions their jobs
                actually require. WelloWork scenarios are grounded in
                behavioral field work.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <ScenariosVsGamesPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How are scores computed? — text left, normalisation compare right */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <div className="mp-split-row">
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>How are scores computed?</h2>
                <p>
                  Per-session performance is normalised against the employee's
                  own running baseline (z-scored within the last 90 days). This
                  deliberately avoids comparing one employee against another at
                  the individual level, since population-relative scoring is
                  sensitive to noise that doesn't matter in a workplace
                  context.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <NormalisationCompareCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* How are aggregations done? — prose intro + 2x2 grid */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>How are aggregations done?</h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <AggregationGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What do we deliberately not claim? — contrast panel */}
      <section style={{ paddingTop: 40, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>
                What do we deliberately not claim?
              </h2>
              <p>
                We do not claim transfer of cognitive training to specific
                business outcomes (revenue, productivity). We do not claim
                clinical or diagnostic value for biomarker reports. We do not
                claim individual employee ranking is reliable from short
                adaptive tasks — only that trends are. And we do not invent
                metrics: every claim ties back to a published construct or to
                a methodology note we will publish under <code>/research</code>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 12 }}>
              <ClaimsContrastPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How do we publish updates? — prose + timeline */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>How do we publish updates?</h2>
              <p>
                Methodology notes will be posted under{" "}
                <a href="/research/science-insight">
                  /research/science-insight
                </a>{" "}
                as pilot cohorts produce enough data to write something
                defensible. We will not publish individual customer data, and
                we will not publish aggregates that don't meet our
                minimum-team threshold.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <PublishTimeline />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Privacy in the methodology — prose + 2-col privacy card */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>Privacy in the methodology</h2>
              <p>
                Methodology and privacy are linked. The platform's choice to
                normalise within an employee, not against a population, is
                also what makes it harder to "de-anonymise" an aggregate.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 12 }}>
              <PrivacyExplainerGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing methodology banner */}
      <section style={{ paddingTop: 40, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <ClosingMethodologyBanner />
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Want the methodology walked through live?"
        body="A demo includes a 5–10 minute slot to dig into how a specific exercise maps to a construct, and how the score lands in the manager view."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Back to research", href: "/research" }}
      />
    </SiteShell>
  );
}
