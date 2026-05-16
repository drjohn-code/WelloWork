import { Icon } from "./Icons";

/* ---------- Hero: Uppsala location card ---------- */

export function UppsalaCard() {
  return (
    <div
      className="glass uppsala-card"
      style={{
        position: "relative",
        padding: 0,
        overflow: "hidden",
        borderRadius: 22,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 2,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "6px 11px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.88)",
          color: "var(--primary)",
          border: "1px solid rgba(22,43,92,0.14)",
          boxShadow: "0 4px 12px rgba(15,29,69,0.06)",
        }}
      >
        Founded 2024
      </span>

      <svg
        viewBox="0 0 320 220"
        width="100%"
        style={{ display: "block" }}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="up-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8EFFB" />
            <stop offset="100%" stopColor="#F4F7FE" />
          </linearGradient>
          <linearGradient id="up-river" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8A9CFD" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5C73FB" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect width="320" height="220" fill="url(#up-sky)" />

        {/* Distant tree line / horizon */}
        <path
          d="M0 150 Q40 142 80 148 T160 145 T240 150 T320 146 L320 165 L0 165 Z"
          fill="#5C73FB"
          opacity="0.10"
        />

        {/* Castle hill — soft rounded mound */}
        <path
          d="M-10 178 Q40 130 100 158 Q140 175 180 168 L180 180 Z"
          fill="#162B5C"
          opacity="0.18"
        />
        <path
          d="M0 178 Q45 142 95 165 L95 178 Z"
          fill="#162B5C"
          opacity="0.30"
        />

        {/* Cathedral — twin spires (Uppsala domkyrka silhouette) */}
        <rect x="148" y="138" width="44" height="42" fill="#162B5C" opacity="0.70" />
        <path d="M158 138 L158 86 L154 138 Z" fill="#162B5C" />
        <path d="M186 138 L186 80 L182 138 Z" fill="#162B5C" />
        <circle cx="156" cy="84" r="2.5" fill="#162B5C" />
        <circle cx="184" cy="78" r="2.5" fill="#162B5C" />
        {/* Cross atop spires */}
        <path
          d="M156 80 L156 74 M153 77 L159 77"
          stroke="#162B5C"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M184 74 L184 68 M181 71 L187 71"
          stroke="#162B5C"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Secondary low buildings */}
        <rect x="210" y="152" width="24" height="28" fill="#162B5C" opacity="0.55" />
        <rect x="238" y="144" width="20" height="36" fill="#162B5C" opacity="0.65" />
        <rect x="262" y="158" width="28" height="22" fill="#162B5C" opacity="0.50" />
        <rect x="294" y="150" width="18" height="30" fill="#162B5C" opacity="0.60" />

        {/* River Fyris — flowing curve in the foreground */}
        <path
          d="M0 196 Q60 188 120 198 T240 196 T320 200 L320 220 L0 220 Z"
          fill="url(#up-river)"
        />
        <path
          d="M0 196 Q60 188 120 198 T240 196 T320 200"
          stroke="#5C73FB"
          strokeWidth="1.4"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M40 205 Q90 200 140 207"
          stroke="#fff"
          strokeWidth="0.8"
          fill="none"
          opacity="0.55"
        />
      </svg>

      <div
        style={{
          padding: "14px 18px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderTop: "1px solid rgba(15,29,69,0.06)",
          background: "rgba(255,255,255,0.55)",
        }}
      >
        <svg width="14" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s-7-6-7-12a7 7 0 1114 0c0 6-7 12-7 12z"
            stroke="var(--accent)"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="9" r="2.3" fill="var(--accent)" />
        </svg>
        <span
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontSize: 13,
            color: "var(--ink-2)",
            letterSpacing: "0.02em",
          }}
        >
          Uppsala, Sweden · 59°51′N
        </span>
      </div>
    </div>
  );
}

/* ---------- "What does WelloWork do?" — feature icon grid ---------- */

