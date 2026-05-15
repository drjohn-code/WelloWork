import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { Reveal } from "../components/Reveal";
import { JsonLd } from "../components/JsonLd";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CalcomEmbed } from "../components/CalcomEmbed";
import { DemoFallbackForm } from "../components/DemoFallbackForm";
import { Icon, ArrowRight } from "../components/Icons";
import { SITE_URL, buildMetadata, breadcrumbList } from "../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Book a WelloWork demo — pick a 30-minute slot",
  description:
    "Pick a time on the live calendar and meet a WelloWork product specialist for a 30-minute walkthrough of the manager dashboard. Made in Sweden · GDPR-native.",
  path: "/book-a-demo",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Book a demo", href: "/book-a-demo" },
];

const FAQS = [
  {
    q: "How long is a WelloWork demo?",
    a: "Thirty minutes end to end. The first 20 minutes are a guided walkthrough of the manager dashboard and the employee app; the final 10 are reserved for your questions and pilot scoping.",
  },
  {
    q: "Do we need to prepare anything before the call?",
    a: "No prep work. Bring your team size, the industry you operate in, and a rough sense of when you might pilot — that is enough to make the demo concrete.",
  },
  {
    q: "Is the demo a sales pitch or a product walkthrough?",
    a: "It is a product walkthrough on a real dashboard with sample data from your industry. No fictional ROI charts and no high-pressure close — we leave you with the information to decide on your own timeline.",
  },
  {
    q: "Can we reschedule or cancel?",
    a: "Yes. Every confirmation email includes reschedule and cancel links from the calendar — no email back-and-forth required.",
  },
  {
    q: "Who from our side should attend?",
    a: "An HR, People, L&D, or Operations decision-maker is ideal. Inviting a colleague who will own roll-out works well; we do not need finance or procurement in the first call.",
  },
];

