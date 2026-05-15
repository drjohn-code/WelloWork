import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { Reveal } from "../../components/Reveal";
import { Breadcrumbs } from "../../components/Breadcrumbs";
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

      {/* HERO — two-column: copy left, booking card mock right */}
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
                  <span className="eyebrow">Workshops</span>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <h1
                  className="h-section"
                  style={{ margin: "0 0 18px", maxWidth: "22ch", fontSize: "clamp(34px, 5vw, 58px)" }}
                >
                  Live health workshops, on-site or{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    remote.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  Facilitator-led sessions on the cognitive performance and longevity themes that
                  compound — sleep, nutrition, recovery, focus. Booked in the platform; outcomes
                  flow back into performance trends.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <BookingMockCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIRECT ANSWER */}
      <section style={{ paddingTop: 8, paddingBottom: 24 }}>
        <div className="container">
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              <strong>What are WelloWork workshops?</strong> They&apos;re live, facilitator-led
              sessions for employees — on-site or remote — covering sleep architecture, nutrition
              for cognitive performance, stress and focus, and longevity basics. Bookings,
              attendance, and follow-ups happen inside the same platform that runs daily training
              and performance trends.
            </div>
          </Reveal>
        </div>
      </section>

      {/* TOPIC CARDS — replaces the bullet list */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 24px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              Which workshops are available?
            </h2>
          </Reveal>
          <div
            className="topic-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            {TOPICS.map((t, i) => (
              <Reveal key={t.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <TopicCard title={t.title} body={t.body} Icon={t.Icon} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CADENCE COMPARISON */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 12px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              How is this different from a one-off speaker?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 24px", maxWidth: "64ch" }}>
              The content of a one-off speaker doesn&apos;t compound. Workshops here are scheduled
              in a cadence that matches each customer&apos;s pilot, with attendance and follow-up
              actions captured back in the platform. A workshop on sleep in May links forward into
              a recovery-flagged dip in July — not a vague memory from a Tuesday afternoon.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <CadenceCompare />
          </Reveal>
        </div>
      </section>

      {/* ON-SITE OR REMOTE */}
      <section style={{ paddingTop: 32, paddingBottom: 32 }}>
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
            <div>
              <Reveal>
                <h2
                  className="h-section"
                  style={{ margin: "0 0 14px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
                >
                  On-site or remote?
                </h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  Both. Most pilots run a mix — on-site for the Nordics, remote for distributed
                  teams elsewhere. Facilitators are reviewed annually and aligned with the
                  platform&apos;s broader methodology.
                </p>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <DeliveryToggle />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SCOPING FLOW */}
      <section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <div className="container">
          <Reveal>
            <h2
              className="h-section"
              style={{ margin: "0 0 12px", fontSize: "clamp(26px, 3.2vw, 36px)" }}
            >
              Scoping
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 28px", maxWidth: "64ch" }}>
              Workshops are scoped per engagement — facilitator availability, location, language,
              and follow-up cadence are confirmed in a scoping call. They&apos;re included in the
              Platform + Services tier alongside biomarker testing.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <ScopingFlow />
          </Reveal>
        </div>
      </section>

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

/* ─── Visuals ────────────────────────────────────────────────────────────── */

function BookingMockCard() {
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
          background: "linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.62))",
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
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-hidden="true"
            >
              <MoonIcon size={15} stroke="white" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
                Workshop
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>
                Sleep Architecture &amp; Recovery
              </div>
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
            Sample
          </span>
        </div>

        <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Date/time slot rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}
            >
              Pick a session
            </span>

            <SlotRow
              date="Thu · 4 Jun"
              time="09:30 CET"
              tag="On-site · Stockholm"
              tagIcon="building"
              selected
            />
            <SlotRow
              date="Tue · 9 Jun"
              time="14:00 CET"
              tag="Remote · Zoom"
              tagIcon="laptop"
            />
          </div>

          {/* Avatars row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingTop: 4,
            }}
          >
            <div style={{ display: "flex" }}>
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: a.bg,
                    color: "white",
                    border: "2px solid white",
                    marginLeft: i === 0 ? 0 : -8,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    boxShadow: "0 1px 3px rgba(15,29,69,0.10)",
                  }}
                  aria-hidden="true"
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500 }}>
              +12 enrolled
            </span>
          </div>

          {/* Book button */}
          <button
            type="button"
            style={{
              marginTop: 4,
              width: "100%",
              padding: "13px 18px",
              borderRadius: 14,
              background: "var(--primary)",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.01em",
              boxShadow: "0 8px 22px color-mix(in oklch, var(--primary) 32%, transparent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Book session
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const AVATARS: ReadonlyArray<{ initials: string; bg: string }> = [
  { initials: "AS", bg: "linear-gradient(135deg, #5C73FB, #162B5C)" },
  { initials: "MK", bg: "linear-gradient(135deg, #8A9CFD, #5C73FB)" },
  { initials: "EL", bg: "linear-gradient(135deg, #BBD1F0, #5C73FB)" },
  { initials: "JN", bg: "linear-gradient(135deg, #162B5C, #5C73FB)" },
  { initials: "RP", bg: "linear-gradient(135deg, #5C73FB, #8A9CFD)" },
];

function SlotRow({
  date,
  time,
  tag,
  tagIcon,
  selected = false,
}: {
  date: string;
  time: string;
  tag: string;
  tagIcon: "building" | "laptop";
  selected?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 12,
        alignItems: "center",
        padding: "11px 14px",
        borderRadius: 12,
        background: selected
          ? "color-mix(in oklch, var(--accent) 12%, white)"
          : "rgba(255,255,255,0.7)",
        border: selected
          ? "1.5px solid color-mix(in oklch, var(--accent) 55%, transparent)"
          : "1px solid rgba(15,29,69,0.10)",
        boxShadow: selected
          ? "0 4px 14px color-mix(in oklch, var(--accent) 18%, transparent)"
          : "none",
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: selected
            ? "5px solid var(--accent)"
            : "1.5px solid rgba(15,29,69,0.25)",
          background: selected ? "white" : "transparent",
          display: "inline-block",
        }}
        aria-hidden="true"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>
          {date} · <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{time}</span>
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: selected ? "var(--primary)" : "var(--ink-3)",
            fontWeight: 500,
          }}
        >
          {tagIcon === "building" ? <BuildingIcon size={11} /> : <LaptopIcon size={11} />}
          {tag}
        </span>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: selected ? "var(--accent)" : "var(--ink-3)",
        }}
      >
        {selected ? "Selected" : "Open"}
      </span>
    </div>
  );
}

