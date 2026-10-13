"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatEurShort } from "@/app/lib/format";
import { ORG_EMAIL, ORG_LEGAL_NAME } from "@/app/lib/site";
import { GAME_FEE_EUR, type TeamSize } from "@/app/lib/cognitive-rewards-order";
import { ChevronDownIcon, LockIcon, MailIcon, ReceiptIcon } from "./OrderIcons";

type SummaryProps = {
  teamSize: TeamSize | null;
  rewardPool: number | "";
};

// TODO(company details): add WelloWork AB's VAT / org number to the "Sold by"
// line once confirmed — it isn't in site config or the legal pages yet.
const ORG_COUNTRY_CODE = "SE";

function countryName(locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(ORG_COUNTRY_CODE) ?? "Sweden";
  } catch {
    return "Sweden";
  }
}

function orderTotal(teamSize: TeamSize | null, rewardPool: number | ""): number | null {
  if (!teamSize && rewardPool === "") return null;
  return (teamSize ? GAME_FEE_EUR[teamSize] : 0) + (rewardPool === "" ? 0 : rewardPool);
}

/**
 * Line items + total, before VAT. Never shows a VAT amount: Stripe Tax decides
 * the real figure (country, VAT ID, reverse charge) on the Checkout page.
 */
export function OrderPriceLines({ teamSize, rewardPool }: SummaryProps) {
  const t = useTranslations("cognitiveRewardsOrder.summary");
  const locale = useLocale();
  const total = orderTotal(teamSize, rewardPool);
  return (
    <dl className="order-lines">
      <div className="order-line">
        <dt>{teamSize ? t("teamGame", { n: teamSize }) : t("chooseTeam")}</dt>
        <dd>{teamSize ? formatEurShort(GAME_FEE_EUR[teamSize], locale) : "—"}</dd>
      </div>
      <div className="order-line">
        <dt>{t("rewardPool")}</dt>
        <dd className={rewardPool === "" ? "muted" : undefined}>
          {rewardPool === "" ? t("notSet") : formatEurShort(rewardPool, locale)}
        </dd>
      </div>
      <div className="order-line">
        <dt>{t("vat")}</dt>
        <dd className="muted">{t("vatAtPayment")}</dd>
      </div>
      <p className="order-line-help">{t("vatHelper")}</p>
      <div className="order-line total">
        <dt>{t("total")}</dt>
        <dd>{total === null ? "—" : formatEurShort(total, locale)}</dd>
      </div>
    </dl>
  );
}

function TrustBlock() {
  const t = useTranslations("cognitiveRewardsOrder.summary");
  const locale = useLocale();
  return (
    <div className="order-trust">
      <p className="order-trust-row">
        <LockIcon />
        <span>{t("secure")}</span>
      </p>
      {/* Checkout sessions set invoice_creation.enabled, so Stripe issues the invoice. */}
      <p className="order-trust-row">
        <ReceiptIcon />
        <span>{t("invoice")}</span>
      </p>
      {/* TODO(payment methods): show official card/wallet logos here only once the
          methods enabled in the Stripe Dashboard are confirmed — the Checkout
          session doesn't pin payment_method_types, so the code can't tell. */}
      <p className="order-trust-row">
        <MailIcon />
        <span>
          {t.rich("questions", {
            email: ORG_EMAIL,
            link: (chunks) => <a href={`mailto:${ORG_EMAIL}`}>{chunks}</a>,
          })}
        </span>
      </p>
      <p className="order-trust-links">
        <Link href="/legal#terms">{t("terms")}</Link>
        <span aria-hidden="true">·</span>
        <Link href="/legal#privacy">{t("privacy")}</Link>
        {/* TODO(refund policy): link a refund policy page once one exists. */}
      </p>
      <p className="order-trust-seller">{t("soldBy", { legalName: ORG_LEGAL_NAME, country: countryName(locale) })}</p>
    </div>
  );
}

/** Desktop: sticky "Your order" card beside the wizard. */
export function OrderSummaryCard(props: SummaryProps) {
  const t = useTranslations("cognitiveRewardsOrder.summary");
  return (
    <section className="order-summary-card glass-strong" aria-labelledby="order-summary-heading">
      <h2 id="order-summary-heading" className="order-summary-heading">
        {t("heading")}
      </h2>
      <div aria-live="polite">
        <OrderPriceLines {...props} />
      </div>
      <TrustBlock />
    </section>
  );
}

/** Mobile: collapsible "Total before VAT" bar above the wizard. */
export function OrderSummaryBar(props: SummaryProps) {
  const t = useTranslations("cognitiveRewardsOrder.summary");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const total = orderTotal(props.teamSize, props.rewardPool);
  return (
    <section className="order-summary-bar glass-strong" aria-label={t("heading")}>
      <button
        type="button"
        className="order-summary-bar-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">{t("toggle")}: </span>
        <span>{t("total")}</span>
        <span className="order-summary-bar-total">
          {total === null ? "—" : formatEurShort(total, locale)}
          <span className={`order-chevron ${open ? "open" : ""}`}>
            <ChevronDownIcon />
          </span>
        </span>
      </button>
      <div id={panelId} hidden={!open} className="order-summary-bar-panel">
        <OrderPriceLines {...props} />
        <TrustBlock />
      </div>
    </section>
  );
}
