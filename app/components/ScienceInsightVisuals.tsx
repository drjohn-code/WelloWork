/* Science & Insight page visuals.
   Style language mirrors CognitiveConstructsVisuals / MethodologyVisuals:
   periwinkle accent, dark navy on light lavender, rounded cards, no kitsch. */

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
  return (
    <div className="si-notebook" aria-label="Sample research note in progress">
      <div className="si-notebook-paper" aria-hidden="true" />
      <div className="si-notebook-inner">
        <div className="si-notebook-head">
          <span className="si-notebook-eyebrow">
            <span className="si-notebook-dot" /> Research note
          </span>
          <span className="si-notebook-status">Work in progress</span>
        </div>

        <div className="si-notebook-entry">
          <div className="si-notebook-row">
            <span className="si-notebook-key">Construct</span>
            <span className="si-notebook-val">N-back transfer</span>
          </div>
          <div className="si-notebook-row">
            <span className="si-notebook-key">Status</span>
            <span className="si-notebook-val">Hypothesis</span>
          </div>
          <div className="si-notebook-row">
            <span className="si-notebook-key">Confidence</span>
            <span className="si-notebook-val">Low–Medium</span>
          </div>
        </div>

        <div className="si-notebook-meter" aria-label="Confidence ~35%">
          <div className="si-notebook-meter-label">
            <span>Confidence</span>
            <span>35%</span>
          </div>
          <div className="si-notebook-meter-track">
            <div className="si-notebook-meter-fill" style={{ width: "35%" }} />
          </div>
        </div>

        <div className="si-notebook-foot">
          <span className="si-notebook-stamp">Last updated</span>
          <span>Pilot cohort 2 · Pending replication</span>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   2) "What lives under Science & insight?" — 3-column callout strip
   =========================================================== */

export function ContentScopeStrip() {
  const cols: Array<{
    icon: IconName;
    label: string;
    body: string;
  }> = [
    {
      icon: "doc",
      label: "Methodology notes",
      body: "How we designed each construct and why.",
    },
    {
      icon: "book",
      label: "Mini literature reviews",
      body: "What the research actually says — including the weak spots.",
    },
    {
      icon: "flask",
      label: "Pilot observations",
      body: "Early cohort data and what it changed in our design.",
    },
  ];
  return (
    <div className="si-scope-grid" role="list" aria-label="What this section contains">
      {cols.map((c) => (
        <div key={c.label} className="si-scope-col" role="listitem">
          <div className="si-scope-icon">
            <SiIcon name={c.icon} />
          </div>
          <div className="si-scope-label">{c.label}</div>
          <div className="si-scope-body">{c.body}</div>
        </div>
      ))}
    </div>
  );
}

/* ===========================================================
   3) "What can readers expect here?" — Note anatomy diagram
   =========================================================== */

export function NoteAnatomyCard() {
  return (
    <div className="si-anatomy" aria-label="Anatomy of a research note">
      <div className="si-anatomy-card">
        <div className="si-anatomy-head">
          <span className="si-anatomy-title">Within-employee normalisation</span>
          <span className="si-anatomy-statusbadge" data-callout="status">
            Working hypothesis
          </span>
        </div>
        <div className="si-anatomy-meta">
          <span>Note · 2026-Q2</span>
          <span className="si-anatomy-dot" />
          <span>Pilot cohort 2</span>
        </div>
        <p className="si-anatomy-body">
          Per-employee z-scoring removes inter-individual noise that population-relative
          scoring inherits. The transfer cost is measurable but small in pilot data.
        </p>
        <div className="si-anatomy-ref" data-callout="ref">
          <span className="si-anatomy-ref-mark">[1]</span>
          Owen et al. (2010); Melby-Lervåg &amp; Hulme (2013); Soveri et al. (2017).
        </div>
        <div className="si-anatomy-confidence" data-callout="conf">
          <span className="si-anatomy-conf-label">Confidence</span>
          <div className="si-anatomy-conf-track">
            <div className="si-anatomy-conf-fill" style={{ width: "55%" }} />
          </div>
          <span className="si-anatomy-conf-value">Medium</span>
        </div>
        <a className="si-anatomy-footlink" data-callout="link">
          ↳ Linked from methodology overview
        </a>

        {/* Annotation callouts */}
        <span className="si-anatomy-tag si-anatomy-tag-status">
          <span className="si-anatomy-tag-line" />
          Working hypothesis vs. established finding
        </span>
        <span className="si-anatomy-tag si-anatomy-tag-ref">
          <span className="si-anatomy-tag-line" />
          Primary sources cited
        </span>
        <span className="si-anatomy-tag si-anatomy-tag-conf">
          <span className="si-anatomy-tag-line" />
          Confidence level indicated
        </span>
        <span className="si-anatomy-tag si-anatomy-tag-link">
          <span className="si-anatomy-tag-line" />
          Links back to methodology
        </span>
      </div>
    </div>
  );
}

/* ===========================================================
   4) "What will be published first?" — horizontal preview strip
   =========================================================== */

type PipelineTone = "first" | "null" | "applied" | "pilot";

