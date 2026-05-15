import { Fragment } from "react";
import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Reveal } from "../../components/Reveal";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { PrivacyChip } from "../../components/Chips";
import { Icon } from "../../components/Icons";
import { FeatureGrid } from "../../components/FeatureGrid";
import { CTASection } from "../../components/CTASection";
import { JsonLd } from "../../components/JsonLd";
import { SITE_URL, SITE_NAME, buildMetadata, breadcrumbList } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Proactive Care — biomarker testing for longevity & health | WelloWork",
  description:
    "Blood panels for longevity markers and urine panels for general health and drug screening. Employees see their report; managers only see anonymised, aggregated trends.",
  path: "/platform/proactive-care",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/#platform" },
  { name: "Proactive Care", href: "/platform/proactive-care" },
];

export default function ProactiveCarePage() {
  const schema = [
    breadcrumbList(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWork Proactive Care — Biomarker sample testing",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Biomarker testing",
      areaServed: ["EU", "UK", "Nordics"],
      url: `${SITE_URL}/platform/proactive-care`,
      description:
        "Workplace biomarker sample testing for longevity, general health, and drug screening — with strict employee-data ownership.",
    },
  ];

  return (
    <SiteShell>
      <JsonLd schema={schema} />

      {/* HERO — two-column: copy left, biomarker report card right */}
      <section style={{ paddingTop: 48, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <Breadcrumbs items={CRUMBS} />
          </Reveal>

          <div
            className="hero-grid"
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "1fr 1.05fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <Reveal delay={1}>
                <div style={{ marginBottom: 14 }}>
                  <span className="eyebrow">Proactive Care</span>
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
                  Biomarker testing for longevity, health, and{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    drug screening.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  Blood panels for longevity markers and urine panels for general health and drug
                  screening. Employees see their full report. Managers only see anonymised,
                  aggregated trends.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <BiomarkerReportCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIRECT ANSWER */}
      <section style={{ paddingTop: 8, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>What is Proactive Care?</strong> Proactive Care is WelloWork&apos;s biomarker
              sample-testing service. Pilot engagements run on-site or via partnered labs, with
              blood panels focused on longevity-relevant markers (HbA1c, ApoB, hs-CRP, lipids,
              vitamin D, etc.) and urine panels for general health and substance screening.
              Employees own their report; managers see participation rates and high-level trends
              only.
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT DOES PROACTIVE CARE TEST? — two side-by-side panel cards */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 12px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              What does Proactive Care test?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 28px", maxWidth: "64ch" }}>
              Two panels, configured per engagement. Blood for longevity-relevant markers, urine
              for general-health and (where scoped) substance screening.
            </p>
          </Reveal>
          <div className="grid grid-2" style={{ gap: 20 }}>
            <Reveal delay={1}>
              <PanelCard
                tone="blood"
                icon="drop"
                eyebrow="Blood"
                title="Longevity panel"
                body="Metabolic, inflammatory, and cardiovascular markers commonly used in longevity-oriented preventive care."
                markers={["HbA1c", "ApoB", "hs-CRP", "Lipid sub-fractions", "Vitamin D", "CBC"]}
              />
            </Reveal>
            <Reveal delay={2}>
              <PanelCard
                tone="urine"
                icon="flask"
                eyebrow="Urine"
                title="General health & screening"
                body="Standard general-health markers plus, where scoped, substance-use screening configured to the customer's policy."
                markers={[
                  "Kidney function",
                  "Hydration",
                  "Glucose",
                  "Protein",
                  "Drug screen (optional)",
                ]}
              />
            </Reveal>
          </div>
          <Reveal delay={3}>
            <p
              className="small"
              style={{ margin: "22px 0 0", maxWidth: "70ch", fontStyle: "italic" }}
            >
              Note: WelloWork is not a clinical diagnostic service. Reports identify out-of-range
              markers and recommend follow-up with the employee&apos;s own physician. We do not
              diagnose conditions, and we do not provide medical advice.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHO SEES THE RESULTS — copy left, permission diagram right */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.05fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <Reveal>
                <h2
                  className="h-section"
                  style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
                >
                  Who sees the results?
                </h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  The employee is the only person who sees their full biomarker report. Managers
                  and HR see aggregated, anonymised trends across a minimum team size — never an
                  individual&apos;s values. This is a hard architectural rule of the platform, not
                  a policy someone can override.
                </p>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <RoleAccessDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IS IT RUN LOGISTICALLY — copy + horizontal flow */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              How is it run logistically?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 32px", maxWidth: "64ch" }}>
              Sample collection runs on-site for larger pilots, or via partnered labs near the
              employee. Sample chain-of-custody and lab handling follow the standard practice of
              the accredited lab partner used in that geography. Drug-screening scope is
              configured per customer policy and consented to per-employee before the sample is
              taken.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <LogisticsFlow />
          </Reveal>
        </div>
      </section>

      {/* WHY TESTING AS PART OF A PERFORMANCE PLATFORM — copy + split before/after */}
      <section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              Why testing as part of a performance platform?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 28px", maxWidth: "64ch" }}>
              A small number of biomarkers materially bend cognitive performance over time — sleep
              architecture (proxied via metabolic markers), glucose variability, inflammation, and
              basic micronutrient status. Treating biomarker data as part of the same longitudinal
              view as cognitive training and assessments lets employees and their physicians act
              on it, rather than discovering it once a year at a physical.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <SiloVsLongitudinal />
          </Reveal>
        </div>
      </section>

      <FeatureGrid
        eyebrow="What's included"
        title="What does a Proactive Care engagement ship with?"
        items={[
          {
            icon: "drop",
            title: "Longevity blood panel",
            body: "A configurable panel of longevity-relevant markers, drawn on-site or via partnered labs.",
          },
          {
            icon: "flask",
            title: "Urine health & screening",
            body: "General-health markers plus, where scoped, drug screening configured per customer policy.",
          },
          {
            icon: "shield",
            title: "Employee-owned reports",
            body: "Only the employee sees their results. They can share with their physician, export, or request deletion.",
          },
          {
            icon: "users",
            title: "Aggregated manager view",
            body: "Managers see participation rates and anonymised, aggregated trends — never an individual value.",
          },
          {
            icon: "chart",
            title: "Linked to performance trends",
            body: "Where the employee consents, biomarker data is annotated on their own cognitive trend view.",
          },
          {
            icon: "lock",
            title: "Lab-grade chain of custody",
            body: "Sample handling and chain-of-custody follow the accredited lab partner's standard practice in each geography.",
          },
        ]}
      />

      <CTASection
        title="Scope a Proactive Care engagement."
        body="Panels, geographies, and screening scope are confirmed in a scoping call. Pilots typically combine biomarker testing with Workshops in the Platform + Services tier."
        primary={{ label: "Book a scoping call", href: "/book-a-demo" }}
        secondary={{ label: "Talk to sales", href: "/contact" }}
      />
    </SiteShell>
  );
}

/* ─── Visual mocks ────────────────────────────────────────────────────────── */

type Marker = {
  label: string;
  /** 0–100 — position of the dot along the bar */
  value: number;
  /** [min, max] — healthy range as a 0–100 range to shade */
  healthy: [number, number];
};

const MARKERS: ReadonlyArray<Marker> = [
  { label: "HbA1c", value: 38, healthy: [25, 55] },
  { label: "ApoB", value: 78, healthy: [20, 60] },
  { label: "hs-CRP", value: 72, healthy: [15, 55] },
  { label: "Vitamin D", value: 32, healthy: [40, 80] },
  { label: "Lipids", value: 50, healthy: [30, 65] },
];

function BiomarkerReportCard() {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: -30,
          zIndex: -1,
          opacity: 0.4,
          background:
            "radial-gradient(60% 60% at 60% 40%, color-mix(in oklch, var(--accent) 24%, transparent), transparent 70%)",
        }}
      />
      <div
        className="glass-strong"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "linear-gradient(160deg, rgba(255,255,255,0.82), rgba(255,255,255,0.6))",
        }}
      >
        {/* Card chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid rgba(15,29,69,0.08)",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "linear-gradient(135deg, var(--accent), var(--primary))",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              JK
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>
                Jordan K.
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Marketing Lead</div>
            </div>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            Sample data
          </span>
        </div>

        <div
          style={{
            padding: "18px 20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>
              Biomarker report · Q2
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 100,
                background: "color-mix(in oklch, #F59E0B 14%, white)",
                border: "1px solid color-mix(in oklch, #F59E0B 30%, transparent)",
                color: "#92400E",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#F59E0B",
                }}
              />
              2 markers need attention
            </span>
          </div>

          <div
            style={{
              padding: "16px 14px 12px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(15,29,69,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr",
                gap: 10,
                alignItems: "center",
                fontSize: 9.5,
                fontWeight: 600,
                color: "var(--ink-3)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                paddingBottom: 4,
                borderBottom: "1px dashed rgba(15,29,69,0.10)",
              }}
            >
              <span>Marker</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingRight: 4,
                }}
              >
                <span>Low</span>
                <span>Healthy range</span>
                <span>High</span>
              </div>
            </div>
            {MARKERS.map((m) => {
              const outOfRange =
                m.value < m.healthy[0] || m.value > m.healthy[1];
              return (
                <div
                  key={m.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "70px 1fr",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: outOfRange ? "#92400E" : "var(--ink-1)",
                    }}
                  >
                    {m.label}
                  </span>
                  <BiomarkerBar marker={m} outOfRange={outOfRange} />
                </div>
              );
            })}
          </div>

          <PrivacyChip>Employee owns this report · GDPR export available</PrivacyChip>
        </div>
      </div>
    </div>
  );
}

function BiomarkerBar({ marker, outOfRange }: { marker: Marker; outOfRange: boolean }) {
  const [lo, hi] = marker.healthy;
  return (
    <div
      style={{
        position: "relative",
        height: 12,
        borderRadius: 999,
        background: "rgba(15,29,69,0.06)",
        border: "1px solid rgba(15,29,69,0.06)",
      }}
    >
      {/* healthy band */}
      <div
        style={{
          position: "absolute",
          left: `${lo}%`,
          width: `${hi - lo}%`,
          top: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, color-mix(in oklch, var(--success) 25%, transparent), color-mix(in oklch, var(--success) 35%, transparent))",
          borderRadius: 999,
        }}
      />
      {/* value dot */}
      <div
        style={{
          position: "absolute",
          left: `calc(${marker.value}% - 7px)`,
          top: "50%",
          transform: "translateY(-50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: outOfRange ? "#F59E0B" : "var(--primary)",
          border: "2px solid white",
          boxShadow: outOfRange
            ? "0 0 0 3px color-mix(in oklch, #F59E0B 30%, transparent)"
            : "0 2px 5px rgba(15,29,69,0.18)",
        }}
      />
    </div>
  );
}