export function FeatureIconGrid() {
  const items: Array<{
    icon: string;
    label: string;
    desc: string;
  }> = [
    { icon: "chart", label: "WelloRise", desc: "Cognitive training" },
    { icon: "brain", label: "WelloWize", desc: "Hiring & assessments" },
    { icon: "pulse", label: "Longitudinal trends", desc: "Performance over time" },
    { icon: "spark", label: "Health workshops", desc: "Live group sessions" },
    { icon: "drop", label: "Biomarker testing", desc: "At-home samples" },
  ];
  return (
    <div className="about-feature-grid">
      {items.map((it) => (
        <div key={it.label} className="about-feature-cell">
          <div className="about-feature-icon">
            <Icon name={it.icon} size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14.5,
                color: "var(--ink-1)",
                lineHeight: 1.2,
              }}
            >
              {it.label}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--ink-3)",
                marginTop: 2,
                letterSpacing: "0.01em",
              }}
            >
              {it.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- "Why did we build this?" — gap diagram ---------- */

export function GapDiagram() {
  return (
    <div className="glass gap-card" style={{ padding: 24 }}>
      <div className="gap-row">
        <div className="gap-row-label">What most platforms measure</div>
        <div className="gap-row-items">
          {["Engagement", "Pulse", "Satisfaction"].map((x) => (
            <div key={x} className="gap-pill gap-pill-muted">
              <span className="gap-dash" aria-hidden="true" />
              {x}
            </div>
          ))}
        </div>
      </div>

      <div className="gap-divider" aria-hidden="true">
        <span className="gap-divider-line" />
        <span className="gap-divider-label">the gap</span>
        <svg width="12" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4v14M6 13l6 6 6-6"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="gap-row">
        <div className="gap-row-label gap-row-label-accent">
          What WelloWork measures
        </div>
        <div className="gap-row-items">
          {["Cognitive Performance", "Longitudinal Trends", "Actual Output"].map(
            (x) => (
              <div key={x} className="gap-pill gap-pill-accent">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 16L10 10L14 14L20 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 7h4v4"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {x}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- "At a glance" — upgraded fact card ---------- */

function GlanceIcon({ name }: { name: string }) {
  // Inline icons so we don't fight the Icons.tsx gradient stroke styling here.
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "scale":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3v18M5 6h14M6 6l-3 7a3 3 0 006 0L6 6zm12 0l-3 7a3 3 0 006 0l-3-7z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="6" width="16" height="15" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M4 11h16M8 4v4M16 4v4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 21s-7-6-7-12a7 7 0 1114 0c0 6-7 12-7 12z"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <circle cx="12" cy="9" r="2.4" fill={stroke} />
        </svg>
      );
    case "globe":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.6" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3v4m0 10v4m-9-9h4m10 0h4M6 6l3 3m6 6l3 3M6 18l3-3m6-6l3-3"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3zM9 12l2 2 4-4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function AtAGlanceCard() {
  const rows: Array<{
    icon: string;
    label: string;
    value: React.ReactNode;
    badge?: "amber" | "shield";
  }> = [
    { icon: "scale", label: "Legal name", value: "WelloWork AB" },
    { icon: "calendar", label: "Founded", value: "2024" },
    { icon: "pin", label: "HQ", value: "Uppsala, Sweden" },
    { icon: "globe", label: "Service area", value: "EU · UK · Nordics" },
    { icon: "spark", label: "Stage", value: "Early, in pilots", badge: "amber" },
    { icon: "layers", label: "Data residency", value: "EU only" },
    {
      icon: "shield",
      label: "Compliance",
      value: "GDPR · ISO 27001 in progress",
      badge: "shield",
    },
  ];

  return (
    <div className="glance-card glass">
      {/* Swedish-accent strip — subtle 3px band */}
      <div className="glance-strip" aria-hidden="true">
        <span className="glance-strip-blue" />
        <span className="glance-strip-gold" />
      </div>

      <div style={{ padding: "22px 24px 24px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 20,
            margin: "0 0 18px",
            color: "var(--ink-1)",
            letterSpacing: "-0.01em",
          }}
        >
          At a glance
        </h2>
        <ul className="glance-list">
          {rows.map((r) => (
            <li key={r.label} className="glance-row">
              <span className="glance-icon">
                <GlanceIcon name={r.icon} />
              </span>
              <span className="glance-label">{r.label}</span>
              <span className="glance-value">
                {r.badge === "amber" ? (
                  <span className="glance-badge glance-badge-amber">
                    {r.value}
                  </span>
                ) : (
                  r.value
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- "Who is WelloWork for?" — three persona cards ---------- */

function PersonaIcon({ name }: { name: "hr" | "ops" | "ld" }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  if (name === "hr") {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="9" cy="8" r="3" stroke="var(--accent)" strokeWidth="1.7" />
        <path
          d="M3 19c0-3 2.5-5 6-5s6 2 6 5"
          stroke="var(--accent)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="16" cy="9" r="2.5" stroke="var(--primary)" strokeWidth="1.6" />
        <path
          d="M14.5 19c0-2.5 2-4 4.5-4 1 0 1.8.2 2.5.6"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "ops") {
    return (
      <svg {...common} aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2.5" stroke="var(--accent)" strokeWidth="1.7" />
        <path d="M3 10h18M8 3v4M16 3v4" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="7" y="13" width="3" height="3" rx="0.6" fill="var(--accent)" opacity="0.7" />
        <rect x="11.5" y="13" width="3" height="3" rx="0.6" fill="var(--accent)" opacity="0.35" />
        <rect x="16" y="13" width="3" height="3" rx="0.6" fill="var(--accent)" opacity="0.55" />
      </svg>
    );
  }
  // ld
  return (
    <svg {...common} aria-hidden="true">
      <path
        d="M3 19h4v-5h4V9h4V4h4"
        stroke="var(--accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 4h3v3"
        stroke="var(--accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="14" r="1.4" fill="var(--primary)" />
      <circle cx="11" cy="9" r="1.4" fill="var(--primary)" />
      <circle cx="15" cy="4" r="1.4" fill="var(--primary)" />
    </svg>
  );
}

export function PersonaCards() {
  const cards: Array<{
    icon: "hr" | "ops" | "ld";
    title: string;
    tag: string;
  }> = [
    { icon: "hr", title: "HR & People Leaders", tag: "Spot burnout signals early" },
    { icon: "ops", title: "Operations Leaders", tag: "Schedule around actual performance" },
    {
      icon: "ld",
      title: "L&D Leaders",
      tag: "Growth tracks tied to cognitive profiles",
    },
  ];
  return (
    <div className="persona-grid">
      {cards.map((c) => (
        <div key={c.title} className="persona-card lift">
          <div className="persona-icon">
            <PersonaIcon name={c.icon} />
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--ink-1)",
              letterSpacing: "-0.01em",
            }}
          >
            {c.title}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 4 }}>
            {c.tag}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Privacy architecture diagram ---------- */

export function PrivacyDiagram() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      <div className="privacy-stack">
        {/* Outer: Admin */}
        <div className="privacy-ring privacy-ring-admin">
          <span className="privacy-ring-label">
            <span className="privacy-ring-role">Admin</span>
            <span className="privacy-ring-detail">Aggregated org view</span>
          </span>

          {/* Middle: Manager */}
          <div className="privacy-ring privacy-ring-manager">
            <span className="privacy-ring-label">
              <span className="privacy-ring-role">Manager</span>
              <span className="privacy-ring-detail">Anonymised trends</span>
            </span>

            {/* Inner: Employee */}
            <div className="privacy-ring privacy-ring-employee">
              <span className="privacy-ring-label">
                <span className="privacy-ring-role" style={{ color: "white" }}>
                  Employee
                </span>
                <span
                  className="privacy-ring-detail"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Owns their data
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="privacy-badges">
        <div className="privacy-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="var(--primary)" strokeWidth="1.6" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x = 12 + Math.cos(a) * 5.4;
              const y = 12 + Math.sin(a) * 5.4;
              return <circle key={i} cx={x} cy={y} r="0.7" fill="var(--accent)" />;
            })}
          </svg>
          <span>Stored in EU</span>
        </div>
        <div className="privacy-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3zM9 12l2 2 4-4"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span>GDPR compliant</span>
        </div>
        <div className="privacy-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="var(--accent)" strokeWidth="1.6" />
            <path d="M8 11V8a4 4 0 018 0v3" stroke="var(--accent)" strokeWidth="1.6" />
            <circle cx="12" cy="16" r="1.2" fill="var(--accent)" />
          </svg>
          <span>ISO 27001 in progress</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- "Where is WelloWork based?" — Sweden map + Uppsala pin ---------- */

export function SwedenMap() {
  // Simplified Sweden silhouette. North is up. ViewBox 100x240.
  // Uppsala dot at approximately (68, 142) — east-central, just north of Stockholm.
  const swedenPath =
    "M54 6 C48 8 44 14 42 22 C38 32 40 44 36 54 C32 64 30 76 32 86 C34 96 28 104 26 116 C22 130 26 144 24 158 C22 172 26 184 22 196 C20 208 26 218 32 226 C38 234 48 236 56 234 C64 232 70 224 70 214 C68 202 70 190 74 180 C78 168 80 156 78 144 C76 132 80 120 82 108 C84 96 82 84 84 72 C86 60 84 48 80 38 C76 28 70 18 64 12 C61 9 58 7 54 6 Z";

  return (
    <div className="glass sweden-map-card" style={{ padding: 20 }}>
      <div className="sweden-map-inner">
        <svg
          viewBox="0 0 100 240"
          width="100"
          height="220"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path
            d={swedenPath}
            fill="rgba(92,115,251,0.06)"
            stroke="var(--primary)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Uppsala pin */}
          <g transform="translate(68 142)">
            <circle r="11" fill="var(--accent)" opacity="0.18" />
            <circle r="6.5" fill="var(--accent)" opacity="0.32" />
            <circle r="3.4" fill="var(--accent)" stroke="white" strokeWidth="1.4" />
          </g>
          {/* Pointer line out to label */}
          <path
            d="M71 142 L92 130"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <div className="sweden-map-meta">
          <div className="sweden-map-label">
            <span className="sweden-map-dot" aria-hidden="true" />
            Uppsala HQ
          </div>
          <div className="sweden-map-coord">59°51′N · 17°38′E</div>
          <div className="sweden-map-note">
            Operating from Uppsala. Serving customers across the EU, UK, and the
            Nordics.
          </div>
        </div>
      </div>
    </div>
  );
}