/* Topic cards */

type TopicDef = {
  title: string;
  body: string;
  Icon: (props: { size?: number }) => React.ReactElement;
};

const TOPICS: ReadonlyArray<TopicDef> = [
  {
    title: "Sleep architecture",
    body: "Stages, recovery, and how to protect deep sleep.",
    Icon: MoonIcon,
  },
  {
    title: "Nutrition for focus",
    body: "Fuelling cognitive performance through the day.",
    Icon: ForkIcon,
  },
  {
    title: "Cognitive load",
    body: "Stress, attention, and the limits of working memory.",
    Icon: BrainIcon,
  },
  {
    title: "Longevity basics",
    body: "Metabolic health for the long arc, not the quarter.",
    Icon: ClockIcon,
  },
  {
    title: "Desk-bound movement",
    body: "Recovery routines for screen-heavy roles.",
    Icon: ChairIcon,
  },
];

function TopicCard({
  title,
  body,
  Icon,
}: {
  title: string;
  body: string;
  Icon: (props: { size?: number }) => React.ReactElement;
}) {
  return (
    <article
      className="glass lift"
      style={{
        padding: 22,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background:
          "linear-gradient(160deg, color-mix(in oklch, var(--accent) 10%, white), color-mix(in oklch, var(--secondary) 50%, white))",
        border: "1px solid color-mix(in oklch, var(--accent) 18%, var(--glass-border))",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "white",
          border: "1px solid color-mix(in oklch, var(--accent) 22%, transparent)",
          color: "var(--primary)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(15,29,69,0.06)",
        }}
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 16.5,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          margin: 0,
          color: "var(--ink-1)",
        }}
      >
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-2)" }}>
        {body}
      </p>
    </article>
  );
}

/* Cadence comparison — one-off vs WelloWork timeline */

function CadenceCompare() {
  return (
    <div
      className="glass-strong"
      style={{
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        background: "linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
      }}
    >
      <CadenceRow
        label="One-off speaker"
        sublabel="Forgotten by Tuesday"
        muted
        points={[{ x: 50, label: "" }]}
      />
      <div style={{ height: 1, background: "rgba(15,29,69,0.08)" }} />
      <CadenceRow
        label="WelloWork workshop"
        sublabel="Compounds over time"
        muted={false}
        points={[
          { x: 12, label: "May" },
          { x: 38, label: "Jul" },
          { x: 64, label: "Sep" },
          { x: 90, label: "Nov" },
        ]}
        trendUp
      />
    </div>
  );
}