export function NotePipelineStrip() {
  const cards: Array<{
    title: string;
    tag: string;
    status: string;
    tone: PipelineTone;
  }> = [
    {
      title: "Within-employee normalisation",
      tag: "Scoring methodology",
      status: "Coming first",
      tone: "first",
    },
    {
      title: "N-back transfer effects",
      tag: "Construct validity",
      status: "Includes null results",
      tone: "null",
    },
    {
      title: "Minimum team-size thresholds",
      tag: "Aggregation design",
      status: "Applied",
      tone: "applied",
    },
    {
      title: "Session-cadence drop-off",
      tag: "Pilot observation",
      status: "Design response included",
      tone: "pilot",
    },
  ];
  return (
    <div className="si-pipeline" role="list" aria-label="Upcoming research notes">
      {cards.map((c, i) => (
        <div
          key={c.title}
          className={`si-pipeline-card si-pipeline-card-${c.tone}`}
          role="listitem"
        >
          <div className="si-pipeline-stripe" />
          <div className="si-pipeline-body">
            <div className="si-pipeline-index">N{String(i + 1).padStart(2, "0")}</div>
            <div className="si-pipeline-title">{c.title}</div>
            <span className="si-pipeline-tag">{c.tag}</span>
            <div className="si-pipeline-status">
              <span className="si-pipeline-status-dot" />
              {c.status}
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
  return (
    <div className="si-spectrum" aria-label="WelloWork research positioning">
      <div className="si-spectrum-bar">
        <div className="si-spectrum-zone si-spectrum-zone-mute">
          <span className="si-spectrum-zone-title">Marketing blog</span>
          <span className="si-spectrum-zone-sub">Claims without uncertainty</span>
        </div>
        <div className="si-spectrum-zone si-spectrum-zone-mid">
          <div className="si-spectrum-zone-mid-head">
            <span className="si-spectrum-mark" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="6" width="20" height="20" rx="4" fill="var(--accent)" />
                <rect x="11" y="11" width="10" height="10" rx="2" fill="#fff" opacity="0.85" />
              </svg>
            </span>
            <span className="si-spectrum-zone-title">Science &amp; Insight</span>
          </div>
          <span className="si-spectrum-zone-sub">
            Working notes · caveats visible · honest about gaps
          </span>
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
          <span className="si-spectrum-zone-title">Peer-reviewed journal</span>
          <span className="si-spectrum-zone-sub">Finished claims · full peer review</span>
        </div>
      </div>
      <p className="si-spectrum-note">
        Anything that reaches publication standard will be linked from here.
      </p>
    </div>
  );
}

/* ===========================================================
   6) Field-based research vs. cognitive games — two-column panel
   =========================================================== */

export function FieldVsGamesPanel() {
  return (
    <div className="si-field-grid">
      <div className="si-field-card si-field-card-muted">
        <div className="si-field-head">
          <span className="si-field-title">How cognitive games measure performance</span>
          <span className="cc-badge cc-badge-warn">Limitation</span>
        </div>
        <div className="si-game-mock" aria-hidden="true">
          <div className="si-game-mock-head">
            <span>Level 3</span>
            <span>Score 820</span>
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
            <span>Match the shape</span>
            <span className="si-game-mock-btn">Tap</span>
          </div>
        </div>
        <p className="si-field-note">
          Participants improve at the game. Transfer to actual workplace complexity:
          limited. Dozens of meta-analyses confirm this.
        </p>
      </div>

      <div className="si-field-card si-field-card-real">
        <div className="si-field-head">
          <span className="si-field-title">How WelloWork measures performance</span>
          <span className="cc-badge cc-badge-good">Field-grounded</span>
        </div>
        <div className="si-scenario-mock" aria-hidden="true">
          <div className="si-scenario-mock-head">
            <span className="si-scenario-mock-step">Step 2 of 3</span>
            <span className="si-scenario-mock-tag">Procurement · shortlist</span>
          </div>
          <p className="si-scenario-mock-prompt">
            You&rsquo;ve reviewed 5 supplier proposals. Two new constraints just
            arrived. Which original shortlist still holds?
          </p>
          <div className="si-scenario-mock-options">
            <div className="si-option">
              <span className="si-option-key">A</span>
              Shortlist A — drop suppliers 2 and 4.
            </div>
            <div className="si-option si-option-focus">
              <span className="si-option-key">B</span>
              Shortlist B — keep 1, 3, 5; re-score against new constraints.
            </div>
            <div className="si-option">
              <span className="si-option-key">C</span>
              Restart the review with the new constraints applied first.
            </div>
          </div>
        </div>
        <p className="si-field-note">
          Designed from field observations of real workplace decisions. Measures
          behavioral patterns, not game skill.
        </p>
      </div>
    </div>
  );
}

/* ===========================================================
   7) Trust signal strip — three columns
   =========================================================== */

export function TrustSignalStrip() {
  const items: Array<{ icon: IconName; title: string; body: string }> = [
    {
      icon: "checkCaveat",
      title: "No finished claims",
      body: "We publish before we're certain. We say so.",
    },
    {
      icon: "quote",
      title: "Sources named",
      body: "Every note identifies primary literature.",
    },
    {
      icon: "envelope",
      title: "Opt-in only",
      body: "No list adds. Unsubscribe any time.",
    },
  ];
  return (
    <div className="si-trust-strip" role="list" aria-label="Editorial commitments">
      {items.map((it) => (
        <div key={it.title} className="si-trust-col" role="listitem">
          <div className="si-trust-icon">
            <SiIcon name={it.icon} tone="primary" />
          </div>
          <div className="si-trust-text">
            <div className="si-trust-title">{it.title}</div>
            <div className="si-trust-body">{it.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