function PanelCard({
  tone,
  icon,
  eyebrow,
  title,
  body,
  markers,
}: {
  tone: "blood" | "urine";
  icon: string;
  eyebrow: string;
  title: string;
  body: string;
  markers: string[];
}) {
  const bg =
    tone === "blood"
      ? "linear-gradient(160deg, color-mix(in oklch, var(--accent) 9%, white), rgba(255,255,255,0.6))"
      : "linear-gradient(160deg, color-mix(in oklch, var(--secondary-deep) 28%, white), rgba(255,255,255,0.6))";
  const borderTint =
    tone === "blood"
      ? "color-mix(in oklch, var(--accent) 22%, var(--glass-border))"
      : "color-mix(in oklch, var(--secondary-deep) 38%, var(--glass-border))";
  return (
    <article
      className="glass lift"
      style={{
        padding: 26,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 240,
        background: bg,
        borderColor: borderTint,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          <Icon name={icon} size={22} />
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--primary)",
          }}
        >
          {eyebrow}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 22,
          lineHeight: 1.25,
          letterSpacing: "-0.015em",
          margin: 0,
          color: "var(--ink-1)",
        }}
      >
        {title}
      </h3>
      <p className="body" style={{ margin: 0, fontSize: 14.5 }}>
        {body}
      </p>
      <div
        style={{
          marginTop: 6,
          paddingTop: 14,
          borderTop: "1px dashed rgba(15,29,69,0.12)",
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {markers.map((m) => (
          <span
            key={m}
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              padding: "5px 10px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(15,29,69,0.10)",
              color: "var(--primary)",
              letterSpacing: "0.01em",
            }}
          >
            {m}
          </span>
        ))}
      </div>
    </article>
  );
}

