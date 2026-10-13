// Small stroke icons used only by the order checkout. Decorative: callers pair
// each with visible text, so every icon is aria-hidden.

type P = { size?: number };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function LockIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function ReceiptIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

export function MailIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export function CheckIcon({ size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={2.6}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function AlertIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}

export function Spinner({ size = 16 }: P) {
  return (
    <svg className="order-spinner" width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={2.4}>
      <path d="M12 3a9 9 0 1 1-9 9" />
    </svg>
  );
}

/** n simple head-and-shoulders figures, overlapping slightly. */
export function PeopleIcon({ count }: { count: number }) {
  const step = 13;
  const width = 18 + step * (count - 1);
  return (
    <svg width={width} height={22} viewBox={`0 0 ${width} 22`} aria-hidden="true" focusable="false">
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${i * step} 0)`} fill="currentColor" stroke="var(--order-people-ring, #fff)" strokeWidth={1.5}>
          <circle cx="9" cy="6.5" r="4.25" />
          <path d="M1.5 21c0-4.4 3.4-7.5 7.5-7.5s7.5 3.1 7.5 7.5z" />
        </g>
      ))}
    </svg>
  );
}
