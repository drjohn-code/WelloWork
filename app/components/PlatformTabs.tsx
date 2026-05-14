"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowRight, Icon, ICONS } from "./Icons";
import { PrivacyChip } from "./Chips";

type TabId = "Growth" | "Assessment" | "Measure" | "Workshops" | "Proactive Care";

type Tab = {
  id: TabId;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  href: string;
};

const TABS: Tab[] = [
  {
    id: "Growth",
    label: "Growth",
    eyebrow: "WelloRise",
    title: "Daily cognitive training that fits in a coffee break.",
    body: "Adaptive exercises across problem solving, working memory, attention, processing speed, and cognitive flexibility. Tokens unlock courses; a task marketplace lets colleagues help each other and earn.",
    bullets: [
      "Adaptive difficulty per cognitive domain",
      "Tokens redeem for courses & growth tracks",
      "Team Composition engine recommends optimal teams per project",
    ],
    href: "/platform/growth",
  },
  {
    id: "Assessment",
    label: "Assessment",
    eyebrow: "Wellowize",
    title: "Hiring and internal assessments — cognitive and technical.",
    body: "One assessment framework for candidates and existing employees. Build defensible profiles before the offer letter, and keep measuring after it.",
    bullets: [
      "Cognitive + technical, one framework",
      "Hiring panel results in minutes",
      "Internal benchmarks against role + tenure",
    ],
    href: "/platform/assessment",
  },
  {
    id: "Measure",
    label: "Measure",
    eyebrow: "Performance trends",
    title: "Longitudinal performance — not a one-time score.",
    body: "Every session, every assessment, every workshop is a data point. See how cognitive performance changes through sprints, shifts, and seasons — for individuals and aggregated for managers.",
    bullets: [
      "90-day, 6-month, and 12-month views",
      "Auto-annotated against work events",
      "Promotion-readiness signals based on trend, not a single test",
    ],
    href: "/platform/measure",
  },
  {
    id: "Workshops",
    label: "Workshops",
    eyebrow: "Service layer",
    title: "Live health workshops, on-site or remote.",
    body: "Facilitator-led sessions designed around the cognitive performance and longevity themes that compound. Booked through the same platform — outcomes flow back into the trend data.",
    bullets: [
      "Facilitator-led, on-site or remote",
      "Aligned with cognitive & longevity science",
      "Bookings, attendance, and follow-ups in one place",
    ],
    href: "/platform/workshops",
  },
  {
    id: "Proactive Care",
    label: "Proactive Care",
    eyebrow: "Preventive care",
    title: "Biomarker testing for longevity, general health, and drug screening.",
    body: "Blood panels for longevity markers and urine panels for general health and drug screening. Employees see their full report. Managers only see anonymised, aggregated trends.",
    bullets: [
      "Blood: longevity biomarkers",
      "Urine: general health & drug screening",
      "Employee-private + manager-aggregated views",
    ],
    href: "/platform/proactive-care",
  },
];

