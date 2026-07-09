import { useTranslations } from "next-intl";
import { ArrowRight } from "./Icons";

/**
 * External CTA to day-23.com (TwentyThird's own product site — account
 * creation and sign-up happen there, not on wellowork.net). Opens in a new
 * tab; carries a stable `data-analytics-event` hook for future instrumentation,
 * matching the pattern in OrderCTA.tsx.
 */
type DayTwentyThreeCTAProps = {
  label: string;
  event: string;
  className?: string;
};

export function DayTwentyThreeCTA({ label, event, className = "btn btn-primary" }: DayTwentyThreeCTAProps) {
  const t = useTranslations("common");
  return (
    <a
      href="https://day-23.com"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={className.includes("btn-primary") ? { background: "var(--navy)" } : undefined}
      data-analytics-event={event}
    >
      {label} <ArrowRight size={14} />
      <span className="sr-only"> {t("opensInNewTab")}</span>
    </a>
  );
}
