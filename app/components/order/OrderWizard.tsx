"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "../Icons";
import { orderErrorKey } from "./orderErrors";
import { initiateCheckout } from "@/app/lib/checkout";
import { formatEurShort } from "@/app/lib/format";
import { ORG_EMAIL } from "@/app/lib/site";
import {
  MAX_REWARD_POOL_EUR,
  MIN_REWARD_POOL_EUR,
  validateOrderInput,
  type OrderErrorCode,
  type OrderErrors,
  type OrderInput,
  type PlayerInput,
} from "@/app/lib/cognitive-rewards-order";
import { ORDER_DRAFT_STORAGE_KEY, initialDraft, type DraftState, type OrderStep } from "./orderDraft";
import { OrderStepper } from "./OrderStepper";
import { OrderSummaryBar, OrderSummaryCard } from "./OrderSummary";
import {
  StepPlayers,
  StepReview,
  StepRewardPool,
  StepTeamSize,
  WhatHappensNext,
  type ErrorSummaryItem,
} from "./OrderSteps";
import { AlertIcon, LockIcon, Spinner } from "./OrderIcons";

const TOTAL_STEPS = 4;
const EMPTY_PLAYER: PlayerInput = { name: "", email: "", role: "" };
/** Gap kept between the sticky site header and the wizard top when scrolling to it. */
const SCROLL_GAP = 24;

function draftToOrderInput(draft: DraftState): OrderInput {
  return {
    teamSize: draft.teamSize ?? 0,
    players: draft.teamSize
      ? Array.from({ length: draft.teamSize }, (_, i) => draft.players[i] ?? EMPTY_PLAYER)
      : draft.players,
    rewardPool: typeof draft.rewardPool === "number" ? draft.rewardPool : -1,
    buyer: { name: draft.buyerName, workEmail: draft.buyerWorkEmail, company: draft.buyerCompany },
    consentTerms: draft.consentTerms,
    consentGdpr: draft.consentGdpr,
  };
}

/** Field keys per step, in display order, with the DOM id that receives focus for each. */
function stepFields(step: OrderStep, draft: DraftState): Array<{ key: string; targetId: string }> {
  if (step === 1) return [{ key: "teamSize", targetId: "team-size-3" }];
  if (step === 2) {
    return draft.players.flatMap((_, i) => [
      { key: `p${i}.name`, targetId: `player-${i}-name` },
      { key: `p${i}.email`, targetId: `player-${i}-email` },
      { key: `p${i}.role`, targetId: `player-${i}-role-staff` },
    ]);
  }
  if (step === 3) return [{ key: "rewardPool", targetId: draft.customPool ? "pool-custom" : "pool-100" }];
  return [
    { key: "buyerName", targetId: "buyer-name" },
    { key: "buyerEmail", targetId: "buyer-email" },
    { key: "buyerCompany", targetId: "buyer-company" },
    { key: "consentTerms", targetId: "consent-terms" },
    { key: "consentGdpr", targetId: "consent-gdpr" },
  ];
}

function errorCodeFor(errors: OrderErrors, key: string): OrderErrorCode | undefined {
  const player = /^p(\d+)\.(name|email|role)$/.exec(key);
  if (player) return errors.players?.[Number(player[1])]?.[player[2] as "name" | "email" | "role"];
  return errors[key as Exclude<keyof OrderErrors, "players">];
}

