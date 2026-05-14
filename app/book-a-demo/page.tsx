import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { JsonLd } from "../components/JsonLd";
import { LeadForm } from "../components/LeadForm";
import { SITE_URL, buildMetadata, breadcrumbList } from "../lib/site";
import { Icon } from "../components/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Book a WelloWork demo — manager dashboard walkthrough",
  description:
    "Book a 30-minute demo of the WelloWork manager dashboard with realistic sample data. Daily cognitive training, longitudinal trends, biomarker reports in one view.",
  path: "/book-a-demo",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Book a demo", href: "/book-a-demo" },
];

export default function BookADemoPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Book a WelloWork demo",
      url: `${SITE_URL}/book-a-demo`,
      potentialAction: {
        "@type": "RegisterAction",
        target: `${SITE_URL}/book-a-demo`,
        name: "Book a demo",
      },
    },
  ];

  const expect = [
    {
      icon: "users",
      title: "Manager dashboard walk-through",
      body: "Aggregated team trends, biomarker completion, team composition signals — using sample data that mirrors your industry.",
    },
    {
      icon: "shield",
      title: "Privacy architecture",
      body: "How employees see their own data, and what the manager view does — and does not — surface.",
    },
    {
      icon: "calendar",
      title: "Pilot scoping",
      body: "Headcount, rollout pace, whether you want workshops or biomarker testing in the pilot, and how pricing is shaped.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Book a demo"
        title={
          <>
            See your team’s cognitive performance{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              in 30 minutes.
            </span>
          </>
        }
        lede="A focused walkthrough of the WelloWork manager dashboard with realistic sample data from your industry — plus a short pilot-scoping conversation. No fictional ROI charts."
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: 48,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, margin: "0 0 14px" }}>
                  What does a WelloWork demo cover?
                </h2>
                <div className="answer-block">
                  <strong>A WelloWork demo is a 30-minute live session with a product specialist.</strong>{" "}
                  You see the manager dashboard with sample data, the employee training and biomarker
                  views, and we scope the pilot — pricing, rollout, and whether workshops or
                  biomarker testing are in scope.
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "28px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {expect.map((e) => (
                    <li
                      key={e.title}
                      style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background:
                            "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: "1px solid rgba(255,255,255,0.7)",
                        }}
                      >
                        <Icon name={e.icon} size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--ink-1)", fontSize: 15.5 }}>
                          {e.title}
                        </div>
                        <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55 }}>
                          {e.body}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, margin: "36px 0 14px" }}>
                  Who is this demo for?
                </h2>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  HR, People, L&D, and Operations leaders at organisations between 50 and 5,000
                  employees in the EU, UK, and the Nordics. We work best with teams who already
                  collect engagement data and want a longitudinal performance signal alongside it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <LeadForm
                endpoint="/api/demo-requests"
                submitLabel="Request a demo"
                successTitle="Thanks — we’ll be in touch."
                successBody="A product specialist will reach out within one working day to confirm a time. Check your work inbox (and spam, just in case)."
                companyRequired
              />
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
