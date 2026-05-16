/* ---------- Domain icons (periwinkle, abstract, instrument-like) ---------- */

type DomainKey =
  | "wm"
  | "ps"
  | "att"
  | "prob"
  | "flex"
  | "long";

function DomainIcon({ name, tone = "accent" }: { name: DomainKey; tone?: "accent" | "primary" }) {
  const stroke = tone === "accent" ? "var(--accent-soft)" : "var(--accent)";
  const fill = tone === "accent" ? "var(--accent)" : "var(--primary)";
  const common = { width: 28, height: 28, viewBox: "0 0 32 32", fill: "none" } as const;

  switch (name) {
    case "wm":
      // Stacked memory registers — three short bars rising
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="18" width="5" height="10" rx="1" stroke={stroke} strokeWidth="1.6" />
          <rect x="13.5" y="13" width="5" height="15" rx="1" stroke={stroke} strokeWidth="1.6" />
          <rect x="23" y="8" width="5" height="20" rx="1" stroke={stroke} strokeWidth="1.6" />
          <circle cx="6.5" cy="18" r="1.4" fill={fill} />
          <circle cx="16" cy="13" r="1.4" fill={fill} />
          <circle cx="25.5" cy="8" r="1.4" fill={fill} />
        </svg>
      );
    case "ps":
      // Reaction-time spike — sharp waveform
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 22 L9 22 L11 14 L13 26 L15 9 L17 22 L23 22 L25 17 L29 17"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="9" r="1.6" fill={fill} />
        </svg>
      );
    case "att":
      // Concentric target — selective filtering
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="16" cy="16" r="11" stroke={stroke} strokeWidth="1.5" />
          <circle cx="16" cy="16" r="6.5" stroke={stroke} strokeWidth="1.5" />
          <circle cx="16" cy="16" r="2.4" fill={fill} />
          <path d="M16 3v3 M16 26v3 M3 16h3 M26 16h3" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "prob":
      // 3x3 matrix with one open cell — Raven motif
      return (
        <svg {...common} aria-hidden="true">
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => {
              const x = 4 + col * 8;
              const y = 4 + row * 8;
              const isMissing = row === 2 && col === 2;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={x}
                  y={y}
                  width="6.5"
                  height="6.5"
                  rx="1"
                  stroke={stroke}
                  strokeWidth="1.4"
                  strokeDasharray={isMissing ? "1.5 1.5" : undefined}
                  fill={!isMissing && row === 1 && col === 1 ? fill : "none"}
                  opacity={!isMissing && row === 1 && col === 1 ? 0.9 : 1}
                />
              );
            })
          )}
        </svg>
      );
    case "flex":
      // Switching arrows — rule set A ⇄ rule set B
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M5 11 L26 11 L23 8 M27 21 L6 21 L9 24"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="11" r="1.6" fill={fill} />
          <circle cx="26" cy="21" r="1.6" fill={fill} />
        </svg>
      );
    case "long":
      // Composite longitudinal sparkline — many points over time
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M3 22 L7 19 L10 21 L13 15 L16 17 L19 12 L22 14 L26 9 L29 11"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {[7, 10, 13, 16, 19, 22, 26].map((x, i) => {
            const ys = [19, 21, 15, 17, 12, 14, 9];
            return <circle key={i} cx={x} cy={ys[i]} r="1.2" fill={fill} />;
          })}
        </svg>
      );
  }
}

/* ---------- Hero: 2×3 grid of domain indicators ---------- */

