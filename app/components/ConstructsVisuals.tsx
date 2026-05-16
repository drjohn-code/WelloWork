/* Scientific-style visuals for /research/cognitive-constructs.
   Clean line-art SVG. No drop shadows, no decorative gradients. */

const NAVY = "var(--primary)";
const ACCENT = "var(--accent)";
const INK_2 = "var(--ink-2)";
const INK_3 = "var(--ink-3)";
const GRID = "rgba(15,29,69,0.10)";
const MUTED_FILL = "rgba(15,29,69,0.10)";
const MUTED_STROKE = "rgba(15,29,69,0.35)";
const ACCENT_FILL = "rgba(92,115,251,0.22)";

/* ============================================================
   1. Hero — radar / spider chart
   ============================================================ */

export function RadarChart() {
  const cx = 150;
  const cy = 150;
  const R = 108;
  const axes = [
    "Working Memory",
    "Processing Speed",
    "Attention",
    "Problem Solving",
    "Cognitive Flexibility",
  ];
  const n = axes.length;

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  const pointAt = (i: number, frac: number) => {
    const a = angleFor(i);
    return [cx + Math.cos(a) * R * frac, cy + Math.sin(a) * R * frac] as const;
  };

  // Two overlapping polygons (illustrative shapes, not real data)
  const benchmark = [0.62, 0.7, 0.66, 0.6, 0.64];
  const sample = [0.78, 0.55, 0.82, 0.68, 0.72];

  const polyPoints = (vals: number[]) =>
    vals.map((v, i) => pointAt(i, v).join(",")).join(" ");

  const tickFracs = [0.25, 0.5, 0.75, 1];

  return (
    <div className="constructs-radar-card glass">
      <div className="constructs-card-eyebrow">5-domain profile</div>
      <svg viewBox="0 0 300 320" width="100%" aria-hidden="true">
        {/* concentric gridlines */}
        {tickFracs.map((f) => (
          <polygon
            key={f}
            points={Array.from({ length: n }, (_, i) =>
              pointAt(i, f).join(",")
            ).join(" ")}
            fill="none"
            stroke={GRID}
            strokeWidth="1"
          />
        ))}

        {/* radial axes */}
        {axes.map((_, i) => {
          const [x, y] = pointAt(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={GRID}
              strokeWidth="1"
            />
          );
        })}

        {/* axis tick marks */}
        {axes.map((_, i) =>
          tickFracs.map((f) => {
            const [x, y] = pointAt(i, f);
            return (
              <circle
                key={`${i}-${f}`}
                cx={x}
                cy={y}
                r="1.4"
                fill="rgba(15,29,69,0.28)"
              />
            );
          })
        )}

        {/* Benchmark polygon (muted gray) */}
        <polygon
          points={polyPoints(benchmark)}
          fill={MUTED_FILL}
          stroke={MUTED_STROKE}
          strokeWidth="1.4"
        />
        {/* Sample polygon (periwinkle) */}
        <polygon
          points={polyPoints(sample)}
          fill={ACCENT_FILL}
          stroke={ACCENT}
          strokeWidth="1.6"
        />
        {/* Sample data points */}
        {sample.map((v, i) => {
          const [x, y] = pointAt(i, v);
          return (
            <circle key={i} cx={x} cy={y} r="3" fill={ACCENT} stroke="white" strokeWidth="1.2" />
          );
        })}

        {/* Axis labels */}
        {axes.map((label, i) => {
          const a = angleFor(i);
          const lx = cx + Math.cos(a) * (R + 24);
          const ly = cy + Math.sin(a) * (R + 24);
          const anchor =
            Math.abs(Math.cos(a)) < 0.2
              ? "middle"
              : Math.cos(a) > 0
              ? "start"
              : "end";
          return (
            <text
              key={label}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="600"
              fill={NAVY}
              style={{ letterSpacing: "0.01em" }}
            >
              {label}
            </text>
          );
        })}
      </svg>

      <div className="constructs-radar-legend">
        <span className="constructs-legend-item">
          <span
            className="constructs-legend-swatch"
            style={{ background: MUTED_FILL, borderColor: MUTED_STROKE }}
          />
          Role benchmark
        </span>
        <span className="constructs-legend-item">
          <span
            className="constructs-legend-swatch"
            style={{ background: ACCENT_FILL, borderColor: ACCENT }}
          />
          Sample profile
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   2. FAQ card — horizontal icon strip
   ============================================================ */

function ConstructIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  if (name === "memory") {
    // Brain + chip
    return (
      <svg {...common} aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="2" stroke={ACCENT} strokeWidth="1.6" />
        <path d="M9 9h6v6H9z" stroke={ACCENT} strokeWidth="1.4" />
        <path
          d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"
          stroke={ACCENT}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "speed") {
    return (
      <svg {...common} aria-hidden="true">
        <path
          d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"
          stroke={ACCENT}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="rgba(92,115,251,0.12)"
        />
      </svg>
    );
  }
  if (name === "attention") {
    return (
      <svg {...common} aria-hidden="true">
        <ellipse cx="12" cy="12" rx="9" ry="5.5" stroke={ACCENT} strokeWidth="1.6" />
        <circle cx="12" cy="12" r="2.4" fill={ACCENT} />
        <circle cx="12" cy="12" r="0.9" fill="white" />
      </svg>
    );
  }
  if (name === "problem") {
    return (
      <svg {...common} aria-hidden="true">
        <path
          d="M9 4h3v3a1.5 1.5 0 003 0V4h4v4h-3a1.5 1.5 0 000 3h3v4h-4v-3a1.5 1.5 0 00-3 0v3H4v-4h3a1.5 1.5 0 000-3H4V4h5z"
          stroke={ACCENT}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // flex
  return (
    <svg {...common} aria-hidden="true">
      <path
        d="M4 8h12l-3-3M20 16H8l3 3"
        stroke={ACCENT}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function ConstructIconStrip() {
  const items = [
    { icon: "memory", label: "Working memory" },
    { icon: "speed", label: "Processing speed" },
    { icon: "attention", label: "Selective attention" },
    { icon: "problem", label: "Problem solving" },
    { icon: "flex", label: "Cognitive flexibility" },
  ];
  return (
    <div className="constructs-icon-strip">
      {items.map((it) => (
        <div key={it.label} className="constructs-icon-cell">
          <div className="constructs-icon-pill">
            <ConstructIcon name={it.icon} />
          </div>
          <div className="constructs-icon-label">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   3. Working memory — N-back diagram
   ============================================================ */

export function NBackDiagram() {
  const seq = ["A", "C", "B", "C", "?"];
  const matchIdx = 4;
  const refIdx = 2; // N=2 back match target
  return (
    <div className="glass constructs-visual-card">
      <div className="constructs-card-eyebrow">N-back paradigm</div>

      <svg viewBox="0 0 320 170" width="100%" aria-hidden="true">
        {/* Sequence boxes */}
        {seq.map((letter, i) => {
          const x = 16 + i * 60;
          const isMatch = i === matchIdx;
          const isRef = i === refIdx;
          return (
            <g key={i}>
              <rect
                x={x}
                y={32}
                width="48"
                height="48"
                rx="8"
                fill={isMatch ? "rgba(92,115,251,0.14)" : "white"}
                stroke={isMatch ? ACCENT : "rgba(15,29,69,0.18)"}
                strokeWidth={isMatch ? "1.8" : "1.2"}
                strokeDasharray={isMatch ? "4 3" : undefined}
              />
              <text
                x={x + 24}
                y={62}
                textAnchor="middle"
                fontSize="22"
                fontWeight="700"
                fill={isMatch ? ACCENT : NAVY}
                style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
              >
                {letter}
              </text>
              {isRef && (
                <text
                  x={x + 24}
                  y={22}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="600"
                  fill={INK_3}
                  style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  N−2
                </text>
              )}
              {isMatch && (
                <text
                  x={x + 24}
                  y={96}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={ACCENT}
                  style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  match?
                </text>
              )}
            </g>
          );
        })}

        {/* Curved arrow connecting N-2 → current */}
        <path
          d={`M ${16 + refIdx * 60 + 24} 28 Q ${16 + (refIdx + 1) * 60} 8 ${
            16 + matchIdx * 60 + 24
          } 28`}
          stroke={ACCENT}
          strokeWidth="1.3"
          fill="none"
          strokeDasharray="3 3"
          markerEnd="url(#nb-arrow)"
        />
        <defs>
          <marker
            id="nb-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 5 L0 10 z" fill={ACCENT} />
          </marker>
          <marker
            id="ramp-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 5 L0 10 z" fill={NAVY} />
          </marker>
        </defs>

        {/* N=2 back label */}
        <text x={160} y={108} textAnchor="middle" fontSize="11" fontWeight="600" fill={INK_2}>
          Is the current letter the same as 2 steps back?
        </text>
        <text x={160} y={124} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={NAVY}>
          N = 2 back
        </text>

        {/* Adaptive difficulty ramp */}
        <path
          d="M 24 156 L 296 138"
          stroke={NAVY}
          strokeWidth="1.6"
          fill="none"
          markerEnd="url(#ramp-arrow)"
        />
        <text x={32} y={152} fontSize="10" fontWeight="600" fill={INK_3}>
          adaptive difficulty
        </text>
      </svg>
    </div>
  );
}

/* ============================================================
   4. Processing speed — symbol substitution + RT bars
   ============================================================ */

export function SymbolSubstitution() {
  const key = [
    { sym: "△", digit: 1 },
    { sym: "○", digit: 2 },
    { sym: "□", digit: 3 },
    { sym: "✦", digit: 4 },
  ];
  // 4×2 grid of symbols to substitute
  const grid = ["○", "□", "△", "✦", "□", "△", "✦", "○"];
  const bars = [
    { label: "280 ms", v: 280 },
    { label: "310 ms", v: 310 },
    { label: "265 ms", v: 265 },
  ];
  const maxV = 360;

  return (
    <div className="glass constructs-visual-card">
      <div className="constructs-card-eyebrow">Symbol substitution</div>

      <svg viewBox="0 0 340 230" width="100%" aria-hidden="true">
        {/* Key row */}
        <text x={8} y={16} fontSize="9.5" fontWeight="700" fill={INK_3} style={{ letterSpacing: "0.08em" }}>
          KEY
        </text>
        {key.map((k, i) => {
          const x = 8 + i * 56;
          return (
            <g key={i}>
              <rect x={x} y={22} width="48" height="28" rx="6" fill="white" stroke="rgba(15,29,69,0.18)" strokeWidth="1" />
              <text x={x + 16} y={41} fontSize="14" fontWeight="700" fill={NAVY} textAnchor="middle">
                {k.sym}
              </text>
              <line x1={x + 26} y1={36} x2={x + 32} y2={36} stroke={INK_3} strokeWidth="1" />
              <text x={x + 40} y={41} fontSize="12" fontWeight="700" fill={ACCENT} textAnchor="middle">
                {k.digit}
              </text>
            </g>
          );
        })}

        {/* 4×2 substitution grid */}
        <text x={8} y={74} fontSize="9.5" fontWeight="700" fill={INK_3} style={{ letterSpacing: "0.08em" }}>
          SUBSTITUTE
        </text>
        {grid.map((sym, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 8 + col * 56;
          const y = 80 + row * 38;
          const filled = i < 5;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width="48"
                height="32"
                rx="6"
                fill={filled ? "rgba(92,115,251,0.08)" : "white"}
                stroke="rgba(15,29,69,0.16)"
                strokeWidth="1"
              />
              <text x={x + 14} y={y + 21} fontSize="14" fontWeight="700" fill={NAVY} textAnchor="middle">
                {sym}
              </text>
              <line x1={x + 26} y1={y + 16} x2={x + 32} y2={y + 16} stroke={INK_3} strokeWidth="0.8" />
              <text
                x={x + 40}
                y={y + 21}
                fontSize="12"
                fontWeight="700"
                fill={filled ? ACCENT : "rgba(15,29,69,0.25)"}
                textAnchor="middle"
              >
                {filled ? key.find((k) => k.sym === sym)?.digit : "·"}
              </text>
            </g>
          );
        })}

        {/* Timer + RT bars */}
        <g transform="translate(228, 18)">
          <circle cx="10" cy="10" r="8" fill="none" stroke={NAVY} strokeWidth="1.6" />
          <path d="M10 5v5l3 2" stroke={NAVY} strokeWidth="1.6" strokeLinecap="round" />
          <text x={24} y={14} fontSize="10.5" fontWeight="700" fill={NAVY}>
            response latency
          </text>
        </g>

        {bars.map((b, i) => {
          const x = 228;
          const y = 40 + i * 26;
          const w = (b.v / maxV) * 100;
          return (
            <g key={i}>
              <rect x={x} y={y} width="100" height="14" rx="3" fill="rgba(15,29,69,0.06)" />
              <rect x={x} y={y} width={w} height="14" rx="3" fill={ACCENT} />
              <text x={x + 105} y={y + 11} fontSize="10" fontWeight="700" fill={NAVY}>
                {b.label}
              </text>
            </g>
          );
        })}
        <text x={228} y={128} fontSize="9.5" fill={INK_3}>
          per-trial RT (3 trials)
        </text>
      </svg>
    </div>
  );
}

/* ============================================================
   5. Attention — Posner cueing
   ============================================================ */

export function PosnerCueing() {
  return (
    <div className="glass constructs-visual-card">
      <div className="constructs-card-eyebrow">Posner cueing paradigm</div>

      <svg viewBox="0 0 340 230" width="100%" aria-hidden="true">
        {/* Valid trial */}
        <text x={8} y={16} fontSize="10" fontWeight="700" fill={NAVY}>
          Valid cue
        </text>
        <rect x={8} y={22} width="56" height="44" rx="6" fill="white" stroke="rgba(15,29,69,0.20)" strokeWidth="1.2" />
        <rect x={142} y={22} width="56" height="44" rx="6" fill="white" stroke="rgba(15,29,69,0.20)" strokeWidth="1.2" />
        <rect
          x={276}
          y={22}
          width="56"
          height="44"
          rx="6"
          fill="rgba(92,115,251,0.10)"
          stroke={ACCENT}
          strokeWidth="1.4"
        />
        {/* fixation cross */}
        <path d="M170 38v12M164 44h12" stroke={NAVY} strokeWidth="1.6" strokeLinecap="round" />
        {/* cue arrow (valid → right) */}
        <path d="M204 44h62" stroke={ACCENT} strokeWidth="1.4" markerEnd="url(#posner-arrow)" />
        {/* target star on right */}
        <Star cx={304} cy={44} />

        {/* Invalid trial */}
        <text x={8} y={94} fontSize="10" fontWeight="700" fill={NAVY}>
          Invalid cue
        </text>
        <rect
          x={8}
          y={100}
          width="56"
          height="44"
          rx="6"
          fill="rgba(15,29,69,0.04)"
          stroke="rgba(15,29,69,0.30)"
          strokeWidth="1.4"
          strokeDasharray="3 3"
        />
        <rect x={142} y={100} width="56" height="44" rx="6" fill="white" stroke="rgba(15,29,69,0.20)" strokeWidth="1.2" />
        <rect x={276} y={100} width="56" height="44" rx="6" fill="white" stroke="rgba(15,29,69,0.20)" strokeWidth="1.2" />
        <path d="M170 116v12M164 122h12" stroke={NAVY} strokeWidth="1.6" strokeLinecap="round" />
        {/* cue arrow points right but target appears left */}
        <path d="M204 122h62" stroke={INK_3} strokeWidth="1.2" strokeDasharray="2 3" markerEnd="url(#posner-arrow-muted)" />
        <Star cx={36} cy={122} />

        <defs>
          <marker
            id="posner-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 5 L0 10 z" fill={ACCENT} />
          </marker>
          <marker
            id="posner-arrow-muted"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 5 L0 10 z" fill={INK_3} />
          </marker>
        </defs>

        {/* RT comparison bars */}
        <text x={8} y={172} fontSize="10" fontWeight="700" fill={INK_3} style={{ letterSpacing: "0.06em" }}>
          REACTION TIME
        </text>
        <rect x={8} y={180} width="170" height="14" rx="3" fill="rgba(15,29,69,0.06)" />
        <rect x={8} y={180} width="100" height="14" rx="3" fill={ACCENT} />
        <text x={114} y={191} fontSize="10" fontWeight="700" fill={NAVY}>
          valid: 220 ms
        </text>
        <rect x={8} y={202} width="170" height="14" rx="3" fill="rgba(15,29,69,0.06)" />
        <rect x={8} y={202} width="141" height="14" rx="3" fill="rgba(15,29,69,0.35)" />
        <text x={155} y={213} fontSize="10" fontWeight="700" fill={NAVY}>
          invalid: 310 ms
        </text>
      </svg>
    </div>
  );
}

function Star({ cx, cy }: { cx: number; cy: number }) {
  // Simple 5-point star
  const r1 = 9;
  const r2 = 4;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return <polygon points={pts.join(" ")} fill={ACCENT} stroke={NAVY} strokeWidth="0.8" />;
}

/* ============================================================
   6. Problem solving — Raven matrix + Tower of Hanoi
   ============================================================ */

export function RavenMatrix() {
  // 3×3 grid; last cell = ?
  // Pattern is illustrative only — small geometric shape variation.
  const cellSize = 44;
  const gap = 6;
  const gridX = 8;
  const gridY = 8;

  function CellShape({ row, col, qmark }: { row: number; col: number; qmark?: boolean }) {
    if (qmark) {
      return (
        <text
          x={gridX + col * (cellSize + gap) + cellSize / 2}
          y={gridY + row * (cellSize + gap) + cellSize / 2 + 8}
          fontSize="22"
          fontWeight="700"
          fill={ACCENT}
          textAnchor="middle"
        >
          ?
        </text>
      );
    }
    const cx = gridX + col * (cellSize + gap) + cellSize / 2;
    const cy = gridY + row * (cellSize + gap) + cellSize / 2;
    // Row 0: circles, Row 1: triangles, Row 2: squares.
    // Column count: 1, 2, 3 markers in each
    const count = col + 1;
    const spacing = 9;
    const items: React.ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      const ox = cx + (i - (count - 1) / 2) * spacing;
      if (row === 0) {
        items.push(<circle key={i} cx={ox} cy={cy} r="4" fill="none" stroke={NAVY} strokeWidth="1.4" />);
      } else if (row === 1) {
        items.push(
          <path
            key={i}
            d={`M${ox} ${cy - 4.5} L${ox + 4} ${cy + 3.5} L${ox - 4} ${cy + 3.5} z`}
            fill="none"
            stroke={NAVY}
            strokeWidth="1.4"
          />
        );
      } else {
        items.push(
          <rect
            key={i}
            x={ox - 4}
            y={cy - 4}
            width="8"
            height="8"
            fill="none"
            stroke={NAVY}
            strokeWidth="1.4"
          />
        );
      }
    }
    return <>{items}</>;
  }

  // Answer options below
  const options = [
    { shape: "square", count: 3 }, // correct shape (squares, 3)
    { shape: "circle", count: 3 },
    { shape: "triangle", count: 3 },
    { shape: "square", count: 2 },
  ];
  const correctIdx = 0;

  return (
    <div className="glass constructs-visual-card">
      <div className="constructs-card-eyebrow">Raven-style matrix</div>

      <svg viewBox="0 0 168 240" width="100%" aria-hidden="true">
        {/* 3x3 grid cells */}
        {Array.from({ length: 3 }).map((_, row) =>
          Array.from({ length: 3 }).map((__, col) => {
            const x = gridX + col * (cellSize + gap);
            const y = gridY + row * (cellSize + gap);
            const isQ = row === 2 && col === 2;
            return (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx="5"
                fill={isQ ? "rgba(92,115,251,0.08)" : "white"}
                stroke={isQ ? ACCENT : "rgba(15,29,69,0.18)"}
                strokeWidth={isQ ? "1.6" : "1"}
                strokeDasharray={isQ ? "4 3" : undefined}
              />
            );
          })
        )}
        {Array.from({ length: 3 }).map((_, row) =>
          Array.from({ length: 3 }).map((__, col) => (
            <CellShape
              key={`s-${row}-${col}`}
              row={row}
              col={col}
              qmark={row === 2 && col === 2}
            />
          ))
        )}

        {/* Answer options */}
        <text x={8} y={172} fontSize="9.5" fontWeight="700" fill={INK_3} style={{ letterSpacing: "0.08em" }}>
          OPTIONS
        </text>
        {options.map((opt, i) => {
          const x = 8 + i * 38;
          const y = 180;
          const isCorrect = i === correctIdx;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width="32"
                height="32"
                rx="5"
                fill={isCorrect ? "rgba(92,115,251,0.10)" : "white"}
                stroke={isCorrect ? ACCENT : "rgba(15,29,69,0.18)"}
                strokeWidth={isCorrect ? "1.4" : "1"}
              />
              {Array.from({ length: opt.count }).map((_, j) => {
                const cx = x + 16 + (j - (opt.count - 1) / 2) * 8;
                const cy = y + 16;
                if (opt.shape === "circle") {
                  return <circle key={j} cx={cx} cy={cy} r="3.2" fill="none" stroke={NAVY} strokeWidth="1.2" />;
                }
                if (opt.shape === "triangle") {
                  return (
                    <path
                      key={j}
                      d={`M${cx} ${cy - 3.6} L${cx + 3.2} ${cy + 2.8} L${cx - 3.2} ${cy + 2.8} z`}
                      fill="none"
                      stroke={NAVY}
                      strokeWidth="1.2"
                    />
                  );
                }
                return (
                  <rect
                    key={j}
                    x={cx - 3.2}
                    y={cy - 3.2}
                    width="6.4"
                    height="6.4"
                    fill="none"
                    stroke={NAVY}
                    strokeWidth="1.2"
                  />
                );
              })}
              <text x={x + 16} y={y + 44} fontSize="9" fontWeight="700" fill={INK_3} textAnchor="middle">
                {String.fromCharCode(65 + i)}
              </text>
            </g>
          );
        })}
      </svg>

      <TowerOfHanoi />
    </div>
  );
}

function TowerOfHanoi() {
  return (
    <div className="constructs-hanoi-row">
      <svg viewBox="0 0 160 60" width="160" height="56" aria-hidden="true">
        {/* base */}
        <rect x={6} y={48} width="148" height="3" rx="1.5" fill={NAVY} />
        {/* 3 pegs */}
        {[28, 80, 132].map((px) => (
          <rect key={px} x={px - 1} y={20} width="2" height="28" fill={NAVY} />
        ))}
        {/* discs on left peg */}
        <rect x={12} y={42} width="32" height="6" rx="2" fill={ACCENT} />
        <rect x={16} y={34} width="24" height="6" rx="2" fill={ACCENT} opacity="0.7" />
        <rect x={20} y={26} width="16" height="6" rx="2" fill={ACCENT} opacity="0.4" />
        {/* small disc on middle peg */}
        <rect x={72} y={42} width="16" height="6" rx="2" fill={ACCENT} opacity="0.55" />
      </svg>
      <span className="constructs-hanoi-label">Tower of Hanoi</span>
    </div>
  );
}

/* ============================================================
   7. Cognitive flexibility — task switching
   ============================================================ */

export function TaskSwitching() {
  const blocks = [
    { label: "Color task", tone: "color" },
    { label: "Shape task", tone: "shape" },
    { label: "Color task", tone: "color" },
  ];
  return (
    <div className="glass constructs-visual-card">
      <div className="constructs-card-eyebrow">Task-switching</div>

      <svg viewBox="0 0 340 230" width="100%" aria-hidden="true">
        <defs>
          <marker
            id="sw-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 5 L0 10 z" fill={NAVY} />
          </marker>
        </defs>

        {/* Blocks */}
        {blocks.map((b, i) => {
          const x = 8 + i * 116;
          const isColor = b.tone === "color";
          return (
            <g key={i}>
              <rect
                x={x}
                y={28}
                width="92"
                height="56"
                rx="8"
                fill={isColor ? "rgba(92,115,251,0.12)" : "white"}
                stroke={isColor ? ACCENT : "rgba(15,29,69,0.30)"}
                strokeWidth="1.4"
              />
              {/* sample stimulus inside block */}
              {isColor ? (
                <>
                  <circle cx={x + 30} cy={56} r="9" fill={ACCENT} />
                  <rect x={x + 50} y={47} width="18" height="18" fill={ACCENT} opacity="0.55" />
                </>
              ) : (
                <>
                  <circle cx={x + 30} cy={56} r="9" fill="none" stroke={NAVY} strokeWidth="1.6" />
                  <rect x={x + 50} y={47} width="18" height="18" fill="none" stroke={NAVY} strokeWidth="1.6" />
                </>
              )}
              <text x={x + 46} y={102} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={NAVY}>
                {b.label}
              </text>
            </g>
          );
        })}

        {/* Arrows between blocks */}
        <path d="M104 56 L120 56" stroke={NAVY} strokeWidth="1.5" markerEnd="url(#sw-arrow)" />
        <path d="M220 56 L236 56" stroke={NAVY} strokeWidth="1.5" markerEnd="url(#sw-arrow)" />

        {/* Switch cost brackets */}
        <path d="M104 14 L104 22 L120 22 L120 14" stroke={ACCENT} strokeWidth="1.2" fill="none" />
        <text x={112} y={11} textAnchor="middle" fontSize="9" fontWeight="700" fill={ACCENT}>
          switch
        </text>
        <path d="M220 14 L220 22 L236 22 L236 14" stroke={ACCENT} strokeWidth="1.2" fill="none" />
        <text x={228} y={11} textAnchor="middle" fontSize="9" fontWeight="700" fill={ACCENT}>
          switch
        </text>

        {/* Switch-cost trend line */}
        <text x={8} y={134} fontSize="10" fontWeight="700" fill={INK_3} style={{ letterSpacing: "0.06em" }}>
          SWITCH COST OVER TIME
        </text>
        {/* axes */}
        <line x1={20} y1={210} x2={332} y2={210} stroke="rgba(15,29,69,0.30)" strokeWidth="1" />
        <line x1={20} y1={146} x2={20} y2={210} stroke="rgba(15,29,69,0.30)" strokeWidth="1" />
        {/* gridlines */}
        {[160, 175, 190].map((y) => (
          <line key={y} x1={20} y1={y} x2={332} y2={y} stroke={GRID} strokeWidth="0.8" />
        ))}
        {/* downward trend */}
        <path
          d="M24 150 C 90 158, 160 180, 240 196 S 320 206, 330 207"
          stroke={ACCENT}
          strokeWidth="2"
          fill="none"
        />
        {/* trend dots */}
        {[
          [24, 150],
          [100, 168],
          [180, 188],
          [260, 200],
          [330, 207],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={ACCENT} stroke="white" strokeWidth="1.2" />
        ))}
        <text x={332} y={144} textAnchor="end" fontSize="9.5" fontWeight="700" fill={NAVY}>
          switch cost reduces over time →
        </text>
        <text x={24} y={224} fontSize="9" fill={INK_3}>
          session 1
        </text>
        <text x={332} y={224} textAnchor="end" fontSize="9" fill={INK_3}>
          session N
        </text>
      </svg>
    </div>
  );
}

/* ============================================================
   8. Out-of-scope vs Why
   ============================================================ */

export function OutOfScopeSplit() {
  const rows = [
    {
      out: "Personality",
      why: "Its own discipline, with its own rigour and workplace caveats.",
    },
    {
      out: "Mood",
      why: "Captured by employees as optional context — managers never see it.",
    },
    {
      out: "Emotion",
      why: "Outside the cognitive battery; not a workplace-grade signal here.",
    },
  ];
  return (
    <div className="glass constructs-scope-card">
      <div className="constructs-scope-grid">
        <div className="constructs-scope-col">
          <div className="constructs-scope-head constructs-scope-head-muted">Out of scope</div>
          {rows.map((r) => (
            <div key={r.out} className="constructs-scope-item constructs-scope-item-muted">
              <span className="constructs-scope-dash" aria-hidden="true" />
              <span>{r.out}</span>
            </div>
          ))}
        </div>
        <div className="constructs-scope-col">
          <div className="constructs-scope-head">Why</div>
          {rows.map((r) => (
            <div key={r.out} className="constructs-scope-item">
              {r.why}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