function RoleAccessDiagram() {
  const rows: ReadonlyArray<{
    role: string;
    detail: string;
    cells: Array<"dot" | "lock" | "agg" | "trend">;
  }> = [
    {
      role: "Employee",
      detail: "Full report — every marker visible",
      cells: ["dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot"],
    },
    {
      role: "Manager / HR",
      detail: "Aggregated trends across a minimum team size",
      cells: ["lock", "lock", "agg", "lock", "lock", "agg", "lock", "agg"],
    },
    {
      role: "WelloWork",
      detail: "Anonymised, cohort-level trend only",
      cells: ["lock", "lock", "lock", "lock", "lock", "lock", "trend", "lock"],
    },
  ];

  return (
    <div
      className="glass-strong"
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          What each role sees
        </span>
        <PrivacyChip>Architectural — not a policy override</PrivacyChip>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((row) => (
          <div
            key={row.role}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: 14,
              alignItems: "center",
              padding: "12px 14px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(15,29,69,0.08)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink-1)",
                }}
              >
                {row.role}
              </span>
              <span style={{ fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.35 }}>
                {row.detail}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 6,
                alignItems: "center",
              }}
            >
              {row.cells.map((c, i) => (
                <AccessCell key={i} kind={c} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          paddingTop: 6,
          fontSize: 10.5,
          color: "var(--ink-3)",
        }}
      >
        <LegendItem kind="dot" label="Marker visible" />
        <LegendItem kind="lock" label="Hidden" />
        <LegendItem kind="agg" label="Aggregated" />
        <LegendItem kind="trend" label="Cohort trend" />
      </div>
    </div>
  );
}