export function PlatformTabs() {
  const [active, setActive] = useState<TabId>("Growth");
  const cur = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section id="platform" className="section">
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <span className="eyebrow">The platform</span>
          </div>
          <h2 className="h-section" style={{ textAlign: "center", margin: "0 auto 40px", maxWidth: "20ch" }}>
            One operating system for{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              human capital.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={1}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${active === t.id ? "active" : ""}`}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={2}>
          <div
            className="glass-strong"
            style={{
              padding: 0,
              overflow: "hidden",
              position: "relative",
              background:
                "linear-gradient(160deg, color-mix(in oklch, var(--secondary) 70%, white), white 60%, color-mix(in oklch, var(--accent-soft) 18%, white))",
            }}
          >
            <div
              className="ft-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, minHeight: 520 }}
            >
              {/* Left visual */}
              <div
                style={{
                  position: "relative",
                  padding: 40,
                  background: "linear-gradient(160deg, var(--primary) 0%, var(--navy) 100%)",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                  minHeight: 520,
                }}
              >
                <div
                  className="orb"
                  style={{ width: 260, height: 260, top: -80, right: -80, background: "var(--accent)", opacity: 0.4 }}
                />
                <div
                  className="orb"
                  style={{
                    width: 220,
                    height: 220,
                    bottom: -60,
                    left: -60,
                    background: "var(--secondary-deep)",
                    opacity: 0.3,
                  }}
                />
                <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
                  <TabVisual id={cur.id} />
                </div>
              </div>

              {/* Right content */}
              <div
                key={cur.id}
                style={{
                  padding: "48px 40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 18,
                  animation: "fadeInUp .4s ease",
                }}
              >
                <span className="eyebrow">{cur.eyebrow}</span>
                <h3 className="h-section" style={{ fontSize: "clamp(26px,3vw,36px)", margin: 0 }}>
                  {cur.title}
                </h3>
                <p className="body" style={{ margin: 0, maxWidth: "42ch" }}>
                  {cur.body}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "8px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {cur.bullets.map((b) => (
                    <li
                      key={b}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 14.5,
                        color: "var(--ink-2)",
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          flexShrink: 0,
                          marginTop: 2,
                          background: "color-mix(in oklch, var(--accent) 18%, white)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24">
                          <path
                            d="M5 12l5 5L20 7"
                            stroke="var(--primary)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={cur.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: 14.5,
                    marginTop: 10,
                  }}
                >
                  Explore {cur.label.toLowerCase()} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TabVisual({ id }: { id: TabId }) {
  if (id === "Growth") return <GrowthVisual />;
  if (id === "Assessment") return <AssessmentVisual />;
  if (id === "Measure") return <MeasureVisual />;
  if (id === "Workshops") return <WorkshopsVisual />;
  return <ProactiveCareVisual />;
}

function PanelChrome({
  url,
  badge,
  children,
  style,
}: {
  url: string;
  badge?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="glass-strong"
      style={{
        padding: 0,
        overflow: "hidden",
        background: "rgba(255,255,255,0.96)",
        color: "var(--ink-1)",
        borderRadius: 18,
        ...style,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid rgba(15,29,69,0.07)",
          fontSize: 11,
          color: "var(--ink-3)",
        }}
      >
        <span style={{ display: "inline-flex", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0E5EE" }} />
        </span>
        <span style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{url}</span>
        {badge && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function GrowthVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
      <PanelChrome url="app.wellowork.net / train" badge="Working memory · day 14">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span
            className="small"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--ink-3)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            N-back · level 4
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)" }}>00:24</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 6,
            aspectRatio: "1 / 1",
            padding: 8,
            background: "rgba(15,29,69,0.03)",
            borderRadius: 12,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: 8,
                background:
                  i === 4 ? "linear-gradient(135deg, var(--accent), var(--primary))" : "rgba(15,29,69,0.06)",
                border: i === 4 ? "none" : "1px solid rgba(15,29,69,0.06)",
                transition: "all .2s",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(15,29,69,0.10)",
              background: "white",
              fontWeight: 600,
              fontSize: 13,
              color: "var(--ink-2)",
            }}
          >
            Match (M)
          </button>
          <button
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              background: "var(--primary)",
              color: "white",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Skip (Space)
          </button>
        </div>
      </PanelChrome>

      <div
        className="glass-strong"
        style={{
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(255,255,255,0.18)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FFCE3A, var(--accent))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink-1)",
          }}
        >
          <Icon name="star" size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>+12 tokens earned</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Streak: 14 days · Marketplace balance: 248</div>
        </div>
      </div>
    </div>
  );
}

function AssessmentVisual() {
  const scores = [
    { label: "Problem solving", val: 84 },
    { label: "Working memory", val: 91 },
    { label: "Processing speed", val: 78 },
    { label: "Attention", val: 86 },
    { label: "Technical · TS", val: 73 },
  ];
  return (
    <PanelChrome url="app.wellowork.net / assess / candidate" badge="Sample candidate">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), var(--primary))",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "0.02em",
          }}
        >
          JK
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>J. Karlsson</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Backend Engineer · Stockholm</div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 100,
            background: "rgba(16,185,129,0.12)",
            color: "var(--success)",
          }}
        >
          Strong match
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {scores.map((s) => (
          <div key={s.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--ink-2)",
                marginBottom: 4,
              }}
            >
              <span>{s.label}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{s.val}</span>
            </div>
            <div className="mini-bar" style={{ height: 6 }}>
              <div style={{ width: `${s.val}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          padding: 10,
          borderRadius: 10,
          background: "rgba(92,115,251,0.07)",
          border: "1px solid rgba(92,115,251,0.18)",
          fontSize: 12,
          color: "var(--ink-2)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon name="check" size={14} /> Above role benchmark in 4 of 5 cognitive domains.
      </div>
    </PanelChrome>
  );
}

