import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/SiteShell";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { JsonLd } from "../components/JsonLd";
import { CTASection } from "../components/CTASection";
import { Icon } from "../components/Icons";
import { SITE_URL, buildMetadata, breadcrumbList } from "../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Research & methodology — cognitive constructs behind WelloWork",
  description:
    "WelloWork's cognitive training and assessments are built on validated constructs: working memory, processing speed, attention, problem solving, and cognitive flexibility.",
  path: "/research",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Research", href: "/research" },
];

const CONSTRUCTS = [
  {
    name: "Working memory",
    cap: "N-back, span tasks · Baddeley, 1992",
    body: "The capacity to hold and manipulate information in mind. Operationalised via N-back and span tasks with adaptive difficulty.",
  },
  {
    name: "Processing speed",
    cap: "Symbol substitution · Wechsler, classic",
    body: "How fast simple cognitive operations can be performed. Symbol-substitution paradigms; sensitive to sleep and fatigue.",
  },
  {
    name: "Attention",
    cap: "Sustained & selective · Posner paradigms",
    body: "Sustaining focus on a task and filtering distractors. Cued attention designs based on Posner-style paradigms.",
  },
  {
    name: "Problem solving",
    cap: "Tower & Raven-style reasoning",
    body: "Non-verbal reasoning under constraints. Adapted Raven progressive matrices and Tower problems.",
  },
  {
    name: "Cognitive flexibility",
    cap: "Task-switching costs · Monsell, 2003",
    body: "The ability to shift between rule sets. Task-switching designs, with switch-cost reduction tracked over time.",
  },
];

const SUBPAGES = [
  {
    href: "/research/methodology",
    icon: "search",
    title: "Methodology overview",
    body: "How exercises map to constructs, and our commitment to publishing methodology as pilot data is generated.",
  },
  {
    href: "/research/cognitive-constructs",
    icon: "brain",
    title: "Cognitive constructs",
    body: "Each of the five domains in detail — what they measure, what the literature says, and how WelloWork operationalises them.",
  },
  {
    href: "/research/science-insight",
    icon: "spark",
    title: "Science & insight",
    body: "Notes, write-ups, and methodology observations from the WelloWork research team.",
  },
  {
    href: "/research/privacy-by-design",
    icon: "lock",
    title: "Privacy by design",
    body: "How the platform separates individual employee data from manager-aggregated views — architecturally.",
  },
];

export default function ResearchPage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "WelloWork Research",
      url: `${SITE_URL}/research`,
      description:
        "Research hub for the cognitive constructs, methodology, and privacy architecture behind the WelloWork platform.",
      hasPart: SUBPAGES.map((s) => ({
        "@type": "WebPage",
        name: s.title,
        url: `${SITE_URL}${s.href}`,
      })),
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Research & evidence"
        title={
          <>
            Built on constructs the{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              field already validates.
            </span>
          </>
        }
        lede="Every cognitive exercise on the platform maps to a construct with a long literature — not an in-house metric we invented. We publish methodology as we generate pilot data."
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>What is the WelloWork research approach?</strong> WelloWork's training and
              assessments are built on five long-validated cognitive constructs — working
              memory, processing speed, attention, problem solving, and cognitive flexibility.
              We commit to publishing our methodology and pilot results, and we make no
              clinical or diagnostic claims about the biomarker side of the platform.
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 24px", fontSize: "clamp(26px,3.2vw,40px)" }}
            >
              Which cognitive constructs does WelloWork measure?
            </h2>
          </Reveal>
          <div className="glass" style={{ padding: 6, background: "rgba(255,255,255,0.6)" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {CONSTRUCTS.map((c, i) => (
                <li
                  key={c.name}
                  style={{
                    padding: "18px 20px",
                    display: "flex",
                    gap: 16,
                    borderBottom: i < CONSTRUCTS.length - 1 ? "1px solid rgba(15,29,69,0.06)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "linear-gradient(135deg, var(--accent), var(--primary))",
                      color: "white",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 17,
                        color: "var(--ink-1)",
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{c.cap}</div>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 14.5,
                        color: "var(--ink-2)",
                        lineHeight: 1.55,
                        maxWidth: "70ch",
                      }}
                    >
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 0 24px" }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 24px", fontSize: "clamp(26px,3.2vw,40px)" }}
            >
              Where can I read more?
            </h2>
          </Reveal>
          <div className="grid grid-2">
            {SUBPAGES.map((s, i) => (
              <Reveal key={s.href} delay={((i % 2) + 1) as 1 | 2}>
                <Link href={s.href} style={{ display: "block", height: "100%" }}>
                  <article
                    className="glass lift"
                    style={{
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background:
                          "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.7)",
                      }}
                    >
                      <Icon name={s.icon} size={22} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 19,
                        margin: 0,
                        color: "var(--ink-1)",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
                      {s.body}
                    </p>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Want to see this on real pilot data?"
        body="Bring your headcount and constraints — we'll walk you through methodology and the privacy model in the same call."
        primary={{ label: "Book a demo", href: "/book-a-demo" }}
        secondary={{ label: "Methodology overview", href: "/research/methodology" }}
      />
    </SiteShell>
  );
}