function AccessCell({ kind }: { kind: "dot" | "lock" | "agg" | "trend" }) {
  const size = 26;
  if (kind === "dot") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "color-mix(in oklch, var(--accent) 18%, white)",
          border: "1.5px solid var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Visible marker"
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--accent)",
          }}
        />
      </div>
    );
  }
  if (kind === "agg") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: "color-mix(in oklch, var(--primary) 10%, white)",
          border: "1.5px solid color-mix(in oklch, var(--primary) 35%, transparent)",
          color: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.04em",
        }}
        aria-label="Aggregated"
      >
        AGG
      </div>
    );
  }
  if (kind === "trend") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: "color-mix(in oklch, var(--success) 14%, white)",
          border: "1.5px solid color-mix(in oklch, var(--success) 40%, transparent)",
          color: "var(--success)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Anonymised cohort trend"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 12 L6 8 L9 10 L14 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: "rgba(15,29,69,0.05)",
        border: "1.5px solid rgba(15,29,69,0.12)",
        color: "rgba(15,29,69,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Hidden"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 11V8a5 5 0 0110 0v3 M5 11h14v10H5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function LegendItem({
  kind,
  label,
}: {
  kind: "dot" | "lock" | "agg" | "trend";
  label: string;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ transform: "scale(0.7)", transformOrigin: "left center" }}>
        <AccessCell kind={kind} />
      </span>
      {label}
    </span>
  );
}

function LogisticsFlow() {
  const steps: ReadonlyArray<{
    icon: React.ReactNode;
    title: string;
    body: string;
    note?: string;
  }> = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 3s-6 7-6 12a6 6 0 0012 0c0-5-6-12-6-12z" stroke="url(#grad-step)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ),
      title: "Sample collected",
      body: "On-site for pilots, or via a partnered lab near the employee.",
      note: "Per-employee consent before any sample is taken.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 11V8a5 5 0 0110 0v3 M5 11h14v10H5z M12 15v3"
            stroke="url(#grad-step)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: "Chain-of-custody processing",
      body: "Accredited lab partner handles sample, processing, and reporting in their standard practice.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16v12H4z M4 10h16 M9 14h6"
            stroke="url(#grad-step)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: "Employee receives report",
      body: "Only the employee. They can share with their physician, export, or request deletion.",
    },
  ];

  return (
    <div
      className="glass-strong"
      style={{
        padding: "26px 24px 22px",
        background: "linear-gradient(160deg, rgba(255,255,255,0.82), rgba(255,255,255,0.6))",
      }}
    >
      {/* shared gradient for step icons */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="grad-step" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="logistics-flow"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        {steps.map((s, i) => (
          <Fragment key={s.title}>
            <LogisticsStep index={i + 1} {...s} />
            {i < steps.length - 1 && (
              <div
                aria-hidden="true"
                className="logistics-arrow"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "color-mix(in oklch, var(--accent) 60%, transparent)",
                }}
              >
                <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
                  <line
                    x1="0"
                    y1="7"
                    x2="28"
                    y2="7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M26 2 L34 7 L26 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function LogisticsStep({
  index,
  icon,
  title,
  body,
  note,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  body: string;
  note?: string;
}) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 16,
        background: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(15,29,69,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
            border: "1px solid rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "var(--ink-3)",
          }}
        >
          STEP {index}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 16,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          margin: 0,
          color: "var(--ink-1)",
        }}
      >
        {title}
      </h3>
      <p
        className="body"
        style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}
      >
        {body}
      </p>
      {note && (
        <span
          style={{
            marginTop: 4,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            alignSelf: "flex-start",
            padding: "5px 10px",
            borderRadius: 100,
            background: "color-mix(in oklch, var(--accent) 12%, white)",
            border: "1px solid color-mix(in oklch, var(--accent) 24%, transparent)",
            color: "var(--primary)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12l5 5L20 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {note}
        </span>
      )}
    </div>
  );
}