export default function BookADemoPage() {
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK?.trim() || "";
  const hasCal = calLink.length > 0;

  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Book a WelloWork demo",
      url: `${SITE_URL}/book-a-demo`,
      description:
        "Schedule a 30-minute live demo of the WelloWork manager dashboard with realistic sample data from your industry.",
      potentialAction: {
        "@type": "ReserveAction",
        name: "Book a WelloWork demo",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/book-a-demo`,
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: "WelloWork product demo",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* Hero */}
      <section style={{ paddingTop: 48, paddingBottom: 20 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>
          <Reveal delay={1}>
            <div style={{ marginTop: 18 }}>
              <span className="eyebrow">Book a demo</span>
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
              See your team’s cognitive performance —{" "}
              <span className="italic-serif" style={{ color: "var(--accent)" }}>
                in one demo.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <div className="answer-block" style={{ maxWidth: "62ch" }}>
              <strong>A WelloWork demo is a 30-minute live walkthrough</strong> of the manager
              dashboard with realistic sample data from your industry. You see daily cognitive
              training, longitudinal trend monitoring, team composition signals, and biomarker
              completion — and we close with a short pilot-scoping chat. No fictional ROI charts.
            </div>
          </Reveal>
          <Reveal delay={3}>
            <p
              className="small"
              style={{
                marginTop: 18,
                display: "inline-flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
                color: "var(--ink-3)",
              }}
            >
              <span>Made in Sweden</span>
              <span aria-hidden="true">·</span>
              <span>GDPR-native</span>
              <span aria-hidden="true">·</span>
              <span>ISO 27001 in progress</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Scheduler */}
      <section id="scheduler" aria-labelledby="scheduler-heading" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: hasCal ? "1.4fr 1fr" : "1fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div>
                <h2
                  id="scheduler-heading"
                  className="h-card"
                  style={{ fontSize: 26, margin: "0 0 12px" }}
                >
                  Pick a time that works for you
                </h2>
                <p className="small" style={{ margin: "0 0 18px", maxWidth: "52ch" }}>
                  Your timezone is detected automatically. Choose a day, then a slot — you’ll
                  confirm details in the next step and receive a calendar invite immediately.
                </p>

                {hasCal ? (
                  <div
                    className="glass"
                    style={{
                      padding: 0,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <CalcomEmbed calLink={calLink} />
                  </div>
                ) : (
                  <DemoFallbackForm />
                )}
              </div>
            </Reveal>

            <Reveal delay={1}>
              <aside
                aria-label="What to expect"
                className="glass-strong"
                style={{ padding: "28px 28px", background: "rgba(255,255,255,0.78)" }}
              >
                <span className="eyebrow">What to expect</span>
                <h2 className="h-card" style={{ fontSize: 22, margin: "8px 0 16px" }}>
                  A focused 30 minutes — no fluff
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {EXPECT.map((e) => (
                    <li
                      key={e.title}
                      style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          width: 34,
                          height: 34,
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
                        <Icon name={e.icon} size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--ink-1)", fontSize: 14.5 }}>
                          {e.title}
                        </div>
                        <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
                          {e.body}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <hr className="hr-soft" style={{ margin: "20px 0" }} />
                <p className="small" style={{ margin: 0 }}>
                  Can’t find a slot that works?{" "}
                  <Link
                    href="/contact"
                    style={{ color: "var(--primary)", textDecoration: "underline" }}
                  >
                    Email the team
                  </Link>{" "}
                  and we’ll find one.
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What happens on the call */}
      <section aria-labelledby="agenda-heading" style={{ paddingTop: 16, paddingBottom: 56 }}>
        <div className="container">
          <Reveal>
            <h2
              id="agenda-heading"
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 38px)" }}
            >
              What happens on the call
            </h2>
            <p className="lede" style={{ margin: "0 0 28px" }}>
              The agenda is the same every time, so you know what you’re committing 30 minutes to.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ol
              aria-label="Demo call agenda"
              className="agenda-list"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              {AGENDA.map((step, i) => (
                <li
                  key={step.title}
                  className="glass lift"
                  style={{ padding: 22 }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      background:
                        "linear-gradient(135deg, color-mix(in oklch, var(--accent) 16%, white), color-mix(in oklch, var(--secondary) 65%, white))",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--primary)",
                      border: "1px solid rgba(255,255,255,0.7)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 17,
                      margin: "12px 0 6px",
                      color: "var(--ink-1)",
                    }}
                  >
                    <span style={{ color: "var(--ink-3)", fontSize: 11.5, display: "block", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                      {step.minutes}
                    </span>
                    {step.title}
                  </h3>
                  <p className="small" style={{ margin: 0 }}>
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Who should book */}
      <section aria-labelledby="audience-heading" style={{ paddingTop: 16, paddingBottom: 56 }}>
        <div className="container">
          <Reveal>
            <h2
              id="audience-heading"
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 38px)" }}
            >
              Who should book?
            </h2>
            <p className="lede" style={{ margin: "0 0 28px", maxWidth: "60ch" }}>
              The demo is built for the team that will own the rollout. Pick the framing that
              matches your role.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div
              className="grid grid-3"
              style={{ gap: 20 }}
            >
              {AUDIENCE.map((a) => (
                <article
                  key={a.title}
                  className="glass lift"
                  style={{ padding: 24 }}
                >
                  <span className="eyebrow" style={{ fontSize: 11 }}>{a.eyebrow}</span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 19,
                      margin: "10px 0 8px",
                      color: "var(--ink-1)",
                    }}
                  >
                    {a.title}
                  </h3>
                  <p className="small" style={{ margin: 0 }}>
                    {a.body}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" style={{ paddingTop: 16, paddingBottom: 72 }}>
        <div className="container">
          <Reveal>
            <h2
              id="faq-heading"
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 38px)" }}
            >
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
                maxWidth: 880,
              }}
            >
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="glass"
                  style={{ padding: "18px 22px" }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 17,
                      color: "var(--ink-1)",
                      listStyle: "none",
                    }}
                  >
                    <h3 style={{ display: "inline", margin: 0, fontSize: "inherit", fontWeight: "inherit", fontFamily: "inherit" }}>
                      {f.q}
                    </h3>
                  </summary>
                  <p className="body" style={{ margin: "10px 0 0", maxWidth: "62ch" }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Secondary CTA */}
      <section style={{ padding: "20px 0 80px" }}>
        <div className="container">
          <Reveal>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 32,
                padding: "40px 32px",
                background: `
                  radial-gradient(40% 60% at 8% 30%, color-mix(in oklch, var(--accent) 28%, transparent) 0%, transparent 60%),
                  radial-gradient(45% 70% at 95% 70%, color-mix(in oklch, var(--secondary-deep) 50%, transparent) 0%, transparent 65%),
                  linear-gradient(135deg, #FBFCFE 0%, #EEF3FE 100%)
                `,
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 18px 50px rgba(15,29,69,0.08)",
                display: "grid",
                gridTemplateColumns: "1.4fr auto",
                alignItems: "center",
                gap: 24,
              }}
              className="cta-row"
            >
              <div>
                <h2
                  className="h-section"
                  style={{ margin: "0 0 8px", fontSize: "clamp(22px, 2.6vw, 30px)" }}
                >
                  Not ready to pick a time?
                </h2>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  Prefer to talk first, or want to dig into the product on your own? We get it —
                  there’s no pressure to book today.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link href="/contact" className="btn btn-primary" style={{ background: "var(--navy)" }}>
                  Contact us <ArrowRight size={14} />
                </Link>
                <Link href="/#platform" className="btn btn-glass">
                  Explore the platform
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

const EXPECT = [
  {
    icon: "users",
    title: "Who joins",
    body: "A WelloWork product specialist — usually one person, never a sales team.",
  },
  {
    icon: "chart",
    title: "What we show",
    body: "Manager dashboard with sample data from your industry, employee app, and the privacy architecture.",
  },
  {
    icon: "calendar",
    title: "How long",
    body: "30 minutes — 20 minutes guided, 10 minutes questions and pilot scoping.",
  },
  {
    icon: "download",
    title: "What you leave with",
    body: "A short written summary, pilot pricing relevant to your headcount, and a no-pressure next step.",
  },
  {
    icon: "shield",
    title: "No pressure",
    body: "No follow-up cadence unless you ask. We treat employee data — and your time — the same way.",
  },
] as const;

const AGENDA = [
  {
    minutes: "0–5 min",
    title: "Intro & context",
    body: "Quick intros, current rituals you run, what you’re trying to learn from this call.",
  },
  {
    minutes: "5–20 min",
    title: "Manager dashboard",
    body: "Aggregated team trends, biomarker completion, composition signals — using sample data from your industry.",
  },
  {
    minutes: "20–25 min",
    title: "Employee privacy",
    body: "What employees see in their own app, and what the manager view does — and does not — surface.",
  },
  {
    minutes: "25–30 min",
    title: "Pilot scoping",
    body: "Headcount, rollout pace, whether workshops or biomarker sampling are in scope, and pricing.",
  },
] as const;

const AUDIENCE = [
  {
    eyebrow: "HR & People",
    title: "Build a longitudinal signal beyond engagement",
    body: "Pair your existing surveys with daily cognitive metrics and biomarker trends — without surfacing individual employee data to managers.",
  },
  {
    eyebrow: "Operations",
    title: "See team composition and load before output drops",
    body: "Anonymised composition signals and capacity trends, scoped to teams rather than individuals.",
  },
  {
    eyebrow: "Learning & Development",
    title: "Show training impact on real performance metrics",
    body: "Connect L&D programmes to longitudinal trend data, then layer in live workshops where they’ll move the needle.",
  },
] as const;