function CadenceRow({
  label,
  sublabel,
  muted,
  points,
  trendUp = false,
}: {
  label: string;
  sublabel: string;
  muted: boolean;
  points: ReadonlyArray<{ x: number; label: string }>;
  trendUp?: boolean;
}) {
  const dotColor = muted ? "rgba(15,29,69,0.30)" : "var(--accent)";
  const lineColor = muted ? "rgba(15,29,69,0.18)" : "var(--accent)";
  const labelColor = muted ? "var(--ink-3)" : "var(--primary)";

  return (
    <div
      className="cadence-row"
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 24,
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: labelColor,
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.4 }}>
          {sublabel}
        </span>
      </div>

      <div style={{ position: "relative", paddingTop: 18, paddingBottom: 22 }}>
        <svg viewBox="0 0 100 28" preserveAspectRatio="none" style={{ width: "100%", height: 28, display: "block", overflow: "visible" }}>
          {/* Connecting line */}
          {points.length > 1 ? (
            <line
              x1={points[0].x}
              x2={points[points.length - 1].x}
              y1="14"
              y2="14"
              stroke={lineColor}
              strokeWidth="1.4"
              strokeDasharray={muted ? "0" : "0"}
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <line
              x1="0"
              x2="100"
              y1="14"
              y2="14"
              stroke="rgba(15,29,69,0.10)"
              strokeWidth="1"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy="14"
              r={muted ? 2.6 : 3}
              fill={dotColor}
              stroke="white"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {trendUp && (
            <g transform="translate(94, 8)">
              <path
                d="M0 6 L4 0 L8 6"
                stroke="var(--success)"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="4"
                x2="4"
                y1="0"
                y2="10"
                stroke="var(--success)"
                strokeWidth="1.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )}
        </svg>

        {/* Point labels */}
        {points[0].label && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "calc(50% + 12px)",
              pointerEvents: "none",
            }}
          >
            {points.map((p) => (
              <span
                key={p.label}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  transform: "translateX(-50%)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--ink-2)",
                  letterSpacing: "0.02em",
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Delivery toggle + map hint */

function DeliveryToggle() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          padding: 6,
          borderRadius: 100,
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(15,29,69,0.10)",
          boxShadow: "0 6px 18px rgba(15,29,69,0.06)",
        }}
      >
        <DeliveryHalf icon={<BuildingIcon size={16} />} label="On-site" />
        <DeliveryHalf icon={<LaptopIcon size={16} />} label="Remote" />
      </div>
      <div
        style={{
          padding: 18,
          borderRadius: 18,
          background:
            "linear-gradient(160deg, color-mix(in oklch, var(--accent) 6%, white), rgba(255,255,255,0.65))",
          border: "1px solid color-mix(in oklch, var(--accent) 18%, var(--glass-border))",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Where we run
        </span>
        <MapBlob />
      </div>
    </div>
  );
}

function DeliveryHalf({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 100,
        background: "color-mix(in oklch, var(--accent) 14%, white)",
        color: "var(--primary)",
        fontSize: 13.5,
        fontWeight: 600,
        border: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
      }}
    >
      {icon}
      {label}
    </div>
  );
}

function MapBlob() {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox="0 0 320 130" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="blobGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="color-mix(in oklch, var(--accent) 22%, white)" />
            <stop offset="100%" stopColor="color-mix(in oklch, var(--secondary) 70%, white)" />
          </linearGradient>
        </defs>

        {/* Abstract Nordics blob */}
        <path
          d="M 60 38 C 38 28, 28 62, 50 72 C 36 86, 64 104, 86 96 C 94 110, 130 104, 128 84 C 152 86, 150 56, 130 50 C 134 30, 96 22, 84 36 C 76 28, 64 28, 60 38 Z"
          fill="url(#blobGrad)"
          stroke="color-mix(in oklch, var(--accent) 30%, transparent)"
          strokeWidth="1"
        />

        {/* Distributed blob */}
        <path
          d="M 200 32 C 180 28, 170 54, 192 60 C 178 76, 206 92, 232 86 C 244 102, 280 96, 286 78 C 308 78, 308 56, 288 50 C 296 32, 256 22, 240 34 C 226 26, 210 24, 200 32 Z"
          fill="rgba(255,255,255,0.7)"
          stroke="rgba(15,29,69,0.12)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Nordics pin */}
        <Pin x={92} y={62} primary />
        <text x={92} y={106} fontSize="10" textAnchor="middle" fill="var(--primary)" fontWeight="700" letterSpacing="0.04em">
          NORDICS
        </text>

        {/* Distributed pin */}
        <Pin x={246} y={60} />
        <text x={246} y={106} fontSize="10" textAnchor="middle" fill="rgba(15,29,69,0.55)" fontWeight="700" letterSpacing="0.04em">
          DISTRIBUTED
        </text>
      </svg>
    </div>
  );
}

function Pin({ x, y, primary = false }: { x: number; y: number; primary?: boolean }) {
  const color = primary ? "var(--accent)" : "rgba(15,29,69,0.55)";
  return (
    <g>
      <circle cx={x} cy={y} r="8" fill={color} opacity="0.18" />
      <circle cx={x} cy={y} r="4" fill={color} />
      <circle cx={x} cy={y} r="1.6" fill="white" />
    </g>
  );
}

/* Scoping flow — 3 steps */

function ScopingFlow() {
  return (
    <div
      className="scoping-flow"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 28px 1fr 28px 1fr",
        gap: 12,
        alignItems: "stretch",
      }}
    >
      <ScopingStep n={1} title="Scoping call" body="Headcount, locations, languages, constraints." icon={<PhoneIcon size={20} />} />
      <FlowConnector />
      <ScopingStep n={2} title="Facilitator matched" body="Topic and cadence aligned with the right lead." icon={<PersonIcon size={20} />} />
      <FlowConnector />
      <ScopingStep n={3} title="Sessions scheduled" body="Bookable in-platform; follow-ups wired to trends." icon={<CalendarIcon size={20} />} />
    </div>
  );
}

