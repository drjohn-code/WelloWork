import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

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
      <PageHero
        eyebrow="Science & insight"
        title={
          <>
            Notes from the WelloWork{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              research team.
            </span>
          </>
        }
        lede="A working space for methodology notes, literature reviews, and observations from pilot cohorts. We publish work-in-progress with caveats, not finished claims."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What lives under Science & insight?</strong> Methodology notes,
            mini-literature reviews, and observations from early pilot cohorts. The goal is to
            show our working — including the places where the literature does not yet support
            the kind of claim a marketing page would want to make.
          </>
        }
      >
        <h2>What can readers expect here?</h2>
        <p>
          Short, dated notes on a specific construct or design decision. Each note will name
          its primary sources, identify where it's a working hypothesis versus an established
          finding, and link back to the methodology overview for context.
        </p>

        <h2>What will be published first?</h2>
        <ul>
          <li>A note on within-employee normalisation versus population-relative scoring.</li>
          <li>
            A short review of N-back task transfer effects — including the meta-analyses where
            transfer is weaker than the original studies suggested.
          </li>
          <li>Notes on minimum-team-size thresholds for manager-visible aggregates.</li>
          <li>
            Observations on session-cadence drop-off in early pilots, and the design changes we
            tried in response.
          </li>
        </ul>

        <h2>What this is not</h2>
        <p>
          This is not a marketing blog and not a peer-reviewed publication. It's the
          in-between layer where we keep ourselves honest in public. Anything that graduates
          into a peer-reviewed venue we'll link to from here once it exists.
        </p>

        <h2>How to follow updates</h2>
        <p>
          For now, the easiest way to follow updates is to subscribe via{" "}
          <a href="/contact">contact</a> — we will not add anyone to any list without explicit
          opt-in, and you can unsubscribe at any time.
        </p>
      </ProseSection>

      <CTASection
        title="Want a methodology question answered?"
        body="If you'd like a specific question on the literature or our approach addressed in a note here, tell us via the contact form — we read everything."
        primary={{ label: "Contact research", href: "/contact" }}
        secondary={{ label: "Back to research", href: "/research" }}
      />
    </SiteShell>
  );
}
