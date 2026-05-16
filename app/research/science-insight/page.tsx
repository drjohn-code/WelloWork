import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Reveal } from "../../components/Reveal";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";
import {
  ResearchNotebookCard,
  ContentScopeStrip,
  NoteAnatomyCard,
  NotePipelineStrip,
  PositioningSpectrum,
  FieldVsGamesPanel,
  TrustSignalStrip,
} from "../../components/ScienceInsightVisuals";

export const metadata: Metadata = buildMetadata({
  title: "Science & insight — methodology notes from WelloWork research",
  description:
    "Working notes from the WelloWork research team on cognitive constructs, biomarker methodology, workplace performance signals, and where the literature is and isn't.",
  path: "/research/science-insight",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Research", href: "/research" },
  { name: "Science & insight", href: "/research/science-insight" },
];

export default function ScienceInsightPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Science & insight",
      url: `${SITE_URL}/research/science-insight`,
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero — text left, research notebook card right */}
      <section style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div className="si-hero-grid">
            <div>
              <Reveal delay={1}>
                <div style={{ marginTop: 18 }}>
                  <span className="eyebrow">Science &amp; insight</span>
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
                  Notes from the WelloWork{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    research team.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  A working space for methodology notes, literature reviews, and
                  observations from pilot cohorts. We publish work-in-progress
                  with caveats, not finished claims.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <ResearchNotebookCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scope: what lives under Science & insight? — answer card + 3-column callout */}
      <section style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="cc-answer-block">
              <p className="cc-answer-text">
                <strong>What lives under Science &amp; insight?</strong>{" "}
                Methodology notes, mini-literature reviews, and observations
                from early pilot cohorts. The goal is to show our working —
                including the places where the literature does not yet support
                the kind of claim a marketing page would want to make.
              </p>
              <ContentScopeStrip />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What can readers expect here? — prose + note anatomy diagram */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <div className="si-split-row">
            <Reveal>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>What can readers expect here?</h2>
                <p>
                  Short, dated notes on a specific construct or design decision.
                  Each note will name its primary sources, identify where it&rsquo;s
                  a working hypothesis versus an established finding, and link
                  back to the methodology overview for context.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <NoteAnatomyCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* What will be published first? — pipeline preview strip */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>What will be published first?</h2>
              <p>
                A small set of notes already in draft. Each will land with the
                caveats baked in — including null results and design changes we
                made in response to early data.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <NotePipelineStrip />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What this is not — positioning spectrum */}
      <section style={{ paddingTop: 40, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>What this is not</h2>
              <p>
                This is not a marketing blog and not a peer-reviewed publication.
                It&rsquo;s the in-between layer where we keep ourselves honest in
                public.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <PositioningSpectrum />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why field-based research changes what we measure */}
      <section style={{ paddingTop: 40, paddingBottom: 16 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>
                Why field-based research changes what we measure
              </h2>
              <p className="si-field-bridge">
                Standard cognitive batteries make people better at cognitive
                batteries. Our scenarios are built from how work actually
                happens — so <em>what we measure transfers</em>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 8 }}>
              <FieldVsGamesPanel />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How to follow updates — prose + trust signal strip */}
      <section style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>How to follow updates</h2>
              <p>
                For now, the easiest way to follow updates is to subscribe via{" "}
                <a href="/contact">contact</a> — we will not add anyone to any
                list without explicit opt-in, and you can unsubscribe at any
                time.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 16 }}>
              <TrustSignalStrip />
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Want a methodology question answered?"
        body="If you'd like a specific question on the literature or our approach addressed in a note here, tell us via the contact form — we read everything."
        primary={{ label: "Contact research", href: "/contact" }}
        secondary={{ label: "Back to research", href: "/research" }}
      />
    </SiteShell>
  );
}
