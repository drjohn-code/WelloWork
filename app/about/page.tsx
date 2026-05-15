import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { JsonLd } from "../components/JsonLd";
import { CTASection } from "../components/CTASection";
import { SITE_URL, buildMetadata, breadcrumbList, organizationSchema } from "../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About WelloWork — workplace performance, built in Sweden",
  description:
    "WelloWork AB is a Swedish workplace performance platform founded in 2024. We combine cognitive training, longitudinal performance, biomarker testing, and live workshops.",
  path: "/about",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export default function AboutPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    organizationSchema(),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About WelloWork",
      url: `${SITE_URL}/about`,
      about: { "@id": `${SITE_URL}#org` },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="About WelloWork"
        title={
          <>
            A small Swedish team building a different kind of{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              workplace platform.
            </span>
          </>
        }
        lede="We started WelloWork in 2024 in Uppsala, Sweden. We build for HR, Operations, and L&D teams that already know engagement scores aren't the same thing as performance — and want one platform that actually measures the second."
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>What does WelloWork do?</strong> WelloWork is a workplace performance
              platform that combines daily cognitive training (WelloRise), hiring and internal
              assessments (WelloWize), longitudinal performance trends, live health workshops,
              and biomarker sample testing. Employees own their data; managers see anonymised,
              aggregated insights only.
            </div>
          </Reveal>

          <div
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: 48,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <div className="prose">
              <h2>Why did we build this?</h2>
              <p>
                Most workplace platforms either measure how people <em>feel</em> about work — engagement,
                pulse, satisfaction — or sit at the hiring funnel and stop after the offer letter.
                What's missing is a longitudinal view of cognitive performance once people are
                inside the organisation. WelloWork is built specifically for that gap, with the
                same data model running through training, assessments, workshops, and biomarker
                reports.
              </p>

              <h2>Who is WelloWork for?</h2>
              <p>
                We work with organisations between 50 and 5,000 employees in the EU, UK, and the
                Nordics — typically those that already collect engagement data and want a
                defensible performance signal alongside it. HR and People leaders use us to spot
                burnout signals early; Operations leaders use us to schedule around how teams
                actually perform; L&D leaders use us to build growth tracks tied to measured
                cognitive profiles.
              </p>

              <h2>What is the privacy stance?</h2>
              <p>
                Privacy is the architecture, not a compliance afterthought. Employee-level
                cognitive scores, biomarker reports, and assessment results stay with the
                employee. Managers and admins only see anonymised, aggregated trends. All
                employee data is stored inside the EU under the GDPR, and we are working towards
                ISO 27001 certification.
              </p>

              <h2>Where is WelloWork based?</h2>
              <p>
                WelloWork AB is registered in Sweden and operates out of Uppsala. We serve
                customers across the EU, the United Kingdom, and the Nordics, and run the
                platform on EU-resident infrastructure.
              </p>
            </div>

            <Reveal delay={1}>
              <div className="glass" style={{ padding: 26 }}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    margin: "0 0 16px",
                    color: "var(--ink-1)",
                  }}
                >
                  At a glance
                </h2>
                <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "12px 14px", fontSize: 14 }}>
                  <dt style={{ color: "var(--ink-3)" }}>Legal name</dt>
                  <dd style={{ margin: 0, color: "var(--ink-1)", fontWeight: 600 }}>WelloWork AB</dd>

                  <dt style={{ color: "var(--ink-3)" }}>Founded</dt>
                  <dd style={{ margin: 0, color: "var(--ink-1)", fontWeight: 600 }}>2024</dd>

                  <dt style={{ color: "var(--ink-3)" }}>HQ</dt>
                  <dd style={{ margin: 0, color: "var(--ink-1)", fontWeight: 600 }}>Uppsala, Sweden</dd>

                  <dt style={{ color: "var(--ink-3)" }}>Service area</dt>
                  <dd style={{ margin: 0, color: "var(--ink-1)", fontWeight: 600 }}>EU · UK · Nordics</dd>

                  <dt style={{ color: "var(--ink-3)" }}>Stage</dt>
                  <dd style={{ margin: 0, color: "var(--ink-1)", fontWeight: 600 }}>Early, in pilots</dd>

                  <dt style={{ color: "var(--ink-3)" }}>Data residency</dt>
                  <dd style={{ margin: 0, color: "var(--ink-1)", fontWeight: 600 }}>EU only</dd>

                  <dt style={{ color: "var(--ink-3)" }}>Compliance</dt>
                  <dd style={{ margin: 0, color: "var(--ink-1)", fontWeight: 600 }}>GDPR · ISO 27001 in progress</dd>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        title={
          <>
            Want to see what a pilot{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              looks like?
            </span>
          </>
        }
        body="Thirty minutes, realistic sample data, and a candid conversation about scope and price."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </SiteShell>
  );
}
