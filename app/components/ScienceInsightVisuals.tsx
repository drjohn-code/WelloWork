/* Science & Insight page visuals.
   Style language mirrors CognitiveConstructsVisuals / MethodologyVisuals:
   periwinkle accent, dark navy on light lavender, rounded cards, no kitsch. */

import { useTranslations } from "next-intl";

/* ===========================================================
   Shared icon set
   =========================================================== */

type IconName =
  | "doc"
  | "book"
  | "flask"
  | "ref"
  | "status"
  | "link"
  | "gauge"
  | "checkCaveat"
  | "quote"
  | "envelope";

function SiIcon({
  name,
  size = 22,
  tone = "accent",
}: {
  name: IconName;
  size?: number;
  tone?: "accent" | "primary";
}) {
  const stroke = tone === "primary" ? "var(--primary)" : "var(--accent)";
  const dot = tone === "primary" ? "var(--accent)" : "var(--primary)";
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" } as const;

  switch (name) {
    case "doc":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M6 3h8l4 4v14H6z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 3v4h4" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 12h6M9 15h6M9 18h4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="9" r="0.9" fill={dot} />
        </svg>
      );
    case "book":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 6v13" stroke={stroke} strokeWidth="1.4" strokeDasharray="2 3" />
        </svg>
      );
    case "flask":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M9 3h6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M7.4 15h9.2" stroke={stroke} strokeWidth="1.3" strokeDasharray="2 2" />
          <circle cx="10.5" cy="17.5" r="1" fill={dot} />
          <circle cx="13.5" cy="18.5" r="0.8" fill={dot} />
        </svg>
      );
    case "ref":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke={stroke} strokeWidth="1.5" />
          <path d="M6 9h8M6 12h10M6 15h6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="18" cy="9" r="1.2" fill={dot} />
        </svg>
      );
    case "status":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="9" width="18" height="6" rx="3" stroke={stroke} strokeWidth="1.6" />
          <circle cx="9" cy="12" r="1.6" fill={dot} />
        </svg>
      );
    case "link":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M10 14a4 4 0 0 1 0-5.6l2.4-2.4a4 4 0 0 1 5.6 5.6L17 12.6"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M14 10a4 4 0 0 1 0 5.6l-2.4 2.4a4 4 0 0 1-5.6-5.6L7 11.4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "gauge":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M4 17a8 8 0 1 1 16 0"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M12 17l4-5" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1.4" fill={dot} />
        </svg>
      );
    case "checkCaveat":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M4 12l4 4 8-9"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M17 14v3" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="17" cy="19.2" r="0.9" fill={dot} />
        </svg>
      );
    case "quote":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M6 8v8M10 8v8"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M14 8v8M18 8v8"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="6" cy="17.5" r="0.9" fill={dot} />
          <circle cx="14" cy="17.5" r="0.9" fill={dot} />
        </svg>
      );
    case "envelope":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="6" width="18" height="13" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M3 7l9 7 9-7"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

/* ===========================================================
   1) Hero — Research notebook card (dark navy field-notebook)
   =========================================================== */

