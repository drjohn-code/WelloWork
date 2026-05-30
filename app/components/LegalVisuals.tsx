import { useTranslations } from "next-intl";
import { ORG_EMAIL } from "../lib/site";

/* ============================================================
   Shared primitives
   ============================================================ */

function EuMap({ size = 120 }: { size?: number }) {
  // Very simplified EU/EEA silhouette. Decorative only.
  const d =
    "M22 38 Q30 28 44 26 Q56 22 70 24 Q86 22 100 28 Q116 30 128 36 Q140 40 148 50 Q154 60 152 72 Q156 82 150 94 Q146 104 134 110 Q124 118 110 120 Q96 126 80 124 Q66 126 52 122 Q40 118 32 110 Q22 100 20 88 Q14 78 16 64 Q14 52 22 38 Z";
  return (
    <svg
      viewBox="0 0 170 140"
      width={size}
      height={(size * 140) / 170}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eu-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(92,115,251,0.18)" />
          <stop offset="100%" stopColor="rgba(92,115,251,0.06)" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="url(#eu-fill)"
        stroke="var(--primary)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Sparse star ring (EU flag echo) */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const a = (i * 30 * Math.PI) / 180 - Math.PI / 2;
        const x = 85 + Math.cos(a) * 28;
        const y = 72 + Math.sin(a) * 22;
        return <circle key={i} cx={x} cy={y} r="1.4" fill="var(--accent)" />;
      })}
      {/* Shield in center */}
      <g transform="translate(78 60)">
        <path
          d="M7 0 L14 3 V9 C14 13 10 16 7 17 C4 16 0 13 0 9 V3 L7 0 Z"
          fill="white"
          stroke="var(--primary)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M4 8 L6.5 10.5 L10.5 6"
          stroke="var(--accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function EuDataCard({
  label,
  note,
}: {
  label?: string;
  note?: string;
}) {
  const t = useTranslations("legal");
  const resolvedLabel = label ?? t("visual.euCard.defaultLabel");
  return (
    <div className="lv-eu-card glass">
      <EuMap size={150} />
      <div className="lv-eu-meta">
        <div className="lv-eu-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {resolvedLabel}
        </div>
        {note && <div className="lv-eu-note">{note}</div>}
      </div>
    </div>
  );
}

function SecIcon({ name }: { name: "lock-arrow" | "lock-disk" | "key" | "audit" }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "lock-arrow":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M3 5h6M3 5l2-2M3 5l2 2"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lock-disk":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" stroke={stroke} strokeWidth="1.6" />
          <circle cx="12" cy="13" r="2.4" stroke={stroke} strokeWidth="1.6" />
          <path d="M3 11h18" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "key":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="8" cy="14" r="3.5" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M11 14h10M18 14v3M15 14v2"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "audit":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="3" width="14" height="18" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M8 8h6M8 12h6M8 16h4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export function SecurityStrip() {
  const t = useTranslations("legal");
  const items: Array<{ icon: "lock-arrow" | "lock-disk" | "key" | "audit"; label: string }> = [
    { icon: "lock-arrow", label: t("visual.security.transit") },
    { icon: "lock-disk", label: t("visual.security.rest") },
    { icon: "key", label: t("visual.security.rbac") },
    { icon: "audit", label: t("visual.security.audit") },
  ];
  return (
    <div className="lv-sec-wrap">
      <div className="lv-sec-strip">
        {items.map((it) => (
          <div key={it.label} className="lv-sec-cell">
            <span className="lv-sec-icon">
              <SecIcon name={it.icon} />
            </span>
            <span className="lv-sec-label">{it.label}</span>
          </div>
        ))}
      </div>
      <div className="lv-sec-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {t("visual.security.isoBadge")}
      </div>
    </div>
  );
}

/* ============================================================
   Privacy Policy visuals
   ============================================================ */