function earliestErrorStep(errors: OrderErrors): OrderStep | null {
  if (errors.teamSize) return 1;
  if (errors.players?.some(Boolean)) return 2;
  if (errors.rewardPool) return 3;
  if (errors.buyerName || errors.buyerEmail || errors.buyerCompany || errors.consentTerms || errors.consentGdpr) {
    return 4;
  }
  return null;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function OrderWizard({ checkoutCancelled }: { checkoutCancelled: boolean }) {
  const t = useTranslations("cognitiveRewardsOrder.wizard");
  const locale = useLocale();

  const [draft, setDraft] = useState<DraftState>(initialDraft);
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState(false);
  /** Fields the user has left (blur) — their errors may show. */
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  /** Steps where Continue / Pay was pressed — all their errors may show. */
  const [attempted, setAttempted] = useState<Partial<Record<OrderStep, boolean>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const wizardRef = useRef<HTMLDivElement>(null);
  const stepChangedByUser = useRef(false);

  // Client-only restore of an in-progress draft (sessionStorage is unavailable
  // during SSR), so setting state here is intentional and runs once on mount.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ORDER_DRAFT_STORAGE_KEY);
      if (raw) {
        const saved = { ...initialDraft(), ...(JSON.parse(raw) as Partial<DraftState>) };
        // Back from a cancelled Stripe Checkout: land on the review step.
        if (checkoutCancelled && saved.teamSize) saved.step = saved.maxStep = 4;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft(saved);
        setRestored(Boolean(saved.teamSize));
      }
    } catch {
      // corrupt or unavailable storage — start fresh
    } finally {
      setHydrated(true);
    }
  }, [checkoutCancelled]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(ORDER_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft, hydrated]);

  // On a user-driven step change: bring the wizard top into view below the
  // sticky header, then move focus to the new step heading.
  useEffect(() => {
    if (!stepChangedByUser.current) return;
    stepChangedByUser.current = false;
    const el = wizardRef.current;
    if (el) {
      const header = document.querySelector("header");
      const offset = (header?.getBoundingClientRect().bottom ?? 0) + SCROLL_GAP;
      const top = el.getBoundingClientRect().top;
      if (top < offset || top > window.innerHeight * 0.5) {
        window.scrollTo({ top: window.scrollY + top - offset, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
    }
    document.getElementById("order-step-heading")?.focus({ preventScroll: true });
  }, [draft.step]);

  const allErrors = useMemo(() => validateOrderInput(draftToOrderInput(draft)), [draft]);

  const errorParams = useMemo(
    () => ({ min: formatEurShort(MIN_REWARD_POOL_EUR, locale), max: formatEurShort(MAX_REWARD_POOL_EUR, locale) }),
    [locale]
  );

  function messageFor(code: string) {
    return t(`errors.${orderErrorKey(code)}`, errorParams);
  }

  function errorFor(key: string): string | undefined {
    if (!touched[key] && !attempted[draft.step]) return undefined;
    const code = errorCodeFor(allErrors, key);
    return code ? messageFor(code) : undefined;
  }

  function touch(key: string) {
    setTouched((s) => (s[key] ? s : { ...s, [key]: true }));
  }

  function invalidFields(step: OrderStep) {
    return stepFields(step, draft).filter((f) => errorCodeFor(allErrors, f.key));
  }

  function focusFirstInvalid(step: OrderStep) {
    const first = invalidFields(step)[0];
    if (first) requestAnimationFrame(() => document.getElementById(first.targetId)?.focus());
  }

  function goToStep(target: OrderStep) {
    // Moving forward via the stepper still has to pass every step in between.
    for (let s = draft.step; s < target; s++) {
      if (invalidFields(s as OrderStep).length > 0) {
        target = s as OrderStep;
        setAttempted((a) => ({ ...a, [s]: true }));
        break;
      }
    }
    if (target === draft.step) {
      focusFirstInvalid(target);
      return;
    }
    setGlobalError(null);
    stepChangedByUser.current = true;
    setDraft((d) => ({ ...d, step: target, maxStep: Math.max(d.maxStep, target) as OrderStep }));
  }

  function handleNext() {
    if (invalidFields(draft.step).length > 0) {
      setAttempted((a) => ({ ...a, [draft.step]: true }));
      focusFirstInvalid(draft.step);
      return;
    }
    if (draft.step < TOTAL_STEPS) goToStep((draft.step + 1) as OrderStep);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (draft.step !== TOTAL_STEPS) {
      handleNext();
      return;
    }
    const firstBadStep = earliestErrorStep(allErrors);
    if (firstBadStep) {
      setAttempted((a) => ({ ...a, [firstBadStep]: true }));
      if (firstBadStep === draft.step) focusFirstInvalid(draft.step);
      else goToStep(firstBadStep);
      return;
    }

    setSubmitting(true);
    setGlobalError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamSize: draft.teamSize,
          players: draft.players,
          rewardPool: draft.rewardPool,
          buyer: { name: draft.buyerName, workEmail: draft.buyerWorkEmail, company: draft.buyerCompany },
          consentTerms: draft.consentTerms,
          consentGdpr: draft.consentGdpr,
          locale,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        orderId?: string;
        errors?: OrderErrors;
        code?: string;
      };

      if (res.ok && data.ok && data.orderId) {
        const checkout = await initiateCheckout(data.orderId, locale);
        if (checkout.ok) {
          // The draft is kept until the success page confirms payment, so a
          // cancelled Checkout returns here with everything still filled in.
          window.location.href = checkout.url;
          return;
        }
        setGlobalError(checkout.code);
        setSubmitting(false);
        return;
      }

      if (data.errors) {
        const jumpStep = earliestErrorStep(data.errors);
        if (jumpStep) {
          setAttempted((a) => ({ ...a, [jumpStep]: true }));
          if (jumpStep !== draft.step) {
            stepChangedByUser.current = true;
            setDraft((d) => ({ ...d, step: jumpStep }));
          }
        }
      }
      setGlobalError(data.code ?? "GENERIC");
    } catch {
      setGlobalError("NETWORK");
    }
    setSubmitting(false);
  }

  const summaryItems: ErrorSummaryItem[] = attempted[4]
    ? invalidFields(4).map((f) => ({ ...f, message: messageFor(errorCodeFor(allErrors, f.key)!) }))
    : [];

  const stepProps = { draft, setDraft, errorFor, touch };
  const continueDisabled = draft.step === 1 && !draft.teamSize;

  return (
    <div className="order-layout">
      <div className="order-main" ref={wizardRef}>
        <OrderSummaryBar teamSize={draft.teamSize} rewardPool={draft.rewardPool} />

        <div className="order-panel glass-strong">
          <OrderStepper step={draft.step} maxStep={draft.maxStep} onSelect={goToStep} />

          {checkoutCancelled && hydrated && (
            <p role="status" className="order-notice">
              {restored ? t("cancelled") : t("cancelledNoDraft")}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
            <div key={draft.step} className="order-step">
              {draft.step === 1 && <StepTeamSize {...stepProps} />}
              {draft.step === 2 && <StepPlayers {...stepProps} />}
              {draft.step === 3 && <StepRewardPool {...stepProps} />}
              {draft.step === 4 && <StepReview {...stepProps} onEdit={goToStep} summaryItems={summaryItems} />}
            </div>

            <div aria-live="assertive">
              {globalError && (
                <div className="order-global-error" role="alert">
                  <AlertIcon size={18} />
                  <p>
                    {messageFor(globalError)} {t("errors.supportHint", { email: ORG_EMAIL })}
                  </p>
                </div>
              )}
            </div>

            <div className={`order-actions ${draft.step === 1 ? "first" : ""}`}>
              {draft.step < TOTAL_STEPS ? (
                <button type="submit" className="btn btn-primary order-primary" disabled={continueDisabled}>
                  {t("nav.next")} <ArrowRight size={14} />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary order-primary" disabled={submitting}>
                  {submitting ? <Spinner /> : <LockIcon />}
                  {submitting ? t("nav.submitting") : t("nav.submit")}
                </button>
              )}
              {draft.step > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost order-back"
                  onClick={() => goToStep((draft.step - 1) as OrderStep)}
                  disabled={submitting}
                >
                  {t("nav.back")}
                </button>
              )}
            </div>
            {draft.step === TOTAL_STEPS && <p className="order-submit-note">{t("nav.submitNote")}</p>}
          </form>

          {draft.step === TOTAL_STEPS && <WhatHappensNext />}
        </div>
      </div>

      <aside className="order-aside">
        <OrderSummaryCard teamSize={draft.teamSize} rewardPool={draft.rewardPool} />
      </aside>
    </div>
  );
}
