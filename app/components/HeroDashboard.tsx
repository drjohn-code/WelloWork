import { useTranslations } from "next-intl";
import { Icon } from "./Icons";
import { PrivacyChip } from "./Chips";

export function HeroDashboard() {
  const t = useTranslations("heroDashboard");
  const members = [
    { i: "AL", name: t("composition.member1.name"), role: t("composition.member1.role"), match: 96 },
    { i: "ES", name: t("composition.member2.name"), role: t("composition.member2.role"), match: 91 },
    { i: "MJ", name: t("composition.member3.name"), role: t("composition.member3.role"), match: 87 },
  ];
  return (
    <div
      className="glass-strong"
      style={{
        padding: 0,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, rgba(255,255,255,0.78), rgba(255,255,255,0.55))",
      }}
    >
      <div
        className="orb"
        style={{
          width: 200,
          height: 200,
          top: -50,
          right: -50,
          background: "var(--accent)",
          opacity: 0.35,
          animation: "drift1 9s ease-in-out infinite",
        }}
      />
      <div
        className="orb"
        style={{
          width: 160,
          height: 160,
          bottom: -40,
          left: -40,
          background: "var(--secondary-deep)",
          opacity: 0.45,
          animation: "drift2 11s ease-in-out infinite",
        }}
      />

      {/* Window chrome */}
      <div
        style={{
          position: "relative",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(15,29,69,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E0E5EE" }} />
        </div>
        <div
          style={{
            marginLeft: 12,
            fontSize: 12,
            color: "var(--ink-3)",
            fontFamily: "ui-monospace,Menlo,monospace",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="lock" size={11} /> {t("browser.url")}
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--ink-3)",
            textTransform: "uppercase",
          }}
        >
          {t("sampleData")}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Top KPI row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              className="small"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {t("team.label")}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 22,
                color: "var(--ink-1)",
                letterSpacing: "-0.01em",
              }}
            >
              {t("team.title")}
            </div>
          </div>
          <PrivacyChip>{t("privacyChip")}</PrivacyChip>
        </div>

        {/* Trend chart */}
        <div
          style={{
            padding: "14px 8px 8px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(15,29,69,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 8px 6px",
              fontSize: 11,
              color: "var(--ink-3)",
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>{t("chart.range")}</span>
            <span style={{ display: "inline-flex", gap: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} /> {t("chart.legend.focus")}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--secondary-deep)" }} /> {t("chart.legend.memory")}
              </span>
            </span>
          </div>
          <svg viewBox="0 0 320 110" style={{ width: "100%", height: 110, display: "block" }}>
            <defs>
              <linearGradient id="hAreaA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[25, 50, 75, 100].map((y) => (
              <line key={y} x1="10" x2="312" y1={y} y2={y} stroke="rgba(15,29,69,0.06)" />
            ))}
            {[t("chart.axis.wk1"), t("chart.axis.wk4"), t("chart.axis.wk8"), t("chart.axis.wk12")].map((m, i) => (
              <text key={m} x={20 + i * 95} y="108" fontSize="9" fill="rgba(15,29,69,0.4)">
                {m}
              </text>
            ))}
            <path
              d="M10 75 L40 65 L70 70 L100 55 L130 60 L160 48 L190 52 L220 40 L250 45 L280 35 L310 30 L310 100 L10 100 Z"
              fill="url(#hAreaA)"
            />
            <path
              d="M10 75 L40 65 L70 70 L100 55 L130 60 L160 48 L190 52 L220 40 L250 45 L280 35 L310 30"
              stroke="var(--accent)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 80 L40 78 L70 72 L100 75 L130 68 L160 70 L190 60 L220 65 L250 55 L280 50 L310 48"
              stroke="var(--secondary-deep)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g>
              <line x1="220" y1="40" x2="220" y2="22" stroke="rgba(15,29,69,0.25)" strokeWidth="1" strokeDasharray="2 3" />
              <rect x="172" y="6" width="96" height="18" rx="9" fill="white" stroke="rgba(15,29,69,0.12)" />
              <text x="220" y="18" fontSize="9" textAnchor="middle" fill="rgba(15,29,69,0.7)">
                {t("chart.annotation")}
              </text>
            </g>
          </svg>
        </div>

        {/* Lower row: Team composition + Biomarker tile */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(15,29,69,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                className="small"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink-2)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {t("composition.title")}
              </span>
              <span style={{ fontSize: 10, color: "var(--ink-3)" }}>{t("composition.project")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {members.map((m) => (
                <div key={m.i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--accent), var(--primary))",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {m.i}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-1)" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{m.role}</div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--primary)",
                      background: "rgba(92,115,251,0.12)",
                      padding: "3px 8px",
                      borderRadius: 100,
                    }}
                  >
                    {t("composition.fit", { value: m.match })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: "linear-gradient(160deg, var(--primary) 0%, var(--primary-deep) 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(92,115,251,0.5), transparent 70%)",
              }}
            />
            <div>
              <Icon name="drop" size={18} />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  marginTop: 6,
                }}
              >
                {t("biomarker.label")}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 28,
                  letterSpacing: "-0.02em",
                }}
              >
                12<span style={{ fontSize: 14, opacity: 0.6 }}> / 14</span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{t("biomarker.caption")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