function MeasureVisual() {
  return (
    <PanelChrome url="app.wellowork.net / trends" badge="Eng team · 6 months">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-3)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Cognitive performance
        </span>
        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>Smoothed weekly · sample data</span>
      </div>
      <svg viewBox="0 0 340 150" style={{ width: "100%", height: 150, display: "block" }}>
        <defs>
          <linearGradient id="mArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 70, 100, 130].map((y) => (
          <line key={y} x1="20" x2="330" y1={y} y2={y} stroke="rgba(15,29,69,0.06)" />
        ))}
        {["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => (
          <text key={m} x={20 + i * 62} y="148" fontSize="9" fill="rgba(15,29,69,0.45)">
            {m}
          </text>
        ))}
        <path
          d="M20 95 L80 92 L140 82 L200 95 L260 70 L320 58 L320 140 L20 140 Z"
          fill="url(#mArea)"
        />
        <path
          d="M20 95 L80 92 L140 82 L200 95 L260 70 L320 58"
          stroke="var(--accent)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g>
          <line x1="200" y1="95" x2="200" y2="118" stroke="rgba(15,29,69,0.25)" strokeWidth="1" strokeDasharray="2 3" />
          <rect x="148" y="120" width="104" height="18" rx="9" fill="white" stroke="rgba(15,29,69,0.12)" />
          <text x="200" y="132" fontSize="9" textAnchor="middle" fill="rgba(15,29,69,0.7)">
            Sprint review · focus −8%
          </text>
        </g>
        <circle cx="200" cy="95" r="3.5" fill="white" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="320" cy="58" r="3.5" fill="white" stroke="var(--accent)" strokeWidth="2" />
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
        {[
          { l: "Avg focus", v: "+11%", cap: "vs. last quarter" },
          { l: "Memory", v: "+6%", cap: "rolling 30-day" },
          { l: "Variability", v: "−14%", cap: "team-level" },
        ].map((m) => (
          <div key={m.l} style={{ padding: 10, borderRadius: 10, background: "rgba(15,29,69,0.04)" }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--ink-3)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {m.l}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--ink-1)",
              }}
            >
              {m.v}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{m.cap}</div>
          </div>
        ))}
      </div>
    </PanelChrome>
  );
}

function WorkshopsVisual() {
  const workshops = [
    { day: "TUE", date: "21", title: "Sleep architecture & recovery", when: "10:00 · Remote · 60 min" },
    { day: "WED", date: "22", title: "Nutrition for cognitive performance", when: "13:00 · On-site · 90 min" },
    { day: "THU", date: "23", title: "Stress, focus, and cognitive load", when: "15:30 · Remote · 60 min" },
    { day: "FRI", date: "24", title: "Longevity & metabolic health basics", when: "11:00 · On-site · 90 min" },
  ];
  return (
    <PanelChrome url="app.wellowork.net / workshops" badge="May · upcoming">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {workshops.map((w, i) => (
          <div
            key={w.title}
            style={{
              padding: 10,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: i === 0 ? "rgba(92,115,251,0.08)" : "rgba(15,29,69,0.03)",
              border: i === 0 ? "1px solid rgba(92,115,251,0.2)" : "1px solid transparent",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: i === 0 ? "var(--primary)" : "white",
                color: i === 0 ? "white" : "var(--ink-1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(15,29,69,0.06)",
              }}
            >
              <span style={{ fontSize: 9, opacity: 0.7, letterSpacing: "0.06em" }}>{w.day}</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                {w.date}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>{w.title}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{w.when}</div>
            </div>
            {i === 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                14 booked
              </span>
            )}
          </div>
        ))}
      </div>
    </PanelChrome>
  );
}

function ProactiveCareVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
      <PanelChrome url="app.wellowork.net / health / report" badge="Your view · private">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>Blood panel · longevity</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Drawn 12 May · 11 markers</div>
          </div>
          <PrivacyChip>Only you can see this</PrivacyChip>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6 }}>
          {[
            { l: "HbA1c", v: "5.2", tag: "optimal", c: "var(--success)" },
            { l: "hs-CRP", v: "0.8", tag: "good", c: "var(--success)" },
            { l: "ApoB", v: "88", tag: "monitor", c: "#D97706" },
            { l: "Vitamin D", v: "54", tag: "optimal", c: "var(--success)" },
          ].map((m) => (
            <div key={m.l} style={{ padding: 8, borderRadius: 8, background: "rgba(15,29,69,0.04)" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--ink-3)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {m.l}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--ink-1)",
                  }}
                >
                  {m.v}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: m.c,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {m.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PanelChrome>

      <div
        className="glass-strong"
        style={{
          padding: 14,
          background: "rgba(255,255,255,0.18)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Manager view · aggregated</div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              color: "white",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              style={{ verticalAlign: -1, marginRight: 3 }}
            >
              <path
                d={ICONS.lock}
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Anonymised
          </span>
        </div>
        <div style={{ fontSize: 11, opacity: 0.8 }}>Engineering · 14 members</div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24 }}>
            12<span style={{ fontSize: 14, opacity: 0.7 }}> / 14</span>
          </span>
          <span style={{ fontSize: 11, opacity: 0.8 }}>reports completed this cycle</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
          Individual values are never shown — only trends.
        </div>
      </div>
    </div>
  );
}