export function ResearchNotebookCard() {
  const t = useTranslations("researchScienceInsight");
  return (
    <div className="si-notebook" aria-label={t("notebook.aria")}>
      <div className="si-notebook-paper" aria-hidden="true" />
      <div className="si-notebook-inner">
        <div className="si-notebook-head">
          <span className="si-notebook-eyebrow">
            <span className="si-notebook-dot" /> {t("notebook.eyebrow")}
          </span>
          <span className="si-notebook-status">{t("notebook.status")}</span>
        </div>

        <div className="si-notebook-entry">
          <div className="si-notebook-row">
            <span className="si-notebook-key">{t("notebook.constructKey")}</span>
            <span className="si-notebook-val">{t("notebook.constructVal")}</span>
          </div>
          <div className="si-notebook-row">
            <span className="si-notebook-key">{t("notebook.statusKey")}</span>
            <span className="si-notebook-val">{t("notebook.statusVal")}</span>
          </div>
          <div className="si-notebook-row">
            <span className="si-notebook-key">{t("notebook.confidenceKey")}</span>
            <span className="si-notebook-val">{t("notebook.confidenceVal")}</span>
          </div>
        </div>

        <div className="si-notebook-meter" aria-label={t("notebook.meterAria")}>
          <div className="si-notebook-meter-label">
            <span>{t("notebook.meterLabel")}</span>
            <span>{t("notebook.meterValue")}</span>
          </div>
          <div className="si-notebook-meter-track">
            <div className="si-notebook-meter-fill" style={{ width: "35%" }} />
          </div>
        </div>

        <div className="si-notebook-foot">
          <span className="si-notebook-stamp">{t("notebook.lastUpdated")}</span>
          <span>{t("notebook.lastUpdatedVal")}</span>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   2) "What lives under Science & insight?" — 3-column callout strip
   =========================================================== */

export function ContentScopeStrip() {
  const t = useTranslations("researchScienceInsight");
  const cols: Array<{
    icon: IconName;
    key: "methodology" | "litReviews" | "pilot";
  }> = [
    { icon: "doc", key: "methodology" },
    { icon: "book", key: "litReviews" },
    { icon: "flask", key: "pilot" },
  ];
  return (
    <div className="si-scope-grid" role="list" aria-label={t("scopeStrip.aria")}>
      {cols.map((c) => (
        <div key={c.key} className="si-scope-col" role="listitem">
          <div className="si-scope-icon">
            <SiIcon name={c.icon} />
          </div>
          <div className="si-scope-label">{t(`scopeStrip.${c.key}.label`)}</div>
          <div className="si-scope-body">{t(`scopeStrip.${c.key}.body`)}</div>
        </div>
      ))}
    </div>
  );
}

/* ===========================================================
   3) "What can readers expect here?" — Note anatomy diagram
   =========================================================== */

export function NoteAnatomyCard() {
  const t = useTranslations("researchScienceInsight");
  return (
    <div className="si-anatomy" aria-label={t("anatomy.aria")}>
      <div className="si-anatomy-card">
        <div className="si-anatomy-section">
          <span className="si-anatomy-anno">
            <span className="si-anatomy-anno-arrow">↳</span>
            {t("anatomy.anno1")}
          </span>
          <div className="si-anatomy-head">
            <span className="si-anatomy-title">{t("anatomy.title")}</span>
            <span className="si-anatomy-statusbadge">{t("anatomy.statusBadge")}</span>
          </div>
          <div className="si-anatomy-meta">
            <span>{t("anatomy.metaNote")}</span>
            <span className="si-anatomy-dot" />
            <span>{t("anatomy.metaPilot")}</span>
          </div>
        </div>

        <p className="si-anatomy-body">{t("anatomy.body")}</p>

        <div className="si-anatomy-section">
          <span className="si-anatomy-anno">
            <span className="si-anatomy-anno-arrow">↳</span>
            {t("anatomy.anno2")}
          </span>
          <div className="si-anatomy-ref">
            <span className="si-anatomy-ref-mark">[1]</span>
            {t("anatomy.ref")}
          </div>
        </div>

        <div className="si-anatomy-section">
          <span className="si-anatomy-anno">
            <span className="si-anatomy-anno-arrow">↳</span>
            {t("anatomy.anno3")}
          </span>
          <div className="si-anatomy-confidence">
            <span className="si-anatomy-conf-label">{t("anatomy.confLabel")}</span>
            <div className="si-anatomy-conf-track">
              <div className="si-anatomy-conf-fill" style={{ width: "55%" }} />
            </div>
            <span className="si-anatomy-conf-value">{t("anatomy.confValue")}</span>
          </div>
        </div>

        <div className="si-anatomy-section">
          <span className="si-anatomy-anno">
            <span className="si-anatomy-anno-arrow">↳</span>
            {t("anatomy.anno4")}
          </span>
          <a className="si-anatomy-footlink">{t("anatomy.footlink")}</a>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   4) "What will be published first?" — horizontal preview strip
   =========================================================== */

type PipelineTone = "first" | "null" | "applied" | "pilot";

export function NotePipelineStrip() {
  const t = useTranslations("researchScienceInsight");
  const cards: Array<{
    note: "note1" | "note2" | "note3" | "note4";
    tone: PipelineTone;
  }> = [
    { note: "note1", tone: "first" },
    { note: "note2", tone: "null" },
    { note: "note3", tone: "applied" },
    { note: "note4", tone: "pilot" },
  ];
  return (
    <div className="si-pipeline" role="list" aria-label={t("pipelineStrip.aria")}>
      {cards.map((c, i) => (
        <div
          key={c.note}
          className={`si-pipeline-card si-pipeline-card-${c.tone}`}
          role="listitem"
        >
          <div className="si-pipeline-stripe" />
          <div className="si-pipeline-body">
            <div className="si-pipeline-index">N{String(i + 1).padStart(2, "0")}</div>
            <div className="si-pipeline-title">{t(`pipelineStrip.${c.note}.title`)}</div>
            <span className="si-pipeline-tag">{t(`pipelineStrip.${c.note}.tag`)}</span>
            <div className="si-pipeline-status">
              <span className="si-pipeline-status-dot" />
              {t(`pipelineStrip.${c.note}.status`)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===========================================================
   5) "What this is not" — three-zone positioning spectrum
   =========================================================== */

export function PositioningSpectrum() {
  const t = useTranslations("researchScienceInsight");
  return (
    <div className="si-spectrum" aria-label={t("spectrum.aria")}>
      <div className="si-spectrum-bar">
        <div className="si-spectrum-zone si-spectrum-zone-mute">
          <span className="si-spectrum-zone-title">{t("spectrum.marketingTitle")}</span>
          <span className="si-spectrum-zone-sub">{t("spectrum.marketingSub")}</span>
        </div>
        <div className="si-spectrum-zone si-spectrum-zone-mid">
          <div className="si-spectrum-zone-mid-head">
            <span className="si-spectrum-mark" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="6" width="20" height="20" rx="4" fill="var(--accent)" />
                <rect x="11" y="11" width="10" height="10" rx="2" fill="#fff" opacity="0.85" />
              </svg>
            </span>
            <span className="si-spectrum-zone-title">{t("spectrum.midTitle")}</span>
          </div>
          <span className="si-spectrum-zone-sub">{t("spectrum.midSub")}</span>
          <span className="si-spectrum-arrow" aria-hidden="true">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path
                d="M10 1l8 11H2z"
                fill="var(--accent)"
                stroke="var(--primary)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className="si-spectrum-zone si-spectrum-zone-mute">
          <span className="si-spectrum-zone-title">{t("spectrum.journalTitle")}</span>
          <span className="si-spectrum-zone-sub">{t("spectrum.journalSub")}</span>
        </div>
      </div>
      <p className="si-spectrum-note">{t("spectrum.note")}</p>
    </div>
  );
}

/* ===========================================================
   6) Field-based research vs. cognitive games — two-column panel
   =========================================================== */

export function FieldVsGamesPanel() {
  const t = useTranslations("researchScienceInsight");
  return (
    <div className="si-field-grid">
      <div className="si-field-card si-field-card-muted">
        <div className="si-field-head">
          <span className="si-field-title">{t("fieldPanel.gameTitle")}</span>
          <span className="cc-badge cc-badge-warn">{t("fieldPanel.gameBadge")}</span>
        </div>
        <div className="si-game-mock" aria-hidden="true">
          <div className="si-game-mock-head">
            <span>{t("fieldPanel.gameLevel")}</span>
            <span>{t("fieldPanel.gameScore")}</span>
          </div>
          <div className="si-game-mock-grid">
            {[
              { shape: "circle", on: false },
              { shape: "square", on: false },
              { shape: "tri", on: true },
              { shape: "square", on: true },
              { shape: "circle", on: true },
              { shape: "tri", on: false },
            ].map((t, i) => (
              <div
                key={i}
                className={`si-game-tile${t.on ? " si-game-tile-on" : ""}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  {t.shape === "circle" && (
                    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.8" />
                  )}
                  {t.shape === "square" && (
                    <rect
                      x="6"
                      y="6"
                      width="12"
                      height="12"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  )}
                  {t.shape === "tri" && (
                    <path
                      d="M12 5l7 13H5z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </div>
            ))}
          </div>
          <div className="si-game-mock-cta">
            <span>{t("fieldPanel.gameMatch")}</span>
            <span className="si-game-mock-btn">{t("fieldPanel.gameTap")}</span>
          </div>
        </div>
        <p className="si-field-note">{t("fieldPanel.gameNote")}</p>
      </div>

      <div className="si-field-card si-field-card-real">
        <div className="si-field-head">
          <span className="si-field-title">{t("fieldPanel.scenarioTitle")}</span>
          <span className="cc-badge cc-badge-good">{t("fieldPanel.scenarioBadge")}</span>
        </div>
        <div className="si-scenario-mock" aria-hidden="true">
          <div className="si-scenario-mock-head">
            <span className="si-scenario-mock-step">{t("fieldPanel.scenarioStep")}</span>
            <span className="si-scenario-mock-tag">{t("fieldPanel.scenarioTag")}</span>
          </div>
          <p className="si-scenario-mock-prompt">{t("fieldPanel.scenarioPrompt")}</p>
          <div className="si-scenario-mock-options">
            <div className="si-option">
              <span className="si-option-key">A</span>
              {t("fieldPanel.optionA")}
            </div>
            <div className="si-option si-option-focus">
              <span className="si-option-key">B</span>
              {t("fieldPanel.optionB")}
            </div>
            <div className="si-option">
              <span className="si-option-key">C</span>
              {t("fieldPanel.optionC")}
            </div>
          </div>
        </div>
        <p className="si-field-note">{t("fieldPanel.scenarioNote")}</p>
      </div>
    </div>
  );
}

/* ===========================================================
   7) Trust signal strip — three columns
   =========================================================== */

export function TrustSignalStrip() {
  const t = useTranslations("researchScienceInsight");
  const items: Array<{
    icon: IconName;
    key: "noClaims" | "sources" | "optIn";
  }> = [
    { icon: "checkCaveat", key: "noClaims" },
    { icon: "quote", key: "sources" },
    { icon: "envelope", key: "optIn" },
  ];
  return (
    <div className="si-trust-strip" role="list" aria-label={t("trustStrip.aria")}>
      {items.map((it) => (
        <div key={it.key} className="si-trust-col" role="listitem">
          <div className="si-trust-icon">
            <SiIcon name={it.icon} tone="primary" />
          </div>
          <div className="si-trust-text">
            <div className="si-trust-title">{t(`trustStrip.${it.key}.title`)}</div>
            <div className="si-trust-body">{t(`trustStrip.${it.key}.body`)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
