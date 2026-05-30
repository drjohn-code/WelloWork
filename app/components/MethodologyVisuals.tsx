/* Methodology page visuals.
   Style language mirrors CognitiveConstructsVisuals — periwinkle accent,
   dark navy on light lavender, rounded cards, no decorative kitsch. */

import { useTranslations } from "next-intl";
import { DomainPillStrip } from "./CognitiveConstructsVisuals";
export { DomainPillStrip };

/* ===========================================================
   Shared icon set
   =========================================================== */

type IconName =
  | "branching"
  | "tag"
  | "personTrend"
  | "groupCurve"
  | "groupMin"
  | "calendarWave"
  | "annotation"
  | "diverge"
  | "bell"
  | "trendBaseline"
  | "lockBar"
  | "baselineIsolated"
  | "adaptive"
  | "clock"
  | "longTrend";

function MIcon({
  name,
  tone = "accent",
  size = 22,
}: {
  name: IconName;
  tone?: "accent" | "light";
  size?: number;
}) {
  const stroke = tone === "light" ? "var(--accent-soft)" : "var(--accent)";
  const dot = tone === "light" ? "var(--accent-soft)" : "var(--primary)";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;

  switch (name) {
    case "branching":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 12h4l3-5h4M10 17h4l3-5h4"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="3" cy="12" r="1.6" fill={dot} />
          <circle cx="21" cy="7" r="1.6" fill={dot} />
          <circle cx="21" cy="12" r="1.6" fill={dot} />
        </svg>
      );
    case "tag":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 11V4h7l11 11-7 7L3 11z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="7.5" r="1.5" fill={dot} />
        </svg>
      );
    case "personTrend":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="7" cy="6" r="2.4" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M3.5 13c0-2 1.5-3.6 3.5-3.6S10.5 11 10.5 13"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 19l3-4 3 2 4-7"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="10" r="1.4" fill={dot} />
        </svg>
      );
    case "groupCurve":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="7" cy="7" r="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="13" cy="7" r="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="19" cy="7" r="2" stroke={stroke} strokeWidth="1.5" />
          <path
            d="M3 18c3-3 6-3 9 0s6 3 9 0"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "groupMin":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="6" cy="9" r="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="12" cy="9" r="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="18" cy="9" r="2" stroke={stroke} strokeWidth="1.5" />
          <path
            d="M3 17h18"
            stroke={stroke}
            strokeWidth="1.4"
            strokeDasharray="2 3"
            strokeLinecap="round"
          />
          <path d="M8 21h8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "calendarWave":
      return (
        <svg {...common} aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="15"
            rx="2"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <path
            d="M3 10h18"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M8 3v4M16 3v4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M6 16c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "annotation":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M5 4h14v11H10l-4 4v-4H5z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 9h6M9 12h4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "diverge":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 8c5 0 5 4 9 4s5-3 9-3"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M3 16c5 0 5-4 9-4s5 3 9 3"
            stroke="var(--accent-soft)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
          <circle cx="3" cy="8" r="1.4" fill={dot} />
          <circle cx="21" cy="13" r="1.4" fill={dot} />
        </svg>
      );
    case "bell":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 19c2-7 5-13 9-13s7 6 9 13"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M2 19h20" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="14" cy="14" r="1.6" fill={dot} />
        </svg>
      );
    case "trendBaseline":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 14h18" stroke={stroke} strokeWidth="1.4" strokeDasharray="3 3" />
          <path
            d="M3 14l4-1 4 2 4-5 4 2 5-3"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="15" r="1.4" fill={dot} />
          <circle cx="15" cy="10" r="1.4" fill={dot} />
        </svg>
      );
    case "lockBar":
      return (
        <svg {...common} aria-hidden="true">
          <rect
            x="3"
            y="14"
            width="3"
            height="7"
            rx="0.6"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <rect
            x="8"
            y="10"
            width="3"
            height="11"
            rx="0.6"
            stroke="var(--accent-soft)"
            strokeWidth="1.4"
            strokeDasharray="2 2"
          />
          <rect
            x="13"
            y="7"
            width="3"
            height="14"
            rx="0.6"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <rect
            x="18"
            y="11"
            width="3.5"
            height="6"
            rx="1"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M19 11V9.5a0.8 0.8 0 0 1 1.5 0V11"
            stroke={stroke}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "baselineIsolated":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 17c3-5 6-7 9-7s6 2 9 7"
            stroke="var(--accent-soft)"
            strokeWidth="1.4"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
          <circle cx="12" cy="10" r="2.6" stroke={stroke} strokeWidth="1.7" />
          <circle cx="12" cy="10" r="1.2" fill={dot} />
        </svg>
      );
    case "adaptive":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M4 14c3 0 3-6 6-6s3 6 6 6 3-4 4-4"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="10" cy="8" r="1.6" fill={dot} />
          <circle cx="16" cy="14" r="1.6" fill={dot} />
        </svg>
      );
    case "clock":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M12 7v5l3.5 2"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="1.2" fill={dot} />
        </svg>
      );
    case "longTrend":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 18l4-3 3 2 4-6 3 4 4-5"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="15" r="1.4" fill={dot} />
          <circle cx="13" cy="11" r="1.4" fill={dot} />
          <circle cx="20" cy="8" r="1.4" fill={dot} />
        </svg>
      );
  }
}