function SiloVsLongitudinal() {
  return (
    <div
      className="hero-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 56px 1fr",
        gap: 16,
        alignItems: "stretch",
      }}
    >
      {/* Left — siloed annual physical */}
      <div
        style={{
          padding: 26,
          borderRadius: 20,
          background: "linear-gradient(160deg, rgba(15,29,69,0.04), rgba(15,29,69,0.02))",
          border: "1px solid rgba(15,29,69,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Annual physical
        </span>
        <div style={{ padding: "12px 0 6px" }}>
          <svg viewBox="0 0 240 80" style={{ width: "100%", height: 80 }}>
            <line x1="0" x2="240" y1="60" y2="60" stroke="rgba(15,29,69,0.10)" />
            {/* Single, isolated data point */}
            <circle cx="120" cy="36" r="6" fill="rgba(15,29,69,0.35)" />
            <circle cx="120" cy="36" r="14" fill="none" stroke="rgba(15,29,69,0.18)" strokeDasharray="2 3" />
            <text
              x="120"
              y="22"
              fontSize="10"
              textAnchor="middle"
              fill="rgba(15,29,69,0.55)"
              fontWeight="600"
            >
              One reading
            </text>
            {/* Year markers — vast empty space */}
            {["Jan", "Apr", "Jul", "Oct", "Dec"].map((m, i) => (
              <text
                key={m}
                x={20 + i * 50}
                y="74"
                fontSize="9"
                textAnchor="middle"
                fill="rgba(15,29,69,0.35)"
              >
                {m}
              </text>
            ))}
          </svg>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink-2)",
            lineHeight: 1.5,
          }}
        >
          Once a year, no longitudinal context.
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55 }}>
          Discovered too late.
        </div>
      </div>

      {/* VS divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "white",
            border: "1px solid rgba(15,29,69,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--ink-2)",
            boxShadow: "0 4px 14px rgba(15,29,69,0.06)",
          }}
        >
          VS
        </div>
      </div>

      {/* Right — WelloWork longitudinal view */}
      <div
        style={{
          padding: 26,
          borderRadius: 20,
          background:
            "linear-gradient(160deg, color-mix(in oklch, var(--accent) 10%, white), color-mix(in oklch, var(--secondary) 70%, white))",
          border: "1px solid color-mix(in oklch, var(--accent) 25%, var(--glass-border))",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--primary)",
          }}
        >
          WelloWork view
        </span>
        <div style={{ padding: "12px 0 6px" }}>
          <svg viewBox="0 0 240 80" style={{ width: "100%", height: 80 }}>
            <defs>
              <linearGradient id="svlArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="svlCog" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" x2="240" y1="60" y2="60" stroke="rgba(15,29,69,0.08)" />

            {/* Cognitive baseline — softer line behind */}
            <path
              d="M 6 50 L 36 48 L 66 46 L 96 42 L 126 38 L 156 34 L 186 30 L 216 26 L 234 22 L 234 60 L 6 60 Z"
              fill="url(#svlCog)"
            />
            <path
              d="M 6 50 L 36 48 L 66 46 L 96 42 L 126 38 L 156 34 L 186 30 L 216 26 L 234 22"
              stroke="var(--primary)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.45"
              strokeDasharray="3 3"
            />

            {/* Biomarker sparkline — primary trend */}
            <path
              d="M 6 56 L 36 50 L 66 46 L 96 40 L 126 34 L 156 28 L 186 22 L 216 14 L 234 10 L 234 60 L 6 60 Z"
              fill="url(#svlArea)"
            />
            <path
              d="M 6 56 L 36 50 L 66 46 L 96 40 L 126 34 L 156 28 L 186 22 L 216 14 L 234 10"
              stroke="var(--accent)"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              [6, 56],
              [66, 46],
              [126, 34],
              [186, 22],
              [234, 10],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i === 4 ? 3.8 : 2.2}
                fill={i === 4 ? "var(--accent)" : "white"}
                stroke="var(--accent)"
                strokeWidth="1.4"
              />
            ))}
            {/* Up-arrow at tip */}
            <g transform="translate(220 -2)">
              <circle cx="14" cy="10" r="9" fill="white" stroke="var(--success)" strokeWidth="1.4" />
              <path
                d="M14 14 V6 M10 9 L14 5 L18 9"
                stroke="var(--success)"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--primary)",
            lineHeight: 1.5,
          }}
        >
          Biomarkers + cognitive data — continuous, actionable.
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--primary)",
            opacity: 0.85,
            lineHeight: 1.55,
            fontWeight: 500,
          }}
        >
          Act on it now.
        </div>
      </div>
    </div>
  );
}
