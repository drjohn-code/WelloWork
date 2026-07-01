"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "../Icons";
import { readCheckoutHandoff } from "@/app/lib/checkout";
import { formatEur } from "@/app/lib/format";

/**
 * Placeholder payment page content. Shows the order summary handed off by the
 * wizard (see app/lib/checkout.ts) and a disabled "Pay securely" button.
 * TODO(next task): swap this for the real Stripe Checkout / Payment Element flow.
 */
export function PaymentPlaceholder() {
  const t = useTranslations("cognitiveRewardsOrder.payment");
  const ts = useTranslations("cognitiveRewardsOrder.wizard.step4.summary");
  const locale = useLocale();
  const orderId = useSearchParams().get("orderId");
  const handoff = orderId ? readCheckoutHandoff(orderId) : null;

  if (!orderId || !handoff) {
    return (
      <div className="glass-strong" style={{ padding: "32px 28px", maxWidth: 560 }}>
        <h2 className="h-card" style={{ margin: "0 0 8px", fontSize: 20 }}>
          {t("missingHeading")}
        </h2>
        <p className="body" style={{ margin: "0 0 20px" }}>
          {t("missingBody")}
        </p>
        <Link href="/cognitive-rewards/order" className="btn btn-primary" style={{ background: "var(--navy)" }}>
          {t("startNew")} <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const { pricing, teamSize } = handoff;

  return (
    <div
      className="glass-strong"
      style={{ padding: "32px 28px", maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div>
        <span className="small">{t("orderReference")}</span>
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, color: "var(--ink-2)" }}>
          {orderId}
        </div>
      </div>

      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(15,29,69,0.08)",
        }}
      >
        <h3 className="h-card" style={{ margin: "0 0 12px", fontSize: 16 }}>
          {t("summaryHeading")}
        </h3>
        <div className="order-summary-row">
          <span>{ts("gameFee", { size: teamSize })}</span>
          <span>{formatEur(pricing.gameFee, locale)}</span>
        </div>
        <div className="order-summary-row">
          <span>{ts("vatEstimate")}</span>
          <span>{formatEur(pricing.vatAmount, locale)}</span>
        </div>
        <div className="order-summary-row">
          <span>{ts("rewardPool")}</span>
          <span>{formatEur(pricing.rewardPool, locale)}</span>
        </div>
        <div className="order-summary-row total">
          <span>{ts("total")}</span>
          <span>{formatEur(pricing.total, locale)}</span>
        </div>
        <p className="small" style={{ marginTop: 12, marginBottom: 0 }}>
          {ts("vatExplainer")}
        </p>
      </div>

      <div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ background: "var(--navy)", opacity: 0.6, cursor: "not-allowed" }}
          disabled
          aria-disabled="true"
        >
          {t("payButton")}
        </button>
        <p className="small" style={{ marginTop: 10 }}>
          {t("comingSoon")}
        </p>
      </div>
    </div>
  );
}
