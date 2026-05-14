import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "WelloWork for L&D leaders — growth tracks tied to measured profile",
  description:
    "How L&D leaders use WelloWork to build growth tracks tied to a measured cognitive profile, run a token-funded course marketplace, and track development alongside performance.",
  path: "/solutions/learning-development",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Learning & Development", href: "/solutions/learning-development" },
];

export default function LDPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "WelloWork for Learning & Development",
      url: `${SITE_URL}/solutions/learning-development`,
      audience: { "@type": "BusinessAudience", audienceType: "Learning & Development leaders" },
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="For L&D leaders"
        title={
          <>
            Build growth tracks tied to a measured{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              cognitive profile.
            </span>
          </>
        }
        lede="A token-funded course marketplace, recommendations rooted in cognitive strengths, and development that is visible alongside performance trends rather than running on its own track."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>How does WelloWork help L&D leaders?</strong> Daily cognitive training
            earns employees tokens that fund courses inside a managed marketplace.
            Recommendations are rooted in their measured cognitive profile from WelloRise and
            Wellowize, and uptake plus completion show up alongside performance trends in the
            same dashboards.
          </>
        }
      >
        <h2>Why tie L&D to a cognitive profile?</h2>
        <p>
          L&D rooted in self-report often becomes a popularity contest among course providers.
          Anchoring recommendations to a measured cognitive profile makes the path through the
          marketplace more defensible — and easier to evaluate after the fact, because
          completion ties back to the same trend signal.
        </p>

        <h2>How does the token economy work?</h2>
        <p>
          Employees earn tokens through daily training sessions. Tokens redeem for courses,
          growth tracks, or peer help on the in-platform task marketplace. The economy is
          configurable per customer — L&D can cap, top up, or steer it toward specific learning
          tracks at any time.
        </p>

        <h2>What about measurable L&D outcomes?</h2>
        <p>
          We're careful about claims here. We can show course completion, time-to-completion,
          and where tokens are being redeemed. We do not claim that a specific course produced
          a specific change in performance — but we can let L&D see the two side by side, and
          you can draw your own conclusions over time.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="Use cases"
        title="What L&D teams build on top"
        items={[
          {
            icon: "target",
            title: "Profile-driven recommendations",
            body: "Course suggestions rooted in the employee's measured cognitive strengths and tenure-relative gaps.",
          },
          {
            icon: "star",
            title: "Token-funded marketplace",
            body: "Daily training sessions earn tokens. Tokens fund courses and peer help — configurable per customer.",
          },
          {
            icon: "users",
            title: "Peer-help economy",
            body: "Colleagues answer one another's questions and earn tokens. Tribal knowledge becomes a learning surface.",
          },
          {
            icon: "chart",
            title: "Visible alongside performance",
            body: "Course completion and uptake live in the same dashboards as cognitive performance — easier to evaluate together.",
          },
          {
            icon: "flow",
            title: "Configurable growth tracks",
            body: "L&D can build branded growth tracks that bundle courses, workshops, and peer mentoring.",
          },
          {
            icon: "lock",
            title: "Privacy-respecting",
            body: "Individual course uptake is private to the employee; managers see aggregates only.",
          },
        ]}
      />

      <CTASection
        title="See L&D inside the platform."
        body="A 30-minute walkthrough of the marketplace, token economy, and where development shows up next to performance."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Talk to L&D sales", href: "/contact" }}
      />
    </SiteShell>
  );
}
