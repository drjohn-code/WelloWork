import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Wellowize — cognitive & technical assessments | WelloWork",
  description:
    "Wellowize is one assessment framework for hiring panels and internal benchmarking. Cognitive and technical, scored against role and tenure — defensible at the offer stage and after.",
  path: "/platform/assessment",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Assessment — Wellowize", href: "/platform/assessment" },
];

export default function AssessmentPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Wellowize — Cognitive & technical assessments",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Hiring and internal assessment",
      areaServed: ["EU", "UK"],
      url: `${SITE_URL}/platform/assessment`,
      description:
        "One assessment framework for hiring candidates and internal employees — cognitive and technical, with role-level benchmarks.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Wellowize — Assessment"
        title={
          <>
            One assessment framework — hiring{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              and after.
            </span>
          </>
        }
        lede="Wellowize gives hiring panels and people-leaders the same assessment vocabulary, so the work doesn't stop at the offer letter. Cognitive and technical, scored against role and tenure."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What is Wellowize?</strong> Wellowize is WelloWork's assessment product. It
            evaluates candidates and existing employees across the same cognitive and technical
            framework, returns hiring-panel-ready results in minutes, and produces internal
            benchmarks against role and tenure that can be re-run quarterly.
          </>
        }
      >
        <h2>How does Wellowize differ from a hiring assessment tool?</h2>
        <p>
          Most assessment tools are scoped to the hiring funnel — they end the moment a
          candidate signs. Wellowize uses the same framework before and after the offer letter,
          which means an "above benchmark" candidate today is comparable to that same person
          twelve months in, and to their peers.
        </p>

        <h2>What does it actually measure?</h2>
        <ul>
          <li>Five cognitive domains aligned with the platform's literature-backed constructs.</li>
          <li>Role-specific technical screens (e.g. SQL, TypeScript, statistics) that can be added per role.</li>
          <li>Time-on-task and self-paced patterns, used to spot fatigue rather than penalise it.</li>
        </ul>

        <h2>Hiring panel results in minutes</h2>
        <p>
          Once a candidate completes the assessment, the hiring panel sees a normalised profile
          against the role benchmark. This is intentionally a profile, not a single number —
          defensible at the offer stage and easier to discuss against the job spec.
        </p>

        <h2>Internal benchmarks against role + tenure</h2>
        <p>
          Internally, Wellowize can be re-run on a schedule. Results feed the longitudinal trend
          that the Measure product surfaces — so promotion-readiness decisions are grounded in a
          trend across the year rather than the score someone happened to post on assessment day.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="What's included"
        title="What does Wellowize ship with?"
        items={[
          {
            icon: "target",
            title: "Cognitive + technical, one framework",
            body: "Five cognitive domains plus role-specific technical screens — no separate vendor for each piece.",
          },
          {
            icon: "flow",
            title: "Hiring panel reports in minutes",
            body: "Normalised profile against the role benchmark, ready to discuss against the job spec.",
          },
          {
            icon: "scale",
            title: "Role + tenure benchmarks",
            body: "Internal scores are comparable across hires and tenures, not against a generic population.",
          },
          {
            icon: "search",
            title: "Auditable scoring",
            body: "Every score is traceable to its underlying tasks and time-on-task — defensible if a hiring decision is challenged.",
          },
          {
            icon: "chart",
            title: "Feeds longitudinal trends",
            body: "Re-runs flow into the Measure product, so promotion decisions ride on trends rather than a single test.",
          },
          {
            icon: "lock",
            title: "GDPR-native",
            body: "Candidate and employee assessment data is stored in the EU. Retention and deletion are configurable.",
          },
        ]}
      />

      <CTASection
        title="See Wellowize on real hiring panels."
        body="A 30-minute walkthrough with sample candidate profiles and a candid pilot conversation."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Read the research", href: "/research" }}
      />
    </SiteShell>
  );
}
