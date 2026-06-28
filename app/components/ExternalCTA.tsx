import { ArrowRight } from "./Icons";
import { PUZZIFY_ORDER_URL } from "../lib/site";

/**
 * External "order / get started" CTA for Cognitive Rewards. Always points at the
 * partner platform (Puzzify) with attribution UTMs, opens in a new tab, and
 * carries `rel="noopener noreferrer"`.
 *
 * Analytics: the site has no JS analytics layer yet, so a `data-analytics-event`
 * attribute is attached as a stable instrumentation hook. Wire it to GA4 / the
 * chosen tool when one is added — do NOT introduce a new analytics layer here.
 */
type ExternalCTAProps = {
  label: string;
  /** Visually-hidden hint, e.g. "(opens in a new tab)". */
  newTabHint?: string;
  /** Stable event name for future analytics instrumentation. */
  event: string;
  className?: string;
};

export function ExternalCTA({
  label,
  newTabHint,
  event,
  className = "btn btn-primary",
}: ExternalCTAProps) {
  return (
    <a
      href={PUZZIFY_ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={className.includes("btn-primary") ? { background: "var(--navy)" } : undefined}
      data-analytics-event={event}
    >
      {label} <ArrowRight size={14} />
      {newTabHint && (
        <span
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {" "}
          {newTabHint}
        </span>
      )}
    </a>
  );
}
