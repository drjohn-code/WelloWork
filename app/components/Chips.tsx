import { ICONS } from "./Icons";

type PrivacyChipProps = { children?: React.ReactNode };

export function PrivacyChip({
  children = "Aggregated, anonymised — manager view",
}: PrivacyChipProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 100,
        background: "rgba(22,43,92,0.06)",
        color: "var(--primary)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.01em",
        border: "1px solid rgba(22,43,92,0.10)",
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={ICONS.lock}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </span>
  );
}

export function SwedenChip() {
  return (
    <span
      className="chip"
      style={{
        background: "rgba(255,255,255,0.7)",
        borderColor: "rgba(22,43,92,0.10)",
        color: "var(--primary)",
        fontSize: 12,
        padding: "6px 12px",
        fontWeight: 600,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FFCE3A 0%, #5C73FB 100%)",
        }}
      />
      Driven by Science, Built with Care
    </span>
  );
}
