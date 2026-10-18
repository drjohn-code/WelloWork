/** In-game iconography: badges, round types, celebration pieces. All decorative (aria-hidden); text sits beside them. */

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };

type P = { size?: number };

/* ── Badges ─────────────────────────────────────────────────────────────── */

export function HelperIcon({ size = 18 }: P) {
  // Two hands meeting: the glue.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M3 12.5 7.5 8a2 2 0 0 1 2.8 0L12 9.7l1.7-1.7a2 2 0 0 1 2.8 0L21 12.5" />
      <path d="M12 9.7 8.8 13a1.6 1.6 0 0 0 2.3 2.3l.9-.9" />
      <path d="M3 12.5V17l3.5 3h4L12 18.5l1.5 1.5h4l3.5-3v-4.5" />
    </svg>
  );
}

export function SolverIcon({ size = 18 }: P) {
  // Lightbulb.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6.5 6.5 0 0 0-4 11.6c.7.6 1 1.3 1 2.1V17h6v-.3c0-.8.3-1.5 1-2.1A6.5 6.5 0 0 0 12 3z" />
    </svg>
  );
}

export function RescuerIcon({ size = 18 }: P) {
  // Life ring.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
    </svg>
  );
}

export function MemoryIcon({ size = 18 }: P) {
  // Brain outline.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 4.5a3 3 0 0 0-5.6 1.2A3 3 0 0 0 4.3 11a3 3 0 0 0 .9 5.2A3 3 0 0 0 10 19.5c.8 0 1.5-.3 2-.8" />
      <path d="M12 4.5a3 3 0 0 1 5.6 1.2 3 3 0 0 1 2.1 5.3 3 3 0 0 1-.9 5.2A3 3 0 0 1 14 19.5c-.8 0-1.5-.3-2-.8" />
      <path d="M12 4.5v14.2M8.5 9.5c1 .3 2 1 2.5 2M15.5 13c-1-.3-2-1-2.5-2" />
    </svg>
  );
}

export function LinkIcon({ size = 18 }: P) {
  // Two chain links: the connector.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3.1-3.1a4 4 0 0 0-5.7-5.7L11.6 6.7" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3.1 3.1a4 4 0 0 0 5.7 5.7l1.5-1.5" />
    </svg>
  );
}

export function ClarityIcon({ size = 18 }: P) {
  // Speech bubble with a tick: said once, understood.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 5.5h16v10H11l-4.5 4v-4H4z" />
      <path d="m8.5 10.5 2.2 2.2 4.8-4.7" />
    </svg>
  );
}

export function BridgeIcon({ size = 18 }: P) {
  // An arch bridge: helped every solver.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M2.5 9h19M2.5 17h3v-2.5a6.5 6.5 0 0 1 13 0V17h3" />
      <path d="M6 9v5M10 9v2.5M14 9v2.5M18 9v5" />
    </svg>
  );
}

export function PaceIcon({ size = 18 }: P) {
  // Stopwatch.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9.5M10 2.5h4M18.5 6.5l1.5-1.5" />
    </svg>
  );
}

export function EyeIcon({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export const BADGE_ICONS = {
  connector: LinkIcon,
  clarity: ClarityIcon,
  bridge: BridgeIcon,
  rescuer: RescuerIcon,
  solver: SolverIcon,
  pace: PaceIcon,
  eagleEye: EyeIcon,
  memory: MemoryIcon,
  glue: HelperIcon,
} as const;

export function BadgeIcon({ kind, size = 16 }: { kind: string; size?: number }) {
  const Icon = (BADGE_ICONS as Record<string, (p: P) => React.JSX.Element>)[kind];
  return Icon ? <Icon size={size} /> : null;
}

/* ── Round types ────────────────────────────────────────────────────────── */

export function CalendarIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <rect x="7" y="13" width="3" height="3" rx=".6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShelfIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M3 9h18M3 15h18M3 21h18" />
      <rect x="6" y="5" width="4" height="4" rx=".8" /><rect x="13" y="4" width="5" height="5" rx=".8" />
      <rect x="8" y="11" width="5" height="4" rx=".8" /><rect x="5" y="17" width="4" height="4" rx=".8" /><rect x="14" y="17" width="6" height="4" rx=".8" />
    </svg>
  );
}

export function WifiIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M2.5 9.5a14 14 0 0 1 19 0M5.5 13a9.5 9.5 0 0 1 13 0M8.6 16.4a5 5 0 0 1 6.8 0" />
      <circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="6" width="14" height="11" rx="2" />
      <path d="m3.5 7.5 6.5 5 6.5-5" />
      <path d="M20 9v8a2 2 0 0 1-2 2H7" />
    </svg>
  );
}

export function DeskIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M3 10h18M5 10v9M19 10v9M3 10l2-4h14l2 4" />
      <rect x="8" y="13" width="8" height="3" rx=".8" />
    </svg>
  );
}

/* Talk rounds */
export function CardsIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="6" width="10" height="14" rx="2" transform="rotate(-10 8 13)" />
      <rect x="11" y="4" width="10" height="14" rx="2" transform="rotate(8 16 11)" />
      <circle cx="16.2" cy="11" r="2" />
    </svg>
  );
}
export function LineupIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="6" cy="8" r="2.5" />
      <circle cx="12" cy="7" r="2.5" />
      <circle cx="18" cy="8" r="2.5" />
      <path d="M2.5 17c.5-3 2-4.5 3.5-4.5S9 14 9.5 17M8.5 16c.5-3.2 2-5 3.5-5s3 1.8 3.5 5M14.5 17c.5-3 2-4.5 3.5-4.5s3 1.5 3.5 4.5" />
      <path d="M3 20.5h18" />
    </svg>
  );
}
export function GridIcon({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export const TEMPLATE_ICONS = { slot: CalendarIcon, snack: ShelfIcon, wifi: WifiIcon, replyall: MailIcon, desks: DeskIcon, callback: MemoryIcon, common: CardsIcon, lineup: LineupIcon, blueprint: GridIcon } as const;

export function TemplateIcon({ template, size = 22 }: { template: string; size?: number }) {
  const Icon = (TEMPLATE_ICONS as Record<string, (p: P) => React.JSX.Element>)[template];
  return Icon ? <Icon size={size} /> : null;
}

/* ── Misc ───────────────────────────────────────────────────────────────── */

export function CheckBurstIcon({ size = 28 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={2.6}>
      <path className="check-path" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Padlock whose shackle lifts when `open`. */
export function LockIcon({ size = 40, open = false }: P & { open?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={1.7} className={`lock-icon ${open ? "open" : ""}`}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path className="lock-shackle" d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Lightweight confetti: fixed particle set, positions/colours/delays from CSS variables. */
export function Confetti({ count = 48 }: { count?: number }) {
  const colors = ["#5C73FB", "#162B5C", "#F2C94C", "#10B981", "#F28B82", "#8A9CFD"];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37) % 100;
        const delay = ((i * 53) % 120) / 100;
        const dur = 2.6 + ((i * 29) % 100) / 60;
        const rot = (i * 97) % 360;
        const shape = i % 3;
        return (
          <span
            key={i}
            className={`confetti-p s${shape}`}
            style={{ left: `${left}%`, background: colors[i % colors.length], animationDelay: `${delay}s`, animationDuration: `${dur}s`, ["--rot" as string]: `${rot}deg` }}
          />
        );
      })}
    </div>
  );
}
