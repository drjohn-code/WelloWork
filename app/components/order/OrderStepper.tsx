"use client";

import { useTranslations } from "next-intl";
import { CheckIcon } from "./OrderIcons";
import type { OrderStep } from "./orderDraft";

export const STEP_KEYS = ["teamSize", "players", "pool", "review"] as const;

type Props = {
  step: OrderStep;
  maxStep: OrderStep;
  onSelect: (step: OrderStep) => void;
};

/**
 * Desktop: four labelled dots. Mobile: "Step 2 of 4 · Players" + progress bar.
 * Steps already reached are buttons; steps not reached yet are inert.
 */
export function OrderStepper({ step, maxStep, onSelect }: Props) {
  const t = useTranslations("cognitiveRewardsOrder.wizard");
  const total = STEP_KEYS.length;
  const currentName = t(`steps.${STEP_KEYS[step - 1]}`);

  return (
    <nav aria-label={t("stepLabel", { current: step, total })}>
      <ol className="order-stepper">
        {STEP_KEYS.map((key, i) => {
          const n = (i + 1) as OrderStep;
          const name = t(`steps.${key}`);
          const status = n === step ? "active" : n < step ? "done" : n <= maxStep ? "reached" : "todo";
          const inner = (
            <>
              <span className="order-stepper-dot" aria-hidden="true">
                {status === "done" ? <CheckIcon size={13} /> : n}
              </span>
              <span className="order-stepper-label">{name}</span>
            </>
          );
          return (
            <li key={key} className={`order-stepper-item ${status}`}>
              {n !== step && n <= maxStep ? (
                <button
                  type="button"
                  className="order-stepper-btn"
                  onClick={() => onSelect(n)}
                  aria-label={t("goToStep", { n, name })}
                >
                  {inner}
                </button>
              ) : (
                <span className="order-stepper-btn" aria-current={n === step ? "step" : undefined}>
                  {inner}
                </span>
              )}
              {i < total - 1 && <span className={`order-stepper-line ${n < step ? "done" : ""}`} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      <div className="order-stepper-compact">
        <p>{t("stepCompact", { current: step, total, name: currentName })}</p>
        <div
          className="order-progressbar"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-label={t("stepLabel", { current: step, total })}
        >
          <span style={{ width: `${(step / total) * 100}%` }} />
        </div>
      </div>
    </nav>
  );
}
