import { ArrowRight } from "./Icons";
import { Link } from "@/i18n/navigation";

/**
 * "Order Cognitive Rewards" CTA — links to the internal ordering route
 * (`/cognitive-rewards/order`). Carries a stable `data-analytics-event` hook
 * for whichever analytics tool gets wired up later — do NOT introduce a new
 * analytics layer here.
 */
type OrderCTAProps = {
  label: string;
  /** Stable event name for future analytics instrumentation. */
  event: string;
  className?: string;
};

export function OrderCTA({ label, event, className = "btn btn-primary" }: OrderCTAProps) {
  return (
    <Link
      href="/cognitive-rewards/order"
      className={className}
      style={className.includes("btn-primary") ? { background: "var(--navy)" } : undefined}
      data-analytics-event={event}
    >
      {label} <ArrowRight size={14} />
    </Link>
  );
}
