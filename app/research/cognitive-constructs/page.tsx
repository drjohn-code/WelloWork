import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Reveal } from "../../components/Reveal";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import {
  RadarChart,
  ConstructIconStrip,
  NBackDiagram,
  SymbolSubstitution,
  PosnerCueing,
  RavenMatrix,
  TaskSwitching,
  OutOfScopeSplit,
} from "../../components/ConstructsVisuals";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Cognitive constructs — the five domains WelloWork measures",
  description:
    "Working memory, processing speed, attention, problem solving, and cognitive flexibility — each domain, the literature behind it, and how WelloWork operationalises it.",
  path: "/research/cognitive-constructs",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Research", href: "/research" },
  { name: "Cognitive constructs", href: "/research/cognitive-constructs" },
];

export default function ConstructsPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Cognitive constructs behind WelloWork",
      url: `${SITE_URL}/research/cognitive-constructs`,
      author: { "@type": "Organization", name: "WelloWork" },
      publisher: { "@type": "Organization", name: "WelloWork" },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — two-column: copy left, radar chart right */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div
            className="hero-grid"
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "1.15fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <Reveal delay={1}>
                <div style={{ marginBottom: 10 }}>
                  <span className="eyebrow">Cognitive constructs</span>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <h1
                  className="h-section"
                  style={{
                    margin: "0 0 18px",
                    maxWidth: "22ch",
                    fontSize: "clamp(34px, 5vw, 58px)",
                  }}
                >
                  Five domains, each with a{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    long literature.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  The constructs behind WelloRise and WelloWize — each with the paradigm we
                  use, what the literature establishes, and the operational caveats we hold
                  ourselves to.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <RadarChart />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ summary card with icon strip */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block constructs-answer" style={{ maxWidth: "none" }}>
              <p style={{ margin: 0 }}>
                <strong>Which cognitive constructs does WelloWork measure?</strong> Five: working
                memory, processing speed, attention, problem solving, and cognitive flexibility.
                Each one maps to an established cognitive-science paradigm — N-back, symbol
                substitution, Posner-style attention, Raven reasoning, and task-switching — adapted
                for short, daily sessions inside a workplace platform.
              </p>
              <ConstructIconStrip />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Working memory */}
      <ConstructSection
        heading="What is working memory and how do we measure it?"
        body={
          <p>
            Working memory is the capacity to hold and manipulate information in mind. We
            operationalise it through N-back tasks (after Baddeley and the broader span literature)
            with adaptive difficulty per session. Working memory is one of the most predictive
            cognitive constructs for academic and complex-task performance in the published
            literature, though transfer to job-level outcomes is more domain-specific.
          </p>
        }
        visual={<NBackDiagram />}
      />

      {/* Processing speed */}
      <ConstructSection
        heading="What is processing speed and how do we measure it?"
        body={
          <p>
            Processing speed measures how fast simple cognitive operations can be performed.
            We use symbol-substitution-style tasks (a paradigm with a long history in cognitive
            assessment) and short choice-reaction designs. Processing speed is notably sensitive
            to sleep deprivation and acute fatigue, which is part of why it&apos;s useful in a
            workplace context.
          </p>
        }
        visual={<SymbolSubstitution />}
      />

      {/* Attention */}
      <ConstructSection
        heading="What is attention and how do we measure it?"
        body={
          <p>
            Attention spans multiple sub-constructs: sustained, selective, alerting, orienting,
            executive. We focus on sustained attention (vigilance under a continuous task) and
            selective attention (filtering distractors) via Posner-style cueing paradigms,
            adapted for in-platform sessions.
          </p>
        }
        visual={<PosnerCueing />}
      />

      {/* Problem solving */}
      <ConstructSection
        heading="What is problem solving and how do we measure it?"
        body={
          <p>
            Non-verbal reasoning under constraints. We use Raven-style progressive matrices and
            tower-of-Hanoi-style problems, with explicit time-on-task tracking. Problem solving
            is the construct most influenced by domain knowledge, which is why we report it
            alongside the role-specific technical screens in WelloWize.
          </p>
        }
        visual={<RavenMatrix />}
      />

      {/* Cognitive flexibility */}
      <ConstructSection
        heading="What is cognitive flexibility and how do we measure it?"
        body={
          <p>
            The ability to shift between rule sets and contexts. Operationalised through
            task-switching designs (after Monsell, 2003 and the broader executive-function
            literature), with switch-cost reduction tracked over time as a signal of flexibility
            under low-stakes conditions.
          </p>
        }
        visual={<TaskSwitching />}
      />

      {/* What we don't measure */}
      <ConstructSection
        heading="What about constructs we don't measure?"
        body={
          <p>
            We deliberately do not score personality, mood, or emotion via the cognitive battery.
            Personality assessment is its own discipline with its own rigour requirements; we
            have nothing useful to add there and we&apos;re cautious about its workplace use in any
            case. Mood is captured by employees themselves as optional context for their own
            trend view; managers don&apos;t see it.
          </p>
        }
        visual={<OutOfScopeSplit />}
      />

      <CTASection
        title="See the constructs in the dashboard."
        body="The demo includes a side-by-side of a sample employee's adaptive session and where that result lands in the team aggregate."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Methodology overview", href: "/research/methodology" }}
      />
    </SiteShell>
  );
}

function ConstructSection({
  heading,
  body,
  visual,
}: {
  heading: string;
  body: React.ReactNode;
  visual: React.ReactNode;
}) {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 24 }}>
      <div className="container">
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <Reveal>
            <div className="prose">
              <h2 style={{ marginTop: 0 }}>{heading}</h2>
              {body}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div>{visual}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
