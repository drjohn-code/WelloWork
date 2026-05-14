import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { PageHero } from "../../components/PageHero";
import { ProseSection } from "../../components/Prose";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Workshops — live health workshops, on-site or remote | WelloWork",
  description:
    "Facilitator-led workshops on sleep, recovery, nutrition, focus, and longevity. On-site or remote, bookable in WelloWork, with outcomes feeding back into performance trends.",
  path: "/platform/workshops",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Workshops", href: "/platform/workshops" },
];

export default function WorkshopsPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWork Workshops — Live health workshops",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Corporate health workshops",
      areaServed: ["EU", "UK", "Nordics"],
      url: `${SITE_URL}/platform/workshops`,
      description:
        "Facilitator-led health and performance workshops, on-site or remote, integrated into the WelloWork platform.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Workshops"
        title={
          <>
            Live health workshops, on-site or{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              remote.
            </span>
          </>
        }
        lede="Facilitator-led sessions on the cognitive performance and longevity themes that compound — sleep, nutrition, recovery, focus. Booked in the platform; outcomes flow back into performance trends."
        crumbs={CRUMBS}
      />

      <ProseSection
        answer={
          <>
            <strong>What are WelloWork workshops?</strong> They're live, facilitator-led
            sessions for employees — on-site or remote — covering sleep architecture, nutrition
            for cognitive performance, stress and focus, and longevity basics. Bookings,
            attendance, and follow-ups happen inside the same platform that runs daily training
            and performance trends.
          </>
        }
      >
        <h2>Which workshops are available?</h2>
        <ul>
          <li>Sleep architecture and recovery</li>
          <li>Nutrition for cognitive performance</li>
          <li>Stress, focus, and cognitive load</li>
          <li>Longevity & metabolic health basics</li>
          <li>Movement and recovery for desk-bound roles</li>
        </ul>

        <h2>How is this different from a one-off speaker?</h2>
        <p>
          The content of a one-off speaker doesn't compound. Workshops here are scheduled in a
          cadence that matches each customer's pilot, with attendance and follow-up actions
          captured back in the platform. That means a workshop on sleep in May links forward
          into a recovery-flagged dip in July, not a vague memory from a Tuesday afternoon.
        </p>

        <h2>On-site or remote?</h2>
        <p>
          Both. Most pilots run a mix — on-site for the Nordics, remote for distributed teams
          elsewhere. Facilitators are reviewed annually and aligned with the platform's broader
          methodology.
        </p>

        <h2>Scoping</h2>
        <p>
          Workshops are scoped per engagement — facilitator availability, location, language,
          and follow-up cadence are confirmed in a scoping call. They're included in the
          Platform + Services tier alongside biomarker testing.
        </p>
      </ProseSection>

      <FeatureGrid
        eyebrow="What's included"
        title="What does a workshop engagement ship with?"
        items={[
          {
            icon: "calendar",
            title: "Bookings inside the platform",
            body: "Employees book through the same WelloWork app that runs training and trends — no separate vendor portal.",
          },
          {
            icon: "users",
            title: "Facilitator-led",
            body: "Live sessions led by trained facilitators, with structured Q&A and short follow-up workflows.",
          },
          {
            icon: "flow",
            title: "Outcomes feed trends",
            body: "Workshop attendance and follow-ups are annotated on the performance trend, so dips and bumps don't read as noise.",
          },
          {
            icon: "scale",
            title: "Cognitive- and longevity-aligned",
            body: "Curriculum aligned with the same construct framework that drives WelloRise and Measure — not a separate worldview.",
          },
          {
            icon: "search",
            title: "Attendance & follow-up tracking",
            body: "Aggregated attendance and follow-up rates feed the Service Engagement reporting for HR and Operations.",
          },
          {
            icon: "lock",
            title: "Privacy-respecting",
            body: "Individual employee attendance is never surfaced to managers — only aggregated and anonymised rates per team.",
          },
        ]}
      />

      <CTASection
        title="Scope a workshop engagement."
        body="Workshop and biomarker testing volumes are confirmed in a scoping call. Bring your headcount and constraints — we'll bring options."
        primary={{ label: "Book a scoping call", href: "/book-a-demo" }}
        secondary={{ label: "Talk to sales", href: "/contact" }}
      />
    </SiteShell>
  );
}