export function PrivacyTrustBar() {
  const t = useTranslations("legal");
  const items = [
    { flag: "🇪🇺", label: t("visual.trustBar.gdpr") },
    { flag: "🇸🇪", label: t("visual.trustBar.swedishLaw") },
    { flag: "", label: t("visual.trustBar.euData") },
  ];
  return (
    <div className="lv-trust-bar">
      {items.map((it, i) => (
        <span key={i} className="lv-trust-pill">
          {it.flag && <span className="lv-trust-flag" aria-hidden="true">{it.flag}</span>}
          {!it.flag && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function ControllerDiagram() {
  const t = useTranslations("legal");
  return (
    <div className="lv-ctrl-card glass">
      <div className="lv-ctrl-title">{t("visual.controller.title")}</div>

      <div className="lv-ctrl-row">
        <div className="lv-ctrl-node">
          <div className="lv-ctrl-role">{t("visual.controller.welloWork")}</div>
          <div className="lv-ctrl-sub">{t("visual.controller.roleController")}</div>
        </div>
        <div className="lv-ctrl-edge">
          <span className="lv-ctrl-line" />
          <span className="lv-ctrl-edge-label">{t("visual.controller.directRel")}</span>
          <span className="lv-ctrl-line" />
        </div>
        <div className="lv-ctrl-node">
          <div className="lv-ctrl-role">{t("visual.controller.you")}</div>
          <div className="lv-ctrl-sub">{t("visual.controller.websiteVisitor")}</div>
        </div>
      </div>

      <div className="lv-ctrl-divider" aria-hidden="true" />

      <div className="lv-ctrl-row">
        <div className="lv-ctrl-node lv-ctrl-node-sm">
          <div className="lv-ctrl-role">{t("visual.controller.customerOrg")}</div>
          <div className="lv-ctrl-sub">{t("visual.controller.roleController")}</div>
        </div>
        <div className="lv-ctrl-arrow" aria-hidden="true">→</div>
        <div className="lv-ctrl-node lv-ctrl-node-sm">
          <div className="lv-ctrl-role">{t("visual.controller.welloWork")}</div>
          <div className="lv-ctrl-sub">{t("visual.controller.roleProcessor")}</div>
        </div>
        <div className="lv-ctrl-arrow" aria-hidden="true">→</div>
        <div className="lv-ctrl-node lv-ctrl-node-sm">
          <div className="lv-ctrl-role">{t("visual.controller.you")}</div>
          <div className="lv-ctrl-sub">{t("visual.controller.platformUser")}</div>
        </div>
      </div>
      <div className="lv-ctrl-edge-label lv-ctrl-edge-label-bottom">{t("visual.controller.viaDpa")}</div>
    </div>
  );
}

function DataIcon({ name }: { name: "form" | "shield" | "chart" }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "form":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M8 8h8M8 12h8M8 16h5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "chart":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M4 20V6m6 14v-9m6 9V9m6 11V4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export function DataCollectedGrid() {
  const t = useTranslations("legal");
  const items: Array<{
    icon: "form" | "shield" | "chart";
    label: string;
    desc: string;
    badge?: string;
  }> = [
    {
      icon: "form",
      label: t("visual.dataGrid.contact.label"),
      desc: t("visual.dataGrid.contact.desc"),
    },
    {
      icon: "shield",
      label: t("visual.dataGrid.technical.label"),
      desc: t("visual.dataGrid.technical.desc"),
    },
    {
      icon: "chart",
      label: t("visual.dataGrid.platform.label"),
      desc: t("visual.dataGrid.platform.desc"),
      badge: t("visual.dataGrid.platform.badge"),
    },
  ];
  return (
    <div className="lv-data-grid">
      {items.map((it) => (
        <div key={it.label} className="lv-data-card">
          <span className="lv-data-icon">
            <DataIcon name={it.icon} />
          </span>
          <div className="lv-data-label">{it.label}</div>
          <div className="lv-data-desc">{it.desc}</div>
          {it.badge && <div className="lv-data-badge">{it.badge}</div>}
        </div>
      ))}
    </div>
  );
}

function BasisIcon({ name }: { name: "consent" | "interest" | "contract" | "law" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "consent":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 12l5 5L20 6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "interest":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3v18M5 6h14M6 6l-3 7a3 3 0 006 0L6 6zm12 0l-3 7a3 3 0 006 0l-3-7z" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "contract":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M7 3h7l4 4v14H7z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M13 3v5h5M9 13h7M9 17h5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "law":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 4v16M5 9l7-3 7 3M4 20h16M7 9v8M17 9v8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function LegalBasisStrip() {
  const t = useTranslations("legal");
  const items: Array<{
    icon: "consent" | "interest" | "contract" | "law";
    label: string;
    note: string;
  }> = [
    { icon: "consent", label: t("visual.basis.consent.label"), note: t("visual.basis.consent.note") },
    { icon: "interest", label: t("visual.basis.interest.label"), note: t("visual.basis.interest.note") },
    { icon: "contract", label: t("visual.basis.contract.label"), note: t("visual.basis.contract.note") },
    { icon: "law", label: t("visual.basis.law.label"), note: t("visual.basis.law.note") },
  ];
  return (
    <div className="lv-basis-strip">
      {items.map((it, i) => (
        <div key={it.label} className={`lv-basis-cell ${i % 2 === 0 ? "lv-basis-cell-a" : "lv-basis-cell-b"}`}>
          <div className="lv-basis-head">
            <span className="lv-basis-icon">
              <BasisIcon name={it.icon} />
            </span>
            <span className="lv-basis-label">{it.label}</span>
          </div>
          <div className="lv-basis-note">{it.note}</div>
        </div>
      ))}
    </div>
  );
}

export function RetentionTimeline() {
  const t = useTranslations("legal");
  const items = [
    { label: t("visual.retention.enquiry.label"), duration: t("visual.retention.enquiry.duration"), widthPct: 70, tone: "primary" },
    { label: t("visual.retention.platform.label"), duration: t("visual.retention.platform.duration"), widthPct: 100, tone: "accent" },
    { label: t("visual.retention.backups.label"), duration: t("visual.retention.backups.duration"), widthPct: 22, tone: "muted" },
  ];
  return (
    <div className="lv-retention">
      {items.map((it) => (
        <div key={it.label} className="lv-retention-row">
          <div className={`lv-retention-bar lv-retention-bar-${it.tone}`} style={{ width: `${it.widthPct}%` }}>
            <span className="lv-retention-duration">{it.duration}</span>
          </div>
          <div className="lv-retention-label">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

function RightIcon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "access":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth="1.6" />
          <path d="M16 16l5 5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "rectify":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 20l4-1L20 7l-3-3L5 16l-1 4z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "erase":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "restrict":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.6" />
          <path d="M6 6l12 12" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "portability":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3v12M7 11l5 5 5-5M4 21h16" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "object":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 8v5M12 17v.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M10.5 3.5l-8 13.5A1.7 1.7 0 004 20h16a1.7 1.7 0 001.5-3l-8-13.5a1.7 1.7 0 00-3 0z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function GdprRightsGrid() {
  const t = useTranslations("legal");
  const items: Array<{ icon: string; name: string; desc: string }> = [
    { icon: "access", name: t("visual.rights.access.name"), desc: t("visual.rights.access.desc") },
    { icon: "rectify", name: t("visual.rights.rectify.name"), desc: t("visual.rights.rectify.desc") },
    { icon: "erase", name: t("visual.rights.erase.name"), desc: t("visual.rights.erase.desc") },
    { icon: "restrict", name: t("visual.rights.restrict.name"), desc: t("visual.rights.restrict.desc") },
    { icon: "portability", name: t("visual.rights.portability.name"), desc: t("visual.rights.portability.desc") },
    { icon: "object", name: t("visual.rights.object.name"), desc: t("visual.rights.object.desc") },
  ];
  return (
    <div>
      <div className="lv-rights-grid">
        {items.map((it) => (
          <div key={it.name} className="lv-rights-card lift">
            <span className="lv-rights-icon">
              <RightIcon name={it.icon} />
            </span>
            <div className="lv-rights-name">{it.name}</div>
            <div className="lv-rights-desc">{it.desc}</div>
          </div>
        ))}
      </div>
      <a
        href={`mailto:${ORG_EMAIL}?subject=privacy%20request`}
        className="btn btn-primary lv-rights-cta"
      >
        {t("visual.rights.cta", { email: ORG_EMAIL })}
      </a>
    </div>
  );
}

/* ============================================================
   Terms of Service visuals
   ============================================================ */

function TermsAnchorIcon({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "use":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 12l5 5L20 6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "ip":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.6" />
          <path d="M9 9a3 3 0 116 0c0 2-3 2-3 4M12 17v.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "warranty":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "liability":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3v18M5 6h14M6 6l-3 7a3 3 0 006 0L6 6zm12 0l-3 7a3 3 0 006 0l-3-7z" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "law":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="6" width="16" height="14" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M4 10h16M9 14h6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "changes":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 4v6h6M20 20v-6h-6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 14a8 8 0 0014-4M19 10a8 8 0 00-14 4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function TermsAnchorStrip() {
  const t = useTranslations("legal");
  const items: Array<{ icon: string; label: string; href: string }> = [
    { icon: "use", label: t("visual.anchor.use"), href: "#acceptable-use" },
    { icon: "ip", label: t("visual.anchor.ip"), href: "#ip" },
    { icon: "warranty", label: t("visual.anchor.warranties"), href: "#warranties" },
    { icon: "liability", label: t("visual.anchor.liability"), href: "#warranties" },
    { icon: "law", label: t("visual.anchor.law"), href: "#law" },
    { icon: "changes", label: t("visual.anchor.changes"), href: "#changes" },
  ];
  return (
    <div className="lv-anchor-strip">
      {items.map((it) => (
        <a key={it.label} href={it.href} className="lv-anchor-cell">
          <span className="lv-anchor-icon">
            <TermsAnchorIcon name={it.icon} />
          </span>
          <span className="lv-anchor-label">{it.label}</span>
        </a>
      ))}
    </div>
  );
}

export function EntityCard() {
  const t = useTranslations("legal");
  return (
    <div className="lv-entity-card glass">
      <div className="lv-entity-head">
        <span className="lv-entity-flag" aria-hidden="true">🇸🇪</span>
        <span className="lv-entity-tag">{t("visual.entity.tag")}</span>
      </div>
      <div className="lv-entity-name">{t("visual.entity.name")}</div>
      <div className="lv-entity-meta">{t("visual.entity.meta")}</div>
      <div className="lv-entity-divider" />
      <div className="lv-entity-note">{t("visual.entity.note")}</div>
    </div>
  );
}

export function AcceptableUseSplit() {
  const t = useTranslations("legal");
  const may = [
    t("visual.use.may1"),
    t("visual.use.may2"),
    t("visual.use.may3"),
  ];
  const mayNot = [
    t("visual.use.mayNot1"),
    t("visual.use.mayNot2"),
    t("visual.use.mayNot3"),
  ];
  return (
    <div className="lv-use-split">
      <div className="lv-use-col lv-use-col-may">
        <div className="lv-use-head">
          <span className="lv-use-mark lv-use-mark-yes" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {t("visual.use.mayHead")}
        </div>
        <ul className="lv-use-list">
          {may.map((m) => (
            <li key={m}>
              <span className="lv-use-bullet lv-use-bullet-yes" aria-hidden="true" />
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="lv-use-col lv-use-col-not">
        <div className="lv-use-head">
          <span className="lv-use-mark lv-use-mark-no" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
          {t("visual.use.mayNotHead")}
        </div>
        <ul className="lv-use-list">
          {mayNot.map((m) => (
            <li key={m}>
              <span className="lv-use-bullet lv-use-bullet-no" aria-hidden="true" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function IpOwnershipDiagram() {
  const t = useTranslations("legal");
  const branches = [
    t("visual.ip.branchContent"),
    t("visual.ip.branchBranding"),
    t("visual.ip.branchSource"),
  ];
  return (
    <div className="lv-ip-card glass">
      <div className="lv-ip-root">
        <div className="lv-ip-node lv-ip-node-root">
          <div className="lv-ip-role">{t("visual.ip.owner")}</div>
          <div className="lv-ip-sub">{t("visual.ip.ownerLabel")}</div>
        </div>
      </div>
      <div className="lv-ip-trunk" aria-hidden="true" />
      <div className="lv-ip-branches">
        {branches.map((b) => (
          <div key={b} className="lv-ip-branch">
            <div className="lv-ip-stem" aria-hidden="true" />
            <div className="lv-ip-leaf">
              <div className="lv-ip-leaf-label">{b}</div>
              <div className="lv-ip-leaf-badge">{t("visual.ip.ownedBadge")}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="lv-ip-foot">
        {t("visual.ip.foot")}
      </div>
    </div>
  );
}

export function WarrantyCallout() {
  const t = useTranslations("legal");
  return (
    <div className="lv-callout lv-callout-warn">
      <span className="lv-callout-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v5M12 16v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <div className="lv-callout-title">{t("visual.warranty.title")}</div>
        <div className="lv-callout-body">
          {t("visual.warranty.body")}
        </div>
      </div>
    </div>
  );
}

export function GoverningLawLine() {
  const t = useTranslations("legal");
  return (
    <div className="lv-law-line">
      <span className="lv-law-flag" aria-hidden="true">🇸🇪</span>
      <span className="lv-law-text">
        {t.rich("visual.law.text", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </span>
    </div>
  );
}

/* ============================================================
   Cookie Policy visuals
   ============================================================ */

export function CookieTrustBadge() {
  const t = useTranslations("legal");
  return (
    <div className="lv-cookie-trust">
      <span className="lv-cookie-trust-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t("visual.cookieBadge")}
      </span>
    </div>
  );
}

export function CookieTable() {
  const t = useTranslations("legal");
  const rows: Array<{
    type: string;
    status: string;
    statusTone: "ok" | "warn" | "muted";
    purpose: string;
  }> = [
    {
      type: t("visual.cookieTable.essential.type"),
      status: t("visual.cookieTable.essential.status"),
      statusTone: "ok",
      purpose: t("visual.cookieTable.essential.purpose"),
    },
    {
      type: t("visual.cookieTable.analytics.type"),
      status: t("visual.cookieTable.analytics.status"),
      statusTone: "warn",
      purpose: t("visual.cookieTable.analytics.purpose"),
    },
    {
      type: t("visual.cookieTable.advertising.type"),
      status: t("visual.cookieTable.advertising.status"),
      statusTone: "muted",
      purpose: t("visual.cookieTable.advertising.purpose"),
    },
  ];
  return (
    <div className="lv-ck-table" role="table">
      <div className="lv-ck-head" role="row">
        <div role="columnheader">{t("visual.cookieTable.headType")}</div>
        <div role="columnheader">{t("visual.cookieTable.headStatus")}</div>
        <div role="columnheader">{t("visual.cookieTable.headPurpose")}</div>
      </div>
      {rows.map((r) => (
        <div key={r.type} className="lv-ck-row" role="row">
          <div role="cell" className="lv-ck-type">{r.type}</div>
          <div role="cell">
            <span className={`lv-ck-badge lv-ck-badge-${r.statusTone}`}>{r.status}</span>
          </div>
          <div role="cell" className="lv-ck-purpose">{r.purpose}</div>
        </div>
      ))}
    </div>
  );
}

function CkStepIcon({ name }: { name: "settings" | "x" | "alert" }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "settings":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.4.8a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2l-2.4-.8-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-.8a7 7 0 002 1.2L10 21h4l.5-2.5a7 7 0 002-1.2l2.4.8 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"
            stroke={stroke}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "x":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.6" />
          <path d="M8 8l8 8M16 8l-8 8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M10.5 3.5l-8 13.5A1.7 1.7 0 004 20h16a1.7 1.7 0 001.5-3l-8-13.5a1.7 1.7 0 00-3 0z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 9v4M12 17v.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export function CookieControlSteps() {
  const t = useTranslations("legal");
  const steps: Array<{ icon: "settings" | "x" | "alert"; title: string; note: string }> = [
    { icon: "settings", title: t("visual.cookieSteps.settings.title"), note: t("visual.cookieSteps.settings.note") },
    { icon: "x", title: t("visual.cookieSteps.clear.title"), note: t("visual.cookieSteps.clear.note") },
    { icon: "alert", title: t("visual.cookieSteps.heads.title"), note: t("visual.cookieSteps.heads.note") },
  ];
  return (
    <div className="lv-ck-steps">
      {steps.map((s, i) => (
        <div key={s.title} className="lv-ck-step">
          <span className="lv-ck-step-icon">
            <CkStepIcon name={s.icon} />
          </span>
          <div className="lv-ck-step-title">{s.title}</div>
          <div className="lv-ck-step-note">{s.note}</div>
          {i < steps.length - 1 && <span className="lv-ck-step-arrow" aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  );
}

export function CookieChangesCallout() {
  const t = useTranslations("legal");
  return (
    <div className="lv-callout lv-callout-info">
      <span className="lv-callout-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v.5M12 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <div className="lv-callout-body">
        {t("visual.cookieChanges")}
      </div>
    </div>
  );
}

/* ============================================================
   Data Processing (DPA Summary) visuals
   ============================================================ */

function DpaNodeIcon({ name }: { name: "building" | "server" | "user" }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "building":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2M10 21v-3h4v3"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "server":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="4" width="18" height="6" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          <circle cx="7" cy="7" r="0.9" fill={stroke} />
          <circle cx="7" cy="17" r="0.9" fill={stroke} />
        </svg>
      );
    case "user":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="8" r="3.4" stroke={stroke} strokeWidth="1.6" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

export function DpaRelationshipDiagram() {
  const t = useTranslations("legal");
  const nodes: Array<{
    icon: "building" | "server" | "user";
    role: string;
    detail: string;
  }> = [
    { icon: "building", role: t("visual.dpaRel.customerOrg.role"), detail: t("visual.dpaRel.customerOrg.detail") },
    { icon: "server", role: t("visual.dpaRel.welloWork.role"), detail: t("visual.dpaRel.welloWork.detail") },
    { icon: "user", role: t("visual.dpaRel.endUsers.role"), detail: t("visual.dpaRel.endUsers.detail") },
  ];
  return (
    <div className="lv-dpa-rel glass">
      <div className="lv-dpa-row">
        {nodes.map((n, i) => (
          <div key={n.role} className="lv-dpa-step">
            <div className="lv-dpa-node">
              <span className="lv-dpa-icon">
                <DpaNodeIcon name={n.icon} />
              </span>
              <div className="lv-dpa-role">{n.role}</div>
              <div className="lv-dpa-detail">{n.detail}</div>
            </div>
            {i < nodes.length - 1 && (
              <div className="lv-dpa-arrow-wrap" aria-hidden="true">
                <span className="lv-dpa-edge-label">
                  {i === 0
                    ? t("visual.dpaRel.edgeInstructions")
                    : t("visual.dpaRel.edgeDelivery")}
                </span>
                <span className="lv-dpa-arrow">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DpaSubjectStrip() {
  const t = useTranslations("legal");
  return (
    <div className="lv-dpa-keyvals">
      <div className="lv-dpa-kv">
        <div className="lv-dpa-kv-label">{t("visual.dpaSubject.scopeLabel")}</div>
        <div className="lv-dpa-kv-value">{t("visual.dpaSubject.scopeValue")}</div>
      </div>
      <div className="lv-dpa-kv">
        <div className="lv-dpa-kv-label">{t("visual.dpaSubject.durationLabel")}</div>
        <div className="lv-dpa-kv-value">{t("visual.dpaSubject.durationValue")}</div>
      </div>
    </div>
  );
}

function PurposeIcon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" } as const;
  const stroke = "var(--accent)";
  switch (name) {
    case "brain":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M9 5a3 3 0 00-3 3v1a3 3 0 00-1 5 3 3 0 003 3 3 3 0 003 2 3 3 0 003-2 3 3 0 003-3 3 3 0 00-1-5V8a3 3 0 00-3-3 3 3 0 00-5 0"
            stroke={stroke}
            strokeWidth="1.6"
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
    case "drop":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 3s-6 7-6 12a6 6 0 0012 0c0-5-6-12-6-12z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "chart":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 20V6m6 14v-9m6 9V9m6 11V4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function DpaProcessingSplit() {
  const t = useTranslations("legal");
  const purposes = [
    { icon: "brain", label: t("visual.dpaSplit.purpose.cognitive") },
    { icon: "calendar", label: t("visual.dpaSplit.purpose.workshop") },
    { icon: "drop", label: t("visual.dpaSplit.purpose.biomarker") },
    { icon: "chart", label: t("visual.dpaSplit.purpose.anonymised") },
  ];
  const categories = [
    t("visual.dpaSplit.cat.identification"),
    t("visual.dpaSplit.cat.cognitive"),
    t("visual.dpaSplit.cat.biomarker"),
    t("visual.dpaSplit.cat.metadata"),
  ];
  return (
    <div className="lv-dpa-split">
      <div className="lv-dpa-split-col">
        <div className="lv-dpa-split-head">{t("visual.dpaSplit.whatWeDo")}</div>
        <div className="lv-dpa-purpose-list">
          {purposes.map((p) => (
            <div key={p.label} className="lv-dpa-purpose">
              <span className="lv-dpa-purpose-icon">
                <PurposeIcon name={p.icon} />
              </span>
              <span className="lv-dpa-purpose-label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="lv-dpa-split-col">
        <div className="lv-dpa-split-head">{t("visual.dpaSplit.dataWeProcess")}</div>
        <div className="lv-dpa-pill-stack">
          {categories.map((c) => (
            <span key={c} className="lv-dpa-pill">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SubProcessorCallout() {
  const t = useTranslations("legal");
  return (
    <div className="lv-callout lv-callout-info lv-callout-block">
      <div className="lv-callout-head">
        <span className="lv-callout-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="lv-callout-title">
          {t("visual.subprocessor.title")}
        </div>
      </div>
      <div className="lv-callout-body" style={{ marginTop: 8 }}>
        {t("visual.subprocessor.body")}
      </div>
      <div className="lv-sub-row">
        <div className="lv-sub-cell">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="6" rx="1.5" stroke="var(--accent)" strokeWidth="1.6" />
            <rect x="3" y="14" width="18" height="6" rx="1.5" stroke="var(--accent)" strokeWidth="1.6" />
          </svg>
          {t("visual.subprocessor.hosting")}
        </div>
        <div className="lv-sub-cell">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="var(--accent)" strokeWidth="1.6" />
            <path d="M3 7l9 7 9-7" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          {t("visual.subprocessor.email")}
        </div>
        <div className="lv-sub-cell">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          {t("visual.subprocessor.labPartners")}
        </div>
      </div>
    </div>
  );
}

export function DpaContactCta() {
  const t = useTranslations("legal");
  return (
    <a
      href={`mailto:${ORG_EMAIL}?subject=DPA%20request`}
      className="lv-dpa-cta lift"
    >
      <span className="lv-dpa-cta-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="var(--accent)" strokeWidth="1.6" />
          <path d="M3 7l9 7 9-7" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="lv-dpa-cta-body">
        <div className="lv-dpa-cta-title">{t("visual.dpaCta.title", { email: ORG_EMAIL })}</div>
        <div className="lv-dpa-cta-note">
          {t("visual.dpaCta.note")}
        </div>
      </div>
      <span className="lv-dpa-cta-arrow" aria-hidden="true">→</span>
    </a>
  );
}
