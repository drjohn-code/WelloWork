import { Fragment } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/locales";
import { SiteShell } from "@/app/components/SiteShell";
import { Reveal } from "@/app/components/Reveal";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { PrivacyChip } from "@/app/components/Chips";
import { Icon } from "@/app/components/Icons";
import { FeatureGrid } from "@/app/components/FeatureGrid";
import { CTASection } from "@/app/components/CTASection";
import { JsonLd } from "@/app/components/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  buildMetadata,
  breadcrumbList,
  localizedUrl,
  inLanguage,
} from "@/app/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    title: t("platformProactiveCare.title"),
    description: t("platformProactiveCare.description"),
    path: "/platform/proactive-care",
  });
}

export default async function ProactiveCarePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const loc = locale as AppLocale;
  const t = await getTranslations("platformProactiveCare");
  const tc = await getTranslations("breadcrumbs");

  const CRUMBS = [
    { name: tc("home"), href: "/" },
    { name: t("crumbs.platform"), href: "/#platform" },
    { name: t("crumbs.current"), href: "/platform/proactive-care" },
  ];

  const schema = [
    breadcrumbList(CRUMBS, loc),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WelloWork Proactive Care — Biomarker sample testing",
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      serviceType: "Biomarker testing",
      areaServed: ["EU", "UK", "Nordics"],
      url: localizedUrl("/platform/proactive-care", loc),
      inLanguage: inLanguage(loc),
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
                  <span className="eyebrow">{t("hero.eyebrow")}</span>
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
                  {t("hero.titleLead")}{" "}
                  <span className="italic-serif" style={{ color: "var(--accent)" }}>
                    {t("hero.titleAccent")}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lede" style={{ margin: 0 }}>
                  {t("hero.lede")}
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
              <strong>{t("answer.label")}</strong> {t("answer.body")}
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
              {t("testSection.heading")}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 28px", maxWidth: "64ch" }}>
              {t("testSection.body")}
            </p>
          </Reveal>
          <div className="grid grid-2" style={{ gap: 20 }}>
            <Reveal delay={1}>
              <PanelCard
                tone="blood"
                icon="drop"
                eyebrow={t("panels.blood.eyebrow")}
                title={t("panels.blood.title")}
                body={t("panels.blood.body")}
                markers={[
                  t("panels.blood.markers.hba1c"),
                  t("panels.blood.markers.apob"),
                  t("panels.blood.markers.hscrp"),
                  t("panels.blood.markers.lipidSubFractions"),
                  t("panels.blood.markers.vitaminD"),
                  t("panels.blood.markers.cbc"),
                ]}
              />
            </Reveal>
            <Reveal delay={2}>
              <PanelCard
                tone="urine"
                icon="flask"
                eyebrow={t("panels.urine.eyebrow")}
                title={t("panels.urine.title")}
                body={t("panels.urine.body")}
                markers={[
                  t("panels.urine.markers.kidney"),
                  t("panels.urine.markers.hydration"),
                  t("panels.urine.markers.glucose"),
                  t("panels.urine.markers.protein"),
                  t("panels.urine.markers.drugScreen"),
                ]}
              />
            </Reveal>
          </div>
          <Reveal delay={3}>
            <p
              className="small"
              style={{ margin: "22px 0 0", maxWidth: "70ch", fontStyle: "italic" }}
            >
              {t("testSection.note")}
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
                  {t("whoSeesSection.heading")}
                </h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  {t("whoSeesSection.body")}
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
              {t("logisticsSection.heading")}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 32px", maxWidth: "64ch" }}>
              {t("logisticsSection.body")}
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
              {t("whySection.heading")}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="body" style={{ margin: "0 0 28px", maxWidth: "64ch" }}>
              {t("whySection.body")}
            </p>
          </Reveal>
          <Reveal delay={2}>
            <SiloVsLongitudinal />
          </Reveal>
        </div>
      </section>

      <FeatureGrid
        eyebrow={t("features.eyebrow")}
        title={t("features.title")}
        items={[
          {
            icon: "drop",
            title: t("features.bloodPanel.title"),
            body: t("features.bloodPanel.body"),
          },
          {
            icon: "flask",
            title: t("features.urinePanel.title"),
            body: t("features.urinePanel.body"),
          },
          {
            icon: "shield",
            title: t("features.employeeOwned.title"),
            body: t("features.employeeOwned.body"),
          },
          {
            icon: "users",
            title: t("features.aggregated.title"),
            body: t("features.aggregated.body"),
          },
          {
            icon: "chart",
            title: t("features.linked.title"),
            body: t("features.linked.body"),
          },
          {
            icon: "lock",
            title: t("features.chainOfCustody.title"),
            body: t("features.chainOfCustody.body"),
          },
        ]}
      />

      <CTASection
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ label: t("cta.primary"), href: "/book-a-demo" }}
        secondary={{ label: t("cta.secondary"), href: "/contact" }}
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
  healthy: readonly [number, number];
};