export function DomainCardGrid() {
  const cards: Array<{
    key: DomainKey;
    label: string;
    descriptor: string;
  }> = [
    { key: "wm", label: "Working Memory", descriptor: "Holds context under load" },
    { key: "ps", label: "Processing Speed", descriptor: "Reacts without fatigue" },
    { key: "att", label: "Attention", descriptor: "Filters noise" },
    { key: "prob", label: "Problem Solving", descriptor: "Reasons under constraint" },
    { key: "flex", label: "Cognitive Flexibility", descriptor: "Adapts rule sets" },
    { key: "long", label: "Longitudinal Index", descriptor: "Patterns over weeks" },
  ];

  return (
    <div className="cc-domain-grid" role="list" aria-label="Cognitive domains measured">
      {cards.map((c) => (
        <div key={c.key} className="cc-domain-card" role="listitem">
          <div className="cc-domain-card-top">
            <div className="cc-domain-icon">
              <DomainIcon name={c.key} />
            </div>
            <span className="cc-domain-readout" aria-hidden="true">
              <span /> <span /> <span />
            </span>
          </div>
          <div className="cc-domain-label">{c.label}</div>
          <div className="cc-domain-descriptor">{c.descriptor}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Answer pill strip ---------- */

export function DomainPillStrip() {
  const pills: Array<{ key: DomainKey; label: string }> = [
    { key: "wm", label: "Working Memory" },
    { key: "ps", label: "Processing Speed" },
    { key: "att", label: "Attention" },
    { key: "prob", label: "Problem Solving" },
    { key: "flex", label: "Cognitive Flexibility" },
  ];
  return (
    <div className="cc-pill-strip" aria-label="Five cognitive domains">
      {pills.map((p) => (
        <span key={p.key} className="cc-pill">
          <span className="cc-pill-icon">
            <DomainIcon name={p.key} tone="primary" />
          </span>
          {p.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- Per-domain scenario card with sparkline + paradigm badge ---------- */

function SignalTrace({ kind }: { kind: DomainKey }) {
  const common = { width: "100%", height: 92, viewBox: "0 0 240 92", preserveAspectRatio: "none" as const };
  const axis = "rgba(15,29,69,0.18)";
  const accent = "var(--accent)";
  const primary = "var(--primary)";

  if (kind === "wm") {
    // Stepped accuracy-over-difficulty curve (descending steps)
    const points = [
      [10, 22],
      [50, 22],
      [50, 32],
      [90, 32],
      [90, 46],
      [130, 46],
      [130, 60],
      [170, 60],
      [170, 72],
      [230, 72],
    ];
    const d = points.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(" ");
    return (
      <svg {...common} aria-hidden="true">
        <line x1="6" y1="84" x2="234" y2="84" stroke={axis} strokeWidth="1" />
        <line x1="6" y1="8" x2="6" y2="84" stroke={axis} strokeWidth="1" />
        <path d={d} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" />
        {points
          .filter((_, i) => i % 2 === 0)
          .map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill={primary} />
          ))}
        <text x="10" y="20" fontSize="9" fill="var(--ink-3)">accuracy</text>
        <text x="200" y="92" fontSize="9" fill="var(--ink-3)" textAnchor="end">difficulty →</text>
      </svg>
    );
  }

  if (kind === "ps") {
    // Reaction-time distribution (histogram, right-skewed)
    const bars = [10, 22, 38, 56, 70, 60, 42, 28, 18, 11, 7, 4];
    return (
      <svg {...common} aria-hidden="true">
        <line x1="6" y1="84" x2="234" y2="84" stroke={axis} strokeWidth="1" />
        <line x1="6" y1="8" x2="6" y2="84" stroke={axis} strokeWidth="1" />
        {bars.map((h, i) => {
          const w = 16;
          const x = 12 + i * (w + 2);
          return (
            <rect
              key={i}
              x={x}
              y={84 - h}
              width={w}
              height={h}
              rx="1.5"
              fill={i === 3 || i === 4 ? primary : accent}
              opacity={i === 3 || i === 4 ? 0.85 : 0.55}
            />
          );
        })}
        <text x="10" y="20" fontSize="9" fill="var(--ink-3)">freq</text>
        <text x="200" y="92" fontSize="9" fill="var(--ink-3)" textAnchor="end">reaction time →</text>
      </svg>
    );
  }

  if (kind === "att") {
    // Hit / false-alarm bar pair
    return (
      <svg {...common} aria-hidden="true">
        <line x1="6" y1="84" x2="234" y2="84" stroke={axis} strokeWidth="1" />
        <line x1="6" y1="8" x2="6" y2="84" stroke={axis} strokeWidth="1" />
        <rect x="50" y="22" width="50" height="62" rx="2" fill={accent} opacity="0.85" />
        <rect x="140" y="58" width="50" height="26" rx="2" fill={primary} opacity="0.65" />
        <text x="55" y="18" fontSize="9" fill="var(--ink-2)">Hits</text>
        <text x="142" y="54" fontSize="9" fill="var(--ink-2)">False alarms</text>
      </svg>
    );
  }

  if (kind === "prob") {
    // Time-on-task curve (response time decreases as familiarity rises, then plateaus)
    const pts: Array<[number, number]> = [
      [10, 22], [40, 30], [70, 42], [100, 54], [130, 62], [160, 66], [195, 68], [230, 68],
    ];
    const d = pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(" ");
    return (
      <svg {...common} aria-hidden="true">
        <line x1="6" y1="84" x2="234" y2="84" stroke={axis} strokeWidth="1" />
        <line x1="6" y1="8" x2="6" y2="84" stroke={axis} strokeWidth="1" />
        <path d={d} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" />
        <path
          d={`${d} L230 84 L10 84 Z`}
          fill="url(#cc-prob-grad)"
          opacity="0.35"
        />
        <defs>
          <linearGradient id="cc-prob-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill={primary} />
        ))}
        <text x="10" y="20" fontSize="9" fill="var(--ink-3)">time on task</text>
        <text x="200" y="92" fontSize="9" fill="var(--ink-3)" textAnchor="end">trials →</text>
      </svg>
    );
  }

  if (kind === "flex") {
    // Switch-cost decline curve over sessions
    const pts: Array<[number, number]> = [
      [10, 20], [38, 30], [66, 38], [94, 48], [122, 54], [150, 62], [180, 66], [220, 70],
    ];
    const d = pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(" ");
    return (
      <svg {...common} aria-hidden="true">
        <line x1="6" y1="84" x2="234" y2="84" stroke={axis} strokeWidth="1" />
        <line x1="6" y1="8" x2="6" y2="84" stroke={axis} strokeWidth="1" />
        <line
          x1="10"
          y1="74"
          x2="220"
          y2="74"
          stroke={axis}
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <path d={d} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill={primary} />
        ))}
        <text x="10" y="20" fontSize="9" fill="var(--ink-3)">switch cost</text>
        <text x="200" y="92" fontSize="9" fill="var(--ink-3)" textAnchor="end">sessions →</text>
      </svg>
    );
  }

  return null;
}

const DOMAIN_CONTENT: Record<
  Exclude<DomainKey, "long">,
  { paradigm: string; scenario: string }
> = {
  wm: {
    paradigm: "N-back",
    scenario:
      "Review six supplier proposals. Recall key figures while comparing the last two against the first.",
  },
  ps: {
    paradigm: "Symbol substitution",
    scenario:
      "Flag anomalies in a live operations feed before the next status report goes out.",
  },
  att: {
    paradigm: "Posner cueing",
    scenario:
      "Monitor a six-channel ops dashboard for twenty minutes. Surface genuine drift; ignore routine noise.",
  },
  prob: {
    paradigm: "Raven matrices",
    scenario:
      "A recurring scheduling conflict spans three teams and two constraints. Identify the resolvable axis first.",
  },
  flex: {
    paradigm: "Task-switching",
    scenario:
      "Switch between three escalation queues with different rules. Apply the right rule before the wrong reflex.",
  },
};

export function ScenarioCard({ domain }: { domain: Exclude<DomainKey, "long"> }) {
  const { paradigm, scenario } = DOMAIN_CONTENT[domain];
  return (
    <div className="cc-scenario-card glass">
      <span className="cc-paradigm-badge">{paradigm}</span>
      <div className="cc-scenario-label">Example scenario</div>
      <p className="cc-scenario-text">{scenario}</p>
      <div className="cc-scenario-trace">
        <SignalTrace kind={domain} />
      </div>
      <div className="cc-scenario-footer">
        <span className="cc-scenario-dot" aria-hidden="true" />
        Signal pattern captured per session
      </div>
    </div>
  );
}

/* ---------- "Why not just use cognitive games?" comparison panel ---------- */

export function GamesVsScenarioPanel() {
  return (
    <div className="cc-compare-grid">
      <div className="cc-compare-card cc-compare-card-muted">
        <div className="cc-compare-head">
          <span className="cc-compare-title">Standard cognitive game</span>
          <span className="cc-badge cc-badge-warn">Limitation</span>
        </div>
        <div className="cc-game-mock" aria-hidden="true">
          <div className="cc-game-mock-header">
            <span>Round 4</span>
            <span>Score 1,240</span>
          </div>
          <div className="cc-game-mock-grid">
            {[7, 2, 9, 4, 5, 1, 8, 3, 6].map((n, i) => (
              <div key={i} className={`cc-game-tile${n === 5 ? " cc-game-tile-on" : ""}`}>
                {n}
              </div>
            ))}
          </div>
          <div className="cc-game-mock-cta">
            <span>Match the pattern</span>
            <button type="button" className="cc-game-btn" tabIndex={-1}>Tap</button>
          </div>
        </div>
        <p className="cc-compare-note">
          Improves at the game. Transfer to real work: limited.
        </p>
      </div>

      <div className="cc-compare-card cc-compare-card-real">
        <div className="cc-compare-head">
          <span className="cc-compare-title">WelloWork scenario</span>
          <span className="cc-badge cc-badge-good">Ecologically valid</span>
        </div>
        <div className="cc-scenario-mock" aria-hidden="true">
          <div className="cc-scenario-mock-header">
            <span className="cc-scenario-mock-step">Step 2 of 3</span>
            <span className="cc-scenario-mock-tag">Ops · escalation</span>
          </div>
          <p className="cc-scenario-mock-prompt">
            Two incident queues just changed priority rules. The next ticket
            you accept will set your queue for the rest of the shift.
          </p>
          <div className="cc-scenario-mock-options">
            <div className="cc-option">
              <span className="cc-option-key">A</span>
              Take the first ticket and re-route the rest later.
            </div>
            <div className="cc-option cc-option-focus">
              <span className="cc-option-key">B</span>
              Re-read the rules; choose the queue that fits today's load.
            </div>
            <div className="cc-option">
              <span className="cc-option-key">C</span>
              Escalate to the lead and wait.
            </div>
          </div>
        </div>
        <p className="cc-compare-note">
          Captures how you actually reason and decide. Built from field
          observations.
        </p>
      </div>
    </div>
  );
}

/* ---------- "What we exclude / Why" two-column panel ---------- */

export function ExcludePanel() {
  const rows: Array<{ exclude: string; why: string }> = [
    {
      exclude: "Personality traits",
      why: "Personality assessment is a separate discipline with its own rigour requirements — and uneasy at work.",
    },
    {
      exclude: "Mood and emotion",
      why: "Held privately by the employee as optional context. Managers never see it.",
    },
    {
      exclude: "Gamified performance scores",
      why: "Improvement at games rarely transfers. We measure behaviour, not points.",
    },
  ];
  return (
    <div className="cc-exclude-card">
      <div className="cc-exclude-row cc-exclude-row-head">
        <div className="cc-exclude-head-left">What we exclude</div>
        <div className="cc-exclude-head-right">Why</div>
      </div>
      {rows.map((r) => (
        <div key={r.exclude} className="cc-exclude-row">
          <div className="cc-exclude-left">
            <span className="cc-exclude-x" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {r.exclude}
          </div>
          <div className="cc-exclude-right">{r.why}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Methodology banner ---------- */

function MethodIcon({ name }: { name: "adaptive" | "daily" | "long" }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" } as const;
  if (name === "adaptive") {
    return (
      <svg {...common} aria-hidden="true">
        <path
          d="M4 14c3 0 3-6 6-6s3 6 6 6 3-4 4-4"
          stroke="var(--accent)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="10" cy="8" r="1.6" fill="var(--primary)" />
        <circle cx="16" cy="14" r="1.6" fill="var(--primary)" />
      </svg>
    );
  }
  if (name === "daily") {
    return (
      <svg {...common} aria-hidden="true">
        <rect x="3" y="6" width="18" height="15" rx="2" stroke="var(--accent)" strokeWidth="1.7" />
        <path d="M3 11h18M8 3v4M16 3v4" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="8" cy="15" r="1.4" fill="var(--primary)" />
        <circle cx="12" cy="15" r="1.4" fill="var(--primary)" />
        <circle cx="16" cy="15" r="1.4" fill="var(--primary)" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <path
        d="M3 18l4-3 3 2 4-6 3 4 4-5"
        stroke="var(--accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="15" r="1.4" fill="var(--primary)" />
      <circle cx="13" cy="11" r="1.4" fill="var(--primary)" />
      <circle cx="20" cy="8" r="1.4" fill="var(--primary)" />
    </svg>
  );
}

export function MethodologyBanner() {
  const items: Array<{ icon: "adaptive" | "daily" | "long"; title: string; body: string }> = [
    {
      icon: "adaptive",
      title: "Adaptive difficulty",
      body: "Each session adjusts in real time to your current performance level.",
    },
    {
      icon: "daily",
      title: "Short daily sessions",
      body: "Designed for workplace rhythms — not lab conditions.",
    },
    {
      icon: "long",
      title: "Longitudinal signal",
      body: "Patterns over time matter more than any single score.",
    },
  ];
  return (
    <div className="cc-method-banner">
      {items.map((it) => (
        <div key={it.title} className="cc-method-col">
          <div className="cc-method-icon">
            <MethodIcon name={it.icon} />
          </div>
          <div className="cc-method-title">{it.title}</div>
          <div className="cc-method-body">{it.body}</div>
        </div>
      ))}
    </div>
  );
}
