import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Reveal } from "../../components/Reveal";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";
import {
  DomainCardGrid,
  DomainPillStrip,
  ScenarioCard,
  GamesVsScenarioPanel,
  ExcludePanel,
  MethodologyBanner,
} from "../../components/CognitiveConstructsVisuals";

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

      {/* Hero — two-column (text left, domain card grid right) */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div className="cc-hero-grid">
            <div>
              <Reveal delay={1}>
                <div style={{ marginTop: 18 }}>
                  <span className="eyebrow">Cognitive constructs</span>
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
                  Five domains, each with a{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    long literature.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  The constructs behind WelloRise and WelloWize — each with the
                  paradigm we use, what the literature establishes, and the
                  operational caveats we hold ourselves to.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <DomainCardGrid />
            </Reveal>
          </div>
        </div>
      </section>

      {/* "Which cognitive constructs..." answer callout with pill strip */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="cc-answer-block">
              <DomainPillStrip />
              <p className="cc-answer-text">
                <strong>Which cognitive constructs does WelloWork measure?</strong>{" "}
                Five: working memory, processing speed, attention, problem solving,
                and cognitive flexibility. Each one maps to an established
                cognitive-science paradigm — N-back, symbol substitution,
                Posner-style attention, Raven reasoning, and task-switching —
                adapted for short, daily sessions inside a workplace platform.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Per-domain sections (text left, scenario card right) */}
      <section style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div className="container">
          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>What is working memory and how do we measure it?</h2>
                <p>
                  Working memory is the capacity to hold and manipulate information
                  in mind. We operationalise it through N-back tasks (after Baddeley
                  and the broader span literature) with adaptive difficulty per
                  session. Working memory is one of the most predictive cognitive
                  constructs for academic and complex-task performance in the
                  published literature, though transfer to job-level outcomes is
                  more domain-specific.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="wm" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>What is processing speed and how do we measure it?</h2>
                <p>
                  Processing speed measures how fast simple cognitive operations
                  can be performed. We use symbol-substitution-style tasks (a
                  paradigm with a long history in cognitive assessment) and short
                  choice-reaction designs. Processing speed is notably sensitive to
                  sleep deprivation and acute fatigue, which is part of why it's
                  useful in a workplace context.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="ps" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>What is attention and how do we measure it?</h2>
                <p>
                  Attention spans multiple sub-constructs: sustained, selective,
                  alerting, orienting, executive. We focus on sustained attention
                  (vigilance under a continuous task) and selective attention
                  (filtering distractors) via Posner-style cueing paradigms,
                  adapted for in-platform sessions.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="att" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>What is problem solving and how do we measure it?</h2>
                <p>
                  Non-verbal reasoning under constraints. We use Raven-style
                  progressive matrices and tower-of-Hanoi-style problems, with
                  explicit time-on-task tracking. Problem solving is the construct
                  most influenced by domain knowledge, which is why we report it
                  alongside the role-specific technical screens in WelloWize.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="prob" />
            </Reveal>
          </div>

          <div className="cc-domain-row">
            <Reveal>
              <div className="prose">
                <h2>What is cognitive flexibility and how do we measure it?</h2>
                <p>
                  The ability to shift between rule sets and contexts.
                  Operationalised through task-switching designs (after Monsell,
                  2003 and the broader executive-function literature), with
                  switch-cost reduction tracked over time as a signal of
                  flexibility under low-stakes conditions.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ScenarioCard domain="flex" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* NEW: Why not just use cognitive games? */}
      <section style={{ paddingTop: 40, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>Why not just use cognitive games?</h2>
              <p className="cc-compare-bridge">
                Research consistently shows people get better at cognitive
                games — <em>not</em> at complex real-world tasks. WelloWork
                scenarios are grounded in behavioral field work, not gamified
                proxies.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <GamesVsScenarioPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* "What about constructs we don't measure?" — prose + exclude panel */}
      <section style={{ paddingTop: 32, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>What about constructs we don't measure?</h2>
              <p>
                We deliberately do not score personality, mood, or emotion via the
                cognitive battery. Personality assessment is its own discipline
                with its own rigour requirements; we have nothing useful to add
                there and we're cautious about its workplace use in any case. Mood
                is captured by employees themselves as optional context for their
                own trend view; managers don't see it.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <ExcludePanel />
          </Reveal>
        </div>
      </section>

      {/* Methodology banner */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <MethodologyBanner />
          </Reveal>
        </div>
      </section>

      <CTASection
        title="See the constructs in the dashboard."
        body="The demo includes a side-by-side of a sample employee's adaptive session and where that result lands in the team aggregate."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Methodology overview", href: "/research/methodology" }}
      />
    </SiteShell>
  );
}
