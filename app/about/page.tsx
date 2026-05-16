import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { Reveal } from "../components/Reveal";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { JsonLd } from "../components/JsonLd";
import { CTASection } from "../components/CTASection";
import {
  UppsalaCard,
  FeatureIconGrid,
  GapDiagram,
  PersonaCards,
  PrivacyDiagram,
  SwedenMap,
} from "../components/AboutVisuals";
import {
  SITE_URL,
  buildMetadata,
  breadcrumbList,
  organizationSchema,
} from "../lib/site";

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

      {/* Hero — two-column with Uppsala location card */}
      <section style={{ paddingTop: 48, paddingBottom: 32 }}>
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
                  <span className="eyebrow">About WelloWork</span>
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
                  A small Swedish team building a different kind of{" "}
                  <span
                    className="italic-serif"
                    style={{ color: "var(--accent)" }}
                  >
                    workplace platform.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  We started WelloWork in 2024 in Uppsala, Sweden. We build for
                  HR, Operations, and L&D teams that already know engagement
                  scores aren't the same thing as performance — and want one
                  platform that actually measures the second.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <UppsalaCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* What does WelloWork do? — callout with icon grid */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="about-callout">
              <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                <strong style={{ color: "var(--ink-1)" }}>
                  What does WelloWork do?
                </strong>{" "}
                WelloWork is a workplace performance platform that combines
                daily cognitive training (WelloRise), hiring and internal
                assessments (WelloWize), longitudinal performance trends, live
                health workshops, and biomarker sample testing. Employees own
                their data; managers see anonymised, aggregated insights only.
              </p>
              <FeatureIconGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why did we build this? — prose + gap diagram */}
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
                <h2 style={{ marginTop: 0 }}>Why did we build this?</h2>
                <p>
                  Most workplace platforms either measure how people{" "}
                  <em>feel</em> about work — engagement, pulse, satisfaction —
                  or sit at the hiring funnel and stop after the offer letter.
                  What's missing is a longitudinal view of cognitive
                  performance once people are inside the organisation.
                  WelloWork is built specifically for that gap, with the same
                  data model running through training, assessments, workshops,
                  and biomarker reports.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <GapDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who is WelloWork for? — prose + persona cards row */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h2 style={{ marginTop: 0 }}>Who is WelloWork for?</h2>
              <p>
                We work with organisations between 50 and 5,000 employees in
                the EU, UK, and the Nordics — typically those that already
                collect engagement data and want a defensible performance
                signal alongside it. HR and People leaders use us to spot
                burnout signals early; Operations leaders use us to schedule
                around how teams actually perform; L&D leaders use us to build
                growth tracks tied to measured cognitive profiles.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 24 }}>
              <PersonaCards />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What is the privacy stance? — prose + privacy diagram */}
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
                <h2 style={{ marginTop: 0 }}>What is the privacy stance?</h2>
                <p>
                  Privacy is the architecture, not a compliance afterthought.
                  Employee-level cognitive scores, biomarker reports, and
                  assessment results stay with the employee. Managers and
                  admins only see anonymised, aggregated trends. All employee
                  data is stored inside the EU under the GDPR, and we are
                  working towards ISO 27001 certification.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <PrivacyDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Where is WelloWork based? — prose + Sweden map */}
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
                <h2 style={{ marginTop: 0 }}>Where is WelloWork based?</h2>
                <p>
                  WelloWork AB is registered in Sweden and operates out of
                  Uppsala. We serve customers across the EU, the United
                  Kingdom, and the Nordics, and run the platform on
                  EU-resident infrastructure.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <SwedenMap />
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