/* ===========================================================
   1) Hero pipeline — 4 vertical navy nodes, periwinkle connectors
   =========================================================== */

export function MeasurementPipeline() {
  const t = useTranslations("researchMethodology");
  const nodes: Array<{
    icon: IconName;
    label: string;
    subtitle: string;
    n: string;
  }> = [
    {
      n: "01",
      icon: "branching",
      label: t("pipeline.adaptive.label"),
      subtitle: t("pipeline.adaptive.subtitle"),
    },
    {
      n: "02",
      icon: "tag",
      label: t("pipeline.mapping.label"),
      subtitle: t("pipeline.mapping.subtitle"),
    },
    {
      n: "03",
      icon: "personTrend",
      label: t("pipeline.baseline.label"),
      subtitle: t("pipeline.baseline.subtitle"),
    },
    {
      n: "04",
      icon: "groupCurve",
      label: t("pipeline.aggregate.label"),
      subtitle: t("pipeline.aggregate.subtitle"),
    },
  ];

  return (
    <div className="mp-pipeline" aria-label={t("pipeline.aria")}>
      <ol className="mp-pipeline-list">
        {nodes.map((node, i) => (
          <li key={node.n} className="mp-pipeline-node">
            <div className="mp-pipeline-row">
              <span className="mp-pipeline-index">{node.n}</span>
              <span className="mp-pipeline-icon">
                <MIcon name={node.icon} tone="light" />
              </span>
              <div className="mp-pipeline-text">
                <div className="mp-pipeline-label">{node.label}</div>
                <div className="mp-pipeline-subtitle">{node.subtitle}</div>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <span className="mp-pipeline-connector" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <div className="mp-pipeline-badge" role="note">
        {t("pipeline.badge")}
      </div>
    </div>
  );
}

/* ===========================================================
   3) Task → Construct mapping reference card
   =========================================================== */

export function ConstructMappingCard() {
  const t = useTranslations("researchMethodology");
  const rows: Array<{ task: string; construct: string }> = [
    {
      task: t("mappingCard.rows.sequenceRecall.task"),
      construct: t("mappingCard.rows.sequenceRecall.construct"),
    },
    {
      task: t("mappingCard.rows.symbolSubstitution.task"),
      construct: t("mappingCard.rows.symbolSubstitution.construct"),
    },
    {
      task: t("mappingCard.rows.targetDetection.task"),
      construct: t("mappingCard.rows.targetDetection.construct"),
    },
  ];

  return (
    <div className="mp-mapping-card">
      <div className="mp-mapping-head">
        <span className="mp-mapping-col-head">{t("mappingCard.colTask")}</span>
        <span className="mp-mapping-col-head mp-mapping-col-head-right">
          {t("mappingCard.colConstruct")}
        </span>
      </div>
      <ul className="mp-mapping-rows">
        {rows.map((r) => (
          <li key={r.task} className="mp-mapping-row">
            <span className="mp-mapping-task">{r.task}</span>
            <span className="mp-mapping-arrow" aria-hidden="true">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path
                  d="M1 5h13M10 1l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="mp-mapping-construct">{r.construct}</span>
          </li>
        ))}
      </ul>
      <p className="mp-mapping-footnote">{t("mappingCard.footnote")}</p>
    </div>
  );
}

/* ===========================================================
   4) Population ranking vs Within-person baseline
   =========================================================== */

function BellCurveSilhouette() {
  const t = useTranslations("researchMethodology");
  return (
    <svg
      width="100%"
      height="110"
      viewBox="0 0 220 110"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mp-bell-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(15,29,69,0.18)" />
          <stop offset="100%" stopColor="rgba(15,29,69,0)" />
        </linearGradient>
      </defs>
      <line
        x1="6"
        y1="94"
        x2="214"
        y2="94"
        stroke="rgba(15,29,69,0.18)"
        strokeWidth="1"
      />
      <path
        d="M10 94 C 60 94, 70 26, 110 26 C 150 26, 160 94, 210 94"
        fill="url(#mp-bell-grad)"
        stroke="rgba(15,29,69,0.40)"
        strokeWidth="1.6"
      />
      <line
        x1="148"
        y1="32"
        x2="148"
        y2="94"
        stroke="#B43F1A"
        strokeWidth="1.6"
        strokeDasharray="3 3"
      />
      <circle cx="148" cy="40" r="3.4" fill="#B43F1A" />
      <text
        x="155"
        y="42"
        fontSize="10"
        fill="#7a3217"
        fontFamily="var(--font-body)"
      >
        {t("bellCurve.youVsOthers")}
      </text>
      <text x="10" y="18" fontSize="9.5" fill="var(--ink-3)">
        {t("bellCurve.population")}
      </text>
    </svg>
  );
}

function WithinPersonTrend() {
  const t = useTranslations("researchMethodology");
  return (
    <svg
      width="100%"
      height="110"
      viewBox="0 0 220 110"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mp-trend-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line
        x1="6"
        y1="94"
        x2="214"
        y2="94"
        stroke="rgba(15,29,69,0.18)"
        strokeWidth="1"
      />
      <line
        x1="6"
        y1="64"
        x2="214"
        y2="64"
        stroke="rgba(15,29,69,0.18)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <text x="10" y="60" fontSize="9.5" fill="var(--ink-3)">
        {t("withinPerson.yourBaseline")}
      </text>
      <path
        d="M10 66 L40 64 L70 65 L100 63 L130 50 L160 44 L190 46 L210 48"
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 66 L40 64 L70 65 L100 63 L130 50 L160 44 L190 46 L210 48 L210 94 L10 94 Z"
        fill="url(#mp-trend-grad)"
      />
      {[
        [40, 64],
        [70, 65],
        [100, 63],
        [130, 50],
        [160, 44],
        [190, 46],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="var(--primary)" />
      ))}
      <circle cx="160" cy="44" r="4.6" fill="none" stroke="#1F7A45" strokeWidth="1.6" />
      <text x="148" y="36" fontSize="9.5" fill="#1F7A45">
        {t("withinPerson.yourGain")}
      </text>
    </svg>
  );
}

export function NormalisationCompareCard() {
  const t = useTranslations("researchMethodology");
  return (
    <div className="mp-norm-card">
      <div className="mp-norm-grid">
        <div className="mp-norm-col mp-norm-col-muted">
          <div className="mp-norm-head">
            <span className="mp-norm-title">{t("normCard.populationTitle")}</span>
            <span className="cc-badge cc-badge-warn">
              {t("normCard.populationBadge")}
            </span>
          </div>
          <div className="mp-norm-figure">
            <BellCurveSilhouette />
          </div>
          <p className="mp-norm-note">{t("normCard.populationNote")}</p>
        </div>
        <div className="mp-norm-col mp-norm-col-real">
          <div className="mp-norm-head">
            <span className="mp-norm-title">
              {t("normCard.withinPersonTitle")}
            </span>
            <span className="cc-badge cc-badge-good">
              {t("normCard.withinPersonBadge")}
            </span>
          </div>
          <div className="mp-norm-figure">
            <WithinPersonTrend />
          </div>
          <p className="mp-norm-note">{t("normCard.withinPersonNote")}</p>
        </div>
      </div>
      <p className="mp-norm-caption">{t("normCard.caption")}</p>
    </div>
  );
}

/* ===========================================================
   5) Aggregation 2×2 grid
   =========================================================== */

export function AggregationGrid() {
  const t = useTranslations("researchMethodology");
  const cards: Array<{
    key: string;
    icon: IconName;
    title: string;
    body: string;
  }> = [
    {
      key: "minTeamSize",
      icon: "groupMin",
      title: t("aggrGrid.minTeamSize.title"),
      body: t("aggrGrid.minTeamSize.body"),
    },
    {
      key: "weeklySmoothing",
      icon: "calendarWave",
      title: t("aggrGrid.weeklySmoothing.title"),
      body: t("aggrGrid.weeklySmoothing.body"),
    },
    {
      key: "workEvents",
      icon: "annotation",
      title: t("aggrGrid.workEvents.title"),
      body: t("aggrGrid.workEvents.body"),
    },
    {
      key: "levelVariability",
      icon: "diverge",
      title: t("aggrGrid.levelVariability.title"),
      body: t("aggrGrid.levelVariability.body"),
    },
  ];

  return (
    <div className="mp-aggr-grid">
      {cards.map((c) => (
        <div key={c.key} className="mp-aggr-card">
          <div className="mp-aggr-icon">
            <MIcon name={c.icon} tone="light" />
          </div>
          <div className="mp-aggr-title">{c.title}</div>
          <div className="mp-aggr-body">{c.body}</div>
        </div>
      ))}
    </div>
  );
}

/* ===========================================================
   6) Claims contrast panel — "Supported" vs "Out of scope"
   =========================================================== */

export function ClaimsContrastPanel() {
  const t = useTranslations("researchMethodology");
  const supported: Array<{ key: string; label: string }> = [
    { key: "trends", label: t("claims.supported.trends") },
    { key: "teamPatterns", label: t("claims.supported.teamPatterns") },
    { key: "signals", label: t("claims.supported.signals") },
    { key: "variance", label: t("claims.supported.variance") },
  ];
  const outOfScope: Array<{ key: string; label: string }> = [
    { key: "businessOutcomes", label: t("claims.outOfScope.businessOutcomes") },
    { key: "clinical", label: t("claims.outOfScope.clinical") },
    { key: "ranking", label: t("claims.outOfScope.ranking") },
    { key: "selfInvented", label: t("claims.outOfScope.selfInvented") },
  ];

  return (
    <div className="mp-claims-grid">
      <div className="mp-claims-col mp-claims-col-good">
        <div className="mp-claims-head">
          <span className="mp-claims-title">{t("claims.supportedTitle")}</span>
          <span className="cc-badge cc-badge-good">
            {t("claims.supportedBadge")}
          </span>
        </div>
        <ul className="mp-claims-list">
          {supported.map((item) => (
            <li key={item.key} className="mp-claims-item mp-claims-item-good">
              <span className="mp-claims-mark" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mp-claims-col mp-claims-col-warn">
        <div className="mp-claims-head">
          <span className="mp-claims-title">{t("claims.outOfScopeTitle")}</span>
          <span className="cc-badge cc-badge-warn">
            {t("claims.outOfScopeBadge")}
          </span>
        </div>
        <ul className="mp-claims-list">
          {outOfScope.map((item) => (
            <li key={item.key} className="mp-claims-item mp-claims-item-warn">
              <span className="mp-claims-mark" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ===========================================================
   7) Publish timeline — 3 milestones
   =========================================================== */

export function PublishTimeline() {
  const t = useTranslations("researchMethodology");
  const stops: Array<{
    title: string;
    state: "muted" | "muted2" | "active";
  }> = [
    { title: t("timeline.stop1"), state: "muted" },
    { title: t("timeline.stop2"), state: "muted2" },
    { title: t("timeline.stop3"), state: "active" },
  ];

  return (
    <div className="mp-timeline-wrap">
      <ol className="mp-timeline" aria-label={t("timeline.aria")}>
        {stops.map((s, i) => (
          <li key={s.state} className={`mp-timeline-stop mp-timeline-${s.state}`}>
            <span className="mp-timeline-dot" aria-hidden="true">
              <span className="mp-timeline-dot-inner" />
            </span>
            <span className="mp-timeline-index">M{i + 1}</span>
            <span className="mp-timeline-label">{s.title}</span>
          </li>
        ))}
      </ol>
      <p className="mp-timeline-note">{t("timeline.note")}</p>
    </div>
  );
}

/* ===========================================================
   8) Privacy explainer — 2-col card
   =========================================================== */

export function PrivacyExplainerGrid() {
  const t = useTranslations("researchMethodology");
  return (
    <div className="mp-privacy-wrap">
      <div className="mp-privacy-grid">
        <div className="mp-privacy-col">
          <div className="mp-privacy-icon">
            <MIcon name="baselineIsolated" tone="light" />
          </div>
          <div className="mp-privacy-title">
            {t("privacyGrid.withinPerson.title")}
          </div>
          <p className="mp-privacy-body">
            {t("privacyGrid.withinPerson.body")}
          </p>
        </div>
        <div className="mp-privacy-col">
          <div className="mp-privacy-icon">
            <MIcon name="lockBar" tone="light" />
          </div>
          <div className="mp-privacy-title">
            {t("privacyGrid.subThreshold.title")}
          </div>
          <p className="mp-privacy-body">
            {t("privacyGrid.subThreshold.body")}
          </p>
        </div>
      </div>
      <p className="mp-privacy-caption">{t("privacyGrid.caption")}</p>
    </div>
  );
}

/* ===========================================================
   9) WelloWork scenarios vs cognitive games (methodology variant)
   =========================================================== */

export function ScenariosVsGamesPanel() {
  const t = useTranslations("researchMethodology");
  return (
    <div className="cc-compare-grid">
      <div className="cc-compare-card cc-compare-card-muted">
        <div className="cc-compare-head">
          <span className="cc-compare-title">
            {t("scenariosPanel.gameTitle")}
          </span>
          <span className="cc-badge cc-badge-warn">
            {t("scenariosPanel.gameBadge")}
          </span>
        </div>
        <div className="cc-game-mock" aria-hidden="true">
          <div className="cc-game-mock-header">
            <span>{t("scenariosPanel.gameLevel")}</span>
            <span>{t("scenariosPanel.gameStreak")}</span>
          </div>
          <div className="cc-game-mock-grid">
            {[3, 7, 2, 8, 5, 9, 1, 4, 6].map((n, i) => (
              <div
                key={i}
                className={`cc-game-tile${n === 5 ? " cc-game-tile-on" : ""}`}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="cc-game-mock-cta">
            <span>{t("scenariosPanel.gameMatch")}</span>
            <button type="button" className="cc-game-btn" tabIndex={-1}>
              {t("scenariosPanel.gameTap")}
            </button>
          </div>
        </div>
        <p className="cc-compare-note">{t("scenariosPanel.gameNote")}</p>
      </div>

      <div className="cc-compare-card cc-compare-card-real">
        <div className="cc-compare-head">
          <span className="cc-compare-title">
            {t("scenariosPanel.scenarioTitle")}
          </span>
          <span className="cc-badge cc-badge-good">
            {t("scenariosPanel.scenarioBadge")}
          </span>
        </div>
        <div className="cc-scenario-mock" aria-hidden="true">
          <div className="cc-scenario-mock-header">
            <span className="cc-scenario-mock-step">
              {t("scenariosPanel.scenarioStep")}
            </span>
            <span className="cc-scenario-mock-tag">
              {t("scenariosPanel.scenarioTag")}
            </span>
          </div>
          <p className="cc-scenario-mock-prompt">
            {t("scenariosPanel.scenarioPrompt")}
          </p>
          <div className="cc-scenario-mock-options">
            <div className="cc-option">
              <span className="cc-option-key">A</span>
              {t("scenariosPanel.optionA")}
            </div>
            <div className="cc-option cc-option-focus">
              <span className="cc-option-key">B</span>
              {t("scenariosPanel.optionB")}
            </div>
            <div className="cc-option">
              <span className="cc-option-key">C</span>
              {t("scenariosPanel.optionC")}
            </div>
          </div>
        </div>
        <p className="cc-compare-note">{t("scenariosPanel.scenarioNote")}</p>
      </div>
    </div>
  );
}

/* ===========================================================
   10) Closing methodology banner (3-col, reuses cc-method-* CSS)
   =========================================================== */

export function ClosingMethodologyBanner() {
  const t = useTranslations("researchMethodology");
  const items: Array<{
    key: string;
    icon: IconName;
    title: string;
    body: string;
  }> = [
    {
      key: "adaptive",
      icon: "adaptive",
      title: t("closingBanner.adaptive.title"),
      body: t("closingBanner.adaptive.body"),
    },
    {
      key: "workplace",
      icon: "clock",
      title: t("closingBanner.workplace.title"),
      body: t("closingBanner.workplace.body"),
    },
    {
      key: "signal",
      icon: "longTrend",
      title: t("closingBanner.signal.title"),
      body: t("closingBanner.signal.body"),
    },
  ];
  return (
    <div className="cc-method-banner">
      {items.map((it) => (
        <div key={it.key} className="cc-method-col">
          <div className="cc-method-icon">
            <MIcon name={it.icon} />
          </div>
          <div className="cc-method-title">{it.title}</div>
          <div className="cc-method-body">{it.body}</div>
        </div>
      ))}
    </div>
  );
}