const MARKERS = [
  { key: "hba1c", label: "HbA1c", value: 38, healthy: [25, 55] },
  { key: "apob", label: "ApoB", value: 78, healthy: [20, 60] },
  { key: "hscrp", label: "hs-CRP", value: 72, healthy: [15, 55] },
  { key: "vitaminD", label: "Vitamin D", value: 32, healthy: [40, 80] },
  { key: "lipids", label: "Lipids", value: 50, healthy: [30, 65] },
] as const satisfies ReadonlyArray<Marker & { key: string }>;

function BiomarkerReportCard() {
  const t = useTranslations("platformProactiveCare");
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
                {t("reportCard.personName")}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                {t("reportCard.personRole")}
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
            {t("reportCard.sampleData")}
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
              {t("reportCard.reportQ2")}
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
              {t("reportCard.markersAttention")}
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
              <span>{t("reportCard.colMarker")}</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingRight: 4,
                }}
              >
                <span>{t("reportCard.colLow")}</span>
                <span>{t("reportCard.colHealthy")}</span>
                <span>{t("reportCard.colHigh")}</span>
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
                    {t(`reportCard.markers.${m.key}`)}
                  </span>
                  <BiomarkerBar marker={m} outOfRange={outOfRange} />
                </div>
              );
            })}
          </div>

          <PrivacyChip>{t("reportCard.privacyChip")}</PrivacyChip>
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
  const t = useTranslations("platformProactiveCare");
  const rows: ReadonlyArray<{
    role: string;
    detail: string;
    cells: Array<"dot" | "lock" | "agg" | "trend">;
  }> = [
    {
      role: t("roleAccess.employee.role"),
      detail: t("roleAccess.employee.detail"),
      cells: ["dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot"],
    },
    {
      role: t("roleAccess.managerHR.role"),
      detail: t("roleAccess.managerHR.detail"),
      cells: ["lock", "lock", "agg", "lock", "lock", "agg", "lock", "agg"],
    },
    {
      role: t("roleAccess.wellowork.role"),
      detail: t("roleAccess.wellowork.detail"),
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
          {t("roleAccess.heading")}
        </span>
        <PrivacyChip>{t("roleAccess.privacyChip")}</PrivacyChip>
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
        <LegendItem kind="dot" label={t("roleAccess.legend.visible")} />
        <LegendItem kind="lock" label={t("roleAccess.legend.hidden")} />
        <LegendItem kind="agg" label={t("roleAccess.legend.aggregated")} />
        <LegendItem kind="trend" label={t("roleAccess.legend.cohortTrend")} />
      </div>
    </div>
  );
}

function AccessCell({ kind }: { kind: "dot" | "lock" | "agg" | "trend" }) {
  const t = useTranslations("platformProactiveCare");
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
        aria-label={t("roleAccess.aria.visibleMarker")}
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
        aria-label={t("roleAccess.aria.aggregated")}
      >
        {t("roleAccess.cellAggLabel")}
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
        aria-label={t("roleAccess.aria.cohortTrend")}
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
      aria-label={t("roleAccess.aria.hidden")}
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
  const t = useTranslations("platformProactiveCare");
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
      title: t("logistics.step1.title"),
      body: t("logistics.step1.body"),
      note: t("logistics.step1.note"),
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
      title: t("logistics.step2.title"),
      body: t("logistics.step2.body"),
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
      title: t("logistics.step3.title"),
      body: t("logistics.step3.body"),
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
  const t = useTranslations("platformProactiveCare");
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
          {t("logistics.stepLabel", { index })}
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
  const t = useTranslations("platformProactiveCare");
  const months = [
    t("siloVsLongitudinal.monthJan"),
    t("siloVsLongitudinal.monthApr"),
    t("siloVsLongitudinal.monthJul"),
    t("siloVsLongitudinal.monthOct"),
    t("siloVsLongitudinal.monthDec"),
  ];
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
          {t("siloVsLongitudinal.annualLabel")}
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
              {t("siloVsLongitudinal.oneReading")}
            </text>
            {/* Year markers — vast empty space */}
            {months.map((m, i) => (
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
          {t("siloVsLongitudinal.annualNote1")}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55 }}>
          {t("siloVsLongitudinal.annualNote2")}
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
          {t("siloVsLongitudinal.vs")}
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
          {t("siloVsLongitudinal.welloWorkView")}
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
          {t("siloVsLongitudinal.welloWorkNote1")}
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
          {t("siloVsLongitudinal.welloWorkNote2")}
        </div>
      </div>
    </div>
  );
}
