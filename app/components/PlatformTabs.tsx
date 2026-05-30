"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { ArrowRight, Icon, ICONS } from "./Icons";
import { PrivacyChip } from "./Chips";

type TabId = "Growth" | "Assessment" | "Measure" | "Workshops" | "Proactive Care";

type TabKey = "growth" | "assessment" | "measure" | "workshops" | "proactiveCare";

type Tab = {
  id: TabId;
  key: TabKey;
  href: string;
};

const TABS: Tab[] = [
  { id: "Growth", key: "growth", href: "/platform/growth" },
  { id: "Assessment", key: "assessment", href: "/platform/assessment" },
  { id: "Measure", key: "measure", href: "/platform/measure" },
  { id: "Workshops", key: "workshops", href: "/platform/workshops" },
  { id: "Proactive Care", key: "proactiveCare", href: "/platform/proactive-care" },
];

export function PlatformTabs() {
  const t = useTranslations("platformTabs");
  const [active, setActive] = useState<TabId>("Growth");
  const cur = TABS.find((tab) => tab.id === active) ?? TABS[0];
  const curLabel = t(`tabs.${cur.key}.label`);
  const curBullets = t.raw(`tabs.${cur.key}.bullets`) as string[];

  return (
    <section id="platform" className="section">
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <span className="eyebrow">{t("section.eyebrow")}</span>
          </div>
          <h2 className="h-section" style={{ textAlign: "center", margin: "0 auto 40px", maxWidth: "20ch" }}>
            {t("section.heading.lead")}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              {t("section.heading.accent")}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={1}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${active === tab.id ? "active" : ""}`}
                onClick={() => setActive(tab.id)}
              >
                {t(`tabs.${tab.key}.label`)}
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
                <span className="eyebrow">{t(`tabs.${cur.key}.eyebrow`)}</span>
                <h3 className="h-section" style={{ fontSize: "clamp(26px,3vw,36px)", margin: 0 }}>
                  {t(`tabs.${cur.key}.title`)}
                </h3>
                <p className="body" style={{ margin: 0, maxWidth: "42ch" }}>
                  {t(`tabs.${cur.key}.body`)}
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
                  {curBullets.map((b) => (
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
                  {t("cta.explore", { tab: curLabel.toLowerCase() })} <ArrowRight size={14} />
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
  const t = useTranslations("platformTabsMock");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
      <PanelChrome url={t("growth.url")} badge={t("growth.badge")}>
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
            {t("growth.exercise")}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)" }}>{t("growth.timer")}</span>
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
            {t("growth.btnMatch")}
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
            {t("growth.btnSkip")}
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
          <div style={{ fontSize: 13, fontWeight: 600 }}>{t("growth.tokens")}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{t("growth.streak")}</div>
        </div>
      </div>
    </div>
  );
}

function AssessmentVisual() {
  const t = useTranslations("platformTabsMock");
  const scores = [
    { label: t("assessment.score.problemSolving"), val: 84 },
    { label: t("assessment.score.workingMemory"), val: 91 },
    { label: t("assessment.score.processingSpeed"), val: 78 },
    { label: t("assessment.score.attention"), val: 86 },
    { label: t("assessment.score.technical"), val: 73 },
  ];
  return (
    <PanelChrome url={t("assessment.url")} badge={t("assessment.badge")}>
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
          <div style={{ fontSize: 14, fontWeight: 600 }}>{t("assessment.name")}</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{t("assessment.role")}</div>
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
          {t("assessment.match")}
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
        <Icon name="check" size={14} /> {t("assessment.note")}
      </div>
    </PanelChrome>
  );
}

function MeasureVisual() {
  const t = useTranslations("platformTabsMock");
  const months = [
    t("measure.axis.dec"),
    t("measure.axis.jan"),
    t("measure.axis.feb"),
    t("measure.axis.mar"),
    t("measure.axis.apr"),
    t("measure.axis.may"),
  ];
  return (
    <PanelChrome url={t("measure.url")} badge={t("measure.badge")}>
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
          {t("measure.title")}
        </span>
        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{t("measure.subtitle")}</span>
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
        {months.map((m, i) => (
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
            {t("measure.annotation")}
          </text>
        </g>
        <circle cx="200" cy="95" r="3.5" fill="white" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="320" cy="58" r="3.5" fill="white" stroke="var(--accent)" strokeWidth="2" />
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
        {[
          { l: t("measure.stat.focus.label"), v: t("measure.stat.focus.value"), cap: t("measure.stat.focus.cap") },
          { l: t("measure.stat.memory.label"), v: t("measure.stat.memory.value"), cap: t("measure.stat.memory.cap") },
          {
            l: t("measure.stat.variability.label"),
            v: t("measure.stat.variability.value"),
            cap: t("measure.stat.variability.cap"),
          },
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
  const t = useTranslations("platformTabsMock");
  const tv = useTranslations("platformTabs.visual.workshops");
  const items = t.raw("workshops") as Array<{ day: string; title: string; when: string }>;
  const dates = ["21", "22", "23", "24"];
  const workshops = items.map((w, i) => ({ ...w, date: dates[i] }));
  return (
    <PanelChrome url={tv("url")} badge={tv("badge")}>
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
                {tv("booked")}
              </span>
            )}
          </div>
        ))}
      </div>
    </PanelChrome>
  );
}

function ProactiveCareVisual() {
  const t = useTranslations("platformTabsMock");
  const tv = useTranslations("platformTabs.visual.proactiveCare.marker");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
      <PanelChrome url={t("proactiveCare.url")} badge={t("proactiveCare.badge")}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>{t("proactiveCare.panelTitle")}</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{t("proactiveCare.panelSub")}</div>
          </div>
          <PrivacyChip>{t("proactiveCare.privacyChip")}</PrivacyChip>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6 }}>
          {[
            { l: tv("hba1c.l"), v: "5.2", tag: t("proactiveCare.marker.hba1c.tag"), c: "var(--success)" },
            { l: tv("hscrp.l"), v: "0.8", tag: t("proactiveCare.marker.hscrp.tag"), c: "var(--success)" },
            { l: tv("apob.l"), v: "88", tag: t("proactiveCare.marker.apob.tag"), c: "#D97706" },
            { l: tv("vitaminD.l"), v: "54", tag: t("proactiveCare.marker.vitd.tag"), c: "var(--success)" },
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
          <div style={{ fontSize: 12, fontWeight: 600 }}>{t("proactiveCare.managerView")}</div>
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
            {t("proactiveCare.anonymised")}
          </span>
        </div>
        <div style={{ fontSize: 11, opacity: 0.8 }}>{t("proactiveCare.team")}</div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24 }}>
            12<span style={{ fontSize: 14, opacity: 0.7 }}> / 14</span>
          </span>
          <span style={{ fontSize: 11, opacity: 0.8 }}>{t("proactiveCare.reports")}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
          {t("proactiveCare.footnote")}
        </div>
      </div>
    </div>
  );
}
