export const ICONS: Record<string, string> = {
  pulse: "M3 12h4l2-5 3 10 2-6 2 3h5",
  brain:
    "M9 5a3 3 0 00-3 3v1a3 3 0 00-1 5 3 3 0 003 3 3 3 0 003 2 3 3 0 003-2 3 3 0 003-3 3 3 0 00-1-5V8a3 3 0 00-3-3 3 3 0 00-5 0M9 9v8m6-8v8",
  chart: "M4 20V6m6 14v-9m6 9V9m6 11V4",
  shield: "M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z M9 12l2 2 4-4",
  lock: "M7 11V8a5 5 0 0110 0v3 M5 11h14v10H5z M12 15v3",
  spark: "M12 3v4m0 10v4m-9-9h4m10 0h4m-3-6l-3 3m-6 6l-3 3m0-12l3 3m6 6l3 3",
  flow: "M4 7h8a4 4 0 014 4 4 4 0 004 4h-4 M4 17h8 M16 4l4 3-4 3 M20 14l-4 3 4 3",
  users:
    "M9 8a3 3 0 100-6 3 3 0 000 6zm0 2c-3 0-6 1.5-6 5v3h12v-3c0-3.5-3-5-6-5zm9-2a3 3 0 100-6m-1 8c2.5 0 5 1.5 5 4v2",
  flask: "M9 3h6 M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3 M7 14h10",
  drop: "M12 3s-6 7-6 12a6 6 0 0012 0c0-5-6-12-6-12z",
  bolt: "M13 3l-8 11h6l-1 7 8-11h-6l1-7z",
  layers: "M12 3l9 5-9 5-9-5 9-5z M3 13l9 5 9-5 M3 18l9 5 9-5",
  target:
    "M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 100 10 5 5 0 000-10zm0 4a1 1 0 100 2 1 1 0 000-2z",
  cube: "M12 2l9 5v10l-9 5-9-5V7l9-5z M12 12l9-5 M12 12v10 M12 12L3 7",
  scale:
    "M12 3v18 M6 7h12M6 7l-3 6a3 3 0 006 0L6 7zm12 0l-3 6a3 3 0 006 0l-3-6z",
  swap: "M7 5L3 9l4 4 M3 9h14 M17 19l4-4-4-4 M21 15H7",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zm5 12l5 5",
  star: "M12 3l3 6 6 1-4.5 4 1 6L12 17l-5.5 3 1-6L3 10l6-1 3-6z",
  calendar: "M5 6h14v15H5zM5 6V4 M19 6V4 M3 11h18",
  check: "M4 12l5 5L20 6",
  download: "M12 3v12 M7 11l5 5 5-5 M4 21h16",
  dot: "M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0",
};

type IconProps = { name: keyof typeof ICONS | string; size?: number };

export function Icon({ name, size = 22 }: IconProps) {
  const d = ICONS[name] || ICONS.dot;
  const gid = `ig-${name}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke={`url(#${gid})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 11L11 5M11 5H6M11 5V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
