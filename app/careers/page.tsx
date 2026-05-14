import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { PageHero } from "../components/PageHero";
import { ProseSection } from "../components/Prose";
import { CTASection } from "../components/CTASection";
import { JsonLd } from "../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList, ORG_EMAIL } from "../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Careers at WelloWork — how we hire & how to reach us",
  description:
    "We don't have open roles right now, but we read every introduction. Here's how WelloWork thinks about hiring, who we're likely to add first, and how to get in touch.",
  path: "/careers",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Careers", href: "/careers" },
];

export default function CareersPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Careers at WelloWork",
      url: `${SITE_URL}/careers`,
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Careers"
        title={
          <>
            We don't have open roles right now —{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              but we read every intro.
            </span>
          </>
        }
        lede="WelloWork is a small Swedish team early in our pilot phase. When we open roles, they'll be posted here. Until then, the bar to start a conversation is low if your story fits ours."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>Are there open roles at WelloWork?</strong> Not at the moment. We hire
            slowly and deliberately while we are running pilots. If you would like to be on the
            short list for the next round of roles, email{" "}
            <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> with a one-paragraph intro and
            relevant links — we read every one.
          </>
        }
      >
        <h2>What kind of people are we likely to hire first?</h2>
        <ul>
          <li>Engineers who have shipped product, not only frameworks.</li>
          <li>Designers who care about evidence-based product and have opinions on type and motion.</li>
          <li>Researchers with a cognitive-science or quantitative-psychology background who can write methodology notes that hold up.</li>
          <li>Sales and customer-success people who have run pilots end-to-end at small, careful B2B companies.</li>
        </ul>

        <h2>How do we run a hiring process?</h2>
        <p>
          Short, transparent stages — usually a conversation, a focused work sample tied to the
          role, and a paid trial day with the team. We share the assessment criteria up-front,
          and we use our own platform internally so we can dogfood the candidate experience.
        </p>

        <h2>What is it like to work at WelloWork?</h2>
        <p>
          Small team, Uppsala-anchored, remote-friendly across the EU and UK. We work in
          English. We default to writing things down rather than talking them out, and we
          publish our methodology in public — which makes the rest of the work easier to
          defend.
        </p>

        <h2>How can I reach you about a role?</h2>
        <p>
          Email <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> or use the form on the{" "}
          <a href="/contact">contact</a> page. Include a one-paragraph intro and what you'd
          want to work on first — no full CV needed at the intro stage.
        </p>
      </ProseSection>

      <CTASection
        title="Send us an intro."
        body="If WelloWork sounds like a place you'd want to spend a few years building, write us a paragraph. Even when we don't have roles open, we keep notes."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "About WelloWork", href: "/about" }}
      />
    </SiteShell>
  );
}