function ScopingStep({
  n,
  title,
  body,
  icon,
}: {
  n: number;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="glass lift"
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "var(--primary)",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {n}
        </span>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: "color-mix(in oklch, var(--accent) 12%, white)",
            border: "1px solid color-mix(in oklch, var(--accent) 24%, transparent)",
            color: "var(--primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 16,
          margin: 0,
          color: "var(--ink-1)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--ink-2)" }}>
        {body}
      </p>
    </div>
  );
}

function FlowConnector() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
    >
      <svg width="28" height="14" viewBox="0 0 28 14" style={{ display: "block" }}>
        <line
          x1="0"
          x2="22"
          y1="7"
          y2="7"
          stroke="color-mix(in oklch, var(--accent) 45%, transparent)"
          strokeWidth="1.5"
          strokeDasharray="2 3"
          strokeLinecap="round"
        />
        <path
          d="M20 3 L26 7 L20 11"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ─── Inline icons (topic + UI) ──────────────────────────────────────────── */

type IconLineProps = { size?: number; stroke?: string };

function strokeProps(stroke = "currentColor") {
  return {
    stroke,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none" as const,
  };
}

function MoonIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" {...strokeProps(stroke)} />
    </svg>
  );
}

function ForkIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3v6a3 3 0 0 0 3 3v9 M5 3v6 M11 3v6 M17 3v18 M17 14h3a0 0 0 0 0 0 0c0-5-3-11-3-11" {...strokeProps(stroke)} />
    </svg>
  );
}

function BrainIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 5a2.5 2.5 0 0 0-2.5 2.5v.5A2.5 2.5 0 0 0 5 10.5 2.5 2.5 0 0 0 6.5 13a2.5 2.5 0 0 0 0 4A2.5 2.5 0 0 0 9 19.5 2.5 2.5 0 0 0 12 22V5a2.5 2.5 0 0 0-3-0z M15 5a2.5 2.5 0 0 1 2.5 2.5v.5A2.5 2.5 0 0 1 19 10.5 2.5 2.5 0 0 1 17.5 13a2.5 2.5 0 0 1 0 4A2.5 2.5 0 0 1 15 19.5 2.5 2.5 0 0 1 12 22"
        {...strokeProps(stroke)}
      />
    </svg>
  );
}

function ClockIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...strokeProps(stroke)} />
      <path d="M12 7v5l3 2" {...strokeProps(stroke)} />
    </svg>
  );
}

function ChairIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4v9h12V4 M5 13h14l-1 4H6l-1-4z M8 17v4 M16 17v4" {...strokeProps(stroke)} />
    </svg>
  );
}

function BuildingIcon({ size = 14, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21V5l8-2 8 2v16 M4 21h16 M9 9h.01 M9 13h.01 M9 17h.01 M15 9h.01 M15 13h.01 M15 17h.01" {...strokeProps(stroke)} />
    </svg>
  );
}

function LaptopIcon({ size = 14, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14v10H5z M3 19h18 M9 11a3 3 0 0 1 6 0" {...strokeProps(stroke)} />
    </svg>
  );
}

function PhoneIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" {...strokeProps(stroke)} />
    </svg>
  );
}

function PersonIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" {...strokeProps(stroke)} />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" {...strokeProps(stroke)} />
    </svg>
  );
}

function CalendarIcon({ size = 20, stroke }: IconLineProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h14v15H5z M5 6V4 M19 6V4 M3 11h18 M9 15h2 M14 15h2" {...strokeProps(stroke)} />
    </svg>
  );
}
