"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ArrowRight } from "../Icons";
import { orderErrorKey } from "./orderErrors";
import { initiateCheckout } from "@/app/lib/checkout";
import { formatEur } from "@/app/lib/format";
import {
  computeOrderPricing,
  GAME_FEE_EUR,
  MAX_REWARD_POOL_EUR,
  MIN_REWARD_POOL_EUR,
  PLAYER_ROLES,
  REWARD_POOL_MOST_POPULAR,
  REWARD_POOL_QUICK_PICKS,
  TEAM_SIZES,
  validateOrderInput,
  type OrderErrors,
  type OrderInput,
  type PlayerInput,
  type TeamSize,
} from "@/app/lib/cognitive-rewards-order";

const STORAGE_KEY = "wellowork:cr-order-draft:v1";
const TOTAL_STEPS = 4;
const EMPTY_PLAYER: PlayerInput = { name: "", email: "", role: "" };

type DraftState = {
  step: 1 | 2 | 3 | 4;
  teamSize: TeamSize | null;
  players: PlayerInput[];
  rewardPool: number | "";
  buyerName: string;
  buyerWorkEmail: string;
  buyerCompany: string;
  consentTerms: boolean;
  consentGdpr: boolean;
};

function initialDraft(): DraftState {
  return {
    step: 1,
    teamSize: null,
    players: [],
    rewardPool: "",
    buyerName: "",
    buyerWorkEmail: "",
    buyerCompany: "",
    consentTerms: false,
    consentGdpr: false,
  };
}

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

/** Runs full validation, but returns only the slice of errors relevant to `step` — so a mistake on a later step never blocks earlier navigation. */
function validateStep(step: number, draft: DraftState): OrderErrors {
  const all = validateOrderInput(draftToOrderInput(draft));
  if (step === 1) return all.teamSize ? { teamSize: all.teamSize } : {};
  if (step === 2) return all.players ? { players: all.players } : {};
  if (step === 3) return all.rewardPool ? { rewardPool: all.rewardPool } : {};
  const e: OrderErrors = {};
  if (all.buyerName) e.buyerName = all.buyerName;
  if (all.buyerEmail) e.buyerEmail = all.buyerEmail;
  if (all.buyerCompany) e.buyerCompany = all.buyerCompany;
  if (all.consentTerms) e.consentTerms = all.consentTerms;
  if (all.consentGdpr) e.consentGdpr = all.consentGdpr;
  return e;
}

function earliestErrorStep(errors: OrderErrors): 1 | 2 | 3 | 4 | null {
  if (errors.teamSize) return 1;
  if (errors.players?.some(Boolean)) return 2;
  if (errors.rewardPool) return 3;
  if (errors.buyerName || errors.buyerEmail || errors.buyerCompany || errors.consentTerms || errors.consentGdpr) {
    return 4;
  }
  return null;
}

export function OrderWizard() {
  const t = useTranslations("cognitiveRewardsOrder");
  const locale = useLocale();
  const router = useRouter();

  const [draft, setDraft] = useState<DraftState>(initialDraft);
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Client-only restore of an in-progress draft (sessionStorage is unavailable
  // during SSR), so setting state here is intentional and runs at most once on mount.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDraft((d) => ({ ...d, ...(JSON.parse(raw) as Partial<DraftState>) }));
    } catch {
      // corrupt or unavailable storage — start fresh
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft, hydrated]);

  const pricing = useMemo(
    () => (draft.teamSize ? computeOrderPricing(draft.teamSize, Number(draft.rewardPool) || 0) : null),
    [draft.teamSize, draft.rewardPool]
  );

  function goToStep(step: DraftState["step"]) {
    setErrors({});
    setGlobalError(null);
    setDraft((d) => ({ ...d, step }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    const stepErrors = validateStep(draft.step, draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (draft.step < TOTAL_STEPS) goToStep((draft.step + 1) as DraftState["step"]);
  }

  function handleBack() {
    if (draft.step > 1) goToStep((draft.step - 1) as DraftState["step"]);
  }

  function handleTeamSizeSelect(size: TeamSize) {
    setDraft((d) => ({
      ...d,
      teamSize: size,
      players: Array.from({ length: size }, (_, i) => d.players[i] ?? { ...EMPTY_PLAYER }),
    }));
  }

  function updatePlayer(index: number, patch: Partial<PlayerInput>) {
    setDraft((d) => {
      const players = d.players.slice();
      players[index] = { ...players[index], ...patch };
      return { ...d, players };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const stepErrors = validateStep(4, draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setSubmitting(true);
    setErrors({});
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
        pricing?: ReturnType<typeof computeOrderPricing>;
        errors?: OrderErrors;
        code?: string;
      };

      if (res.ok && data.ok && data.orderId && data.pricing) {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        initiateCheckout(
          {
            orderId: data.orderId,
            pricing: data.pricing,
            teamSize: draft.teamSize as TeamSize,
            buyerCompany: draft.buyerCompany,
          },
          (path) => router.push(path)
        );
        return;
      }

      if (data.errors) {
        setErrors(data.errors);
        const jumpStep = earliestErrorStep(data.errors);
        if (jumpStep) setDraft((d) => ({ ...d, step: jumpStep }));
      }
      setGlobalError(data.code ?? "GENERIC");
    } catch {
      setGlobalError("NETWORK");
    } finally {
      setSubmitting(false);
    }
  }

  const steps: Array<{ key: "teamSize" | "players" | "pool" | "review" }> = [
    { key: "teamSize" },
    { key: "players" },
    { key: "pool" },
    { key: "review" },
  ];

  return (
    <div
      className="glass-strong"
      style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 28 }}
    >
      <nav aria-label={t("wizard.stepLabel", { current: draft.step, total: TOTAL_STEPS })} className="order-progress">
        <span className="sr-only">{t("wizard.stepLabel", { current: draft.step, total: TOTAL_STEPS })}</span>
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const status = stepNum === draft.step ? "active" : stepNum < draft.step ? "done" : "";
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}>
              <div className={`order-progress-step ${status}`} aria-current={stepNum === draft.step ? "step" : undefined}>
                <span className="order-progress-dot" aria-hidden="true">
                  {stepNum < draft.step ? "✓" : stepNum}
                </span>
                <span className="order-progress-label">{t(`wizard.steps.${s.key}`)}</span>
              </div>
              {i < steps.length - 1 && <span className={`order-progress-line ${stepNum < draft.step ? "done" : ""}`} />}
            </div>
          );
        })}
      </nav>

      <form onSubmit={handleSubmit} noValidate>
        {draft.step === 1 && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ padding: 0, marginBottom: 8 }}>
              <h2 className="h-card" style={{ margin: 0, fontSize: 22 }}>
                {t("wizard.step1.heading")}
              </h2>
            </legend>
            <p className="body" style={{ margin: "0 0 20px" }}>
              {t("wizard.step1.intro")}
            </p>
            <div className="grid grid-3" role="radiogroup" aria-label={t("wizard.step1.heading")}>
              {TEAM_SIZES.map((size) => {
                const selected = draft.teamSize === size;
                return (
                  <label key={size} className={`order-choice-card ${selected ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="teamSize"
                      value={size}
                      checked={selected}
                      onChange={() => handleTeamSizeSelect(size)}
                    />
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)" }}>
                      {t("wizard.step1.playersCount", { n: size })}
                    </span>
                    <span style={{ fontSize: 19, fontWeight: 700, color: "var(--primary)" }}>
                      €{GAME_FEE_EUR[size]}{" "}
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-3)" }}>
                        {t("wizard.step1.vatSuffix")}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.teamSize && (
              <p className="err" role="alert" style={{ marginTop: 10 }}>
                {t(`wizard.errors.${orderErrorKey(errors.teamSize)}`)}
              </p>
            )}
            <p className="small" style={{ marginTop: 16 }}>
              {t("wizard.step1.helper")}
            </p>
          </fieldset>
        )}

        {draft.step === 2 && (
          <div>
            <h2 className="h-card" style={{ margin: "0 0 8px", fontSize: 22 }}>
              {t("wizard.step2.heading")}
            </h2>
            <p className="body" style={{ margin: "0 0 20px" }}>
              {t("wizard.step2.intro")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {draft.players.map((player, i) => {
                const rowErrors = errors.players?.[i];
                return (
                  <div key={i} className="order-player-row">
                    <div className="field">
                      <label htmlFor={`player-${i}-name`}>
                        {t("wizard.step2.playerLabel", { n: i + 1 })} — {t("wizard.step2.fields.name")}
                      </label>
                      <input
                        id={`player-${i}-name`}
                        type="text"
                        value={player.name}
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={Boolean(rowErrors?.name)}
                        onChange={(e) => updatePlayer(i, { name: e.target.value })}
                      />
                      {rowErrors?.name && (
                        <span className="err" role="alert">
                          {t(`wizard.errors.${orderErrorKey(rowErrors.name)}`)}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor={`player-${i}-email`}>{t("wizard.step2.fields.email")}</label>
                      <input
                        id={`player-${i}-email`}
                        type="email"
                        value={player.email}
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={Boolean(rowErrors?.email)}
                        onChange={(e) => updatePlayer(i, { email: e.target.value })}
                      />
                      {rowErrors?.email && (
                        <span className="err" role="alert">
                          {t(`wizard.errors.${orderErrorKey(rowErrors.email)}`)}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor={`player-${i}-role`}>{t("wizard.step2.fields.role")}</label>
                      <select
                        id={`player-${i}-role`}
                        value={player.role}
                        aria-required="true"
                        aria-invalid={Boolean(rowErrors?.role)}
                        onChange={(e) => updatePlayer(i, { role: e.target.value })}
                      >
                        <option value="" disabled>
                          {t("wizard.step2.rolePlaceholder")}
                        </option>
                        {PLAYER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {t(`wizard.step2.roles.${role}`)}
                          </option>
                        ))}
                      </select>
                      {rowErrors?.role && (
                        <span className="err" role="alert">
                          {t(`wizard.errors.${orderErrorKey(rowErrors.role)}`)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="small" style={{ marginTop: 14 }}>
              {t("wizard.step2.roleHint")}
            </p>
          </div>
        )}

        {draft.step === 3 && (
          <div>
            <h2 className="h-card" style={{ margin: "0 0 8px", fontSize: 22 }}>
              {t("wizard.step3.heading")}
            </h2>
            <p className="body" style={{ margin: "0 0 24px" }}>
              {t("wizard.step3.intro")}
            </p>
            <span
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: 10,
              }}
            >
              {t("wizard.step3.quickPickLabel")}
            </span>
            <div
              role="radiogroup"
              aria-label={t("wizard.step3.quickPickLabel")}
              className="order-pool-grid"
              style={{ marginBottom: 20 }}
            >
              {REWARD_POOL_QUICK_PICKS.map((amount) => {
                const selected = draft.rewardPool === amount;
                return (
                  <label key={amount} className={`order-choice-card order-pool-card ${selected ? "selected" : ""}`}>
                    {amount === REWARD_POOL_MOST_POPULAR && (
                      <span className="order-pool-badge">{t("wizard.step3.mostPopular")}</span>
                    )}
                    <input
                      type="radio"
                      name="rewardPoolPreset"
                      value={amount}
                      checked={selected}
                      onChange={() => setDraft((d) => ({ ...d, rewardPool: amount }))}
                    />
                    <span className="order-pool-card-amount">€{amount}</span>
                  </label>
                );
              })}
            </div>
            <div className="field" style={{ maxWidth: 260 }}>
              <label htmlFor="reward-pool">{t("wizard.step3.customLabel")}</label>
              <input
                id="reward-pool"
                type="number"
                inputMode="numeric"
                min={MIN_REWARD_POOL_EUR}
                max={MAX_REWARD_POOL_EUR}
                step={1}
                value={draft.rewardPool}
                aria-required="true"
                aria-invalid={Boolean(errors.rewardPool)}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => ({ ...d, rewardPool: v === "" ? "" : Math.round(Number(v)) }));
                }}
              />
              <span className="hint">{t("wizard.step3.minHint")}</span>
              {errors.rewardPool && (
                <span className="err" role="alert">
                  {t(`wizard.errors.${orderErrorKey(errors.rewardPool)}`)}
                </span>
              )}
            </div>
            <p className="small" style={{ marginTop: 16 }}>
              {t("wizard.step3.noVat")}
            </p>
          </div>
        )}

        {draft.step === 4 && (
          <div>
            <h2 className="h-card" style={{ margin: "0 0 8px", fontSize: 22 }}>
              {t("wizard.step4.heading")}
            </h2>
            <div className="form-grid" style={{ marginBottom: 8 }}>
              <div className="field">
                <label htmlFor="buyer-name">{t("wizard.step4.fields.buyerName")}</label>
                <input
                  id="buyer-name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.buyerName)}
                  value={draft.buyerName}
                  onChange={(e) => setDraft((d) => ({ ...d, buyerName: e.target.value }))}
                />
                {errors.buyerName && (
                  <span className="err" role="alert">
                    {t(`wizard.errors.${orderErrorKey(errors.buyerName)}`)}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="buyer-email">{t("wizard.step4.fields.buyerEmail")}</label>
                <input
                  id="buyer-email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.buyerEmail)}
                  value={draft.buyerWorkEmail}
                  onChange={(e) => setDraft((d) => ({ ...d, buyerWorkEmail: e.target.value }))}
                />
                {errors.buyerEmail && (
                  <span className="err" role="alert">
                    {t(`wizard.errors.${orderErrorKey(errors.buyerEmail)}`)}
                  </span>
                )}
              </div>
              <div className="field col-2">
                <label htmlFor="buyer-company">{t("wizard.step4.fields.buyerCompany")}</label>
                <input
                  id="buyer-company"
                  type="text"
                  autoComplete="organization"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.buyerCompany)}
                  value={draft.buyerCompany}
                  onChange={(e) => setDraft((d) => ({ ...d, buyerCompany: e.target.value }))}
                />
                {errors.buyerCompany && (
                  <span className="err" role="alert">
                    {t(`wizard.errors.${orderErrorKey(errors.buyerCompany)}`)}
                  </span>
                )}
              </div>
            </div>
            <p className="small" style={{ margin: "0 0 20px" }}>
              {t("wizard.step4.billingNote")}
            </p>

            {pricing && draft.teamSize && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(15,29,69,0.08)",
                  marginBottom: 20,
                }}
              >
                <h3 className="h-card" style={{ margin: "0 0 12px", fontSize: 16 }}>
                  {t("wizard.step4.summary.heading")}
                </h3>
                <div className="order-summary-row">
                  <span>{t("wizard.step4.summary.gameFee", { size: draft.teamSize })}</span>
                  <span>{formatEur(pricing.gameFee, locale)}</span>
                </div>
                <div className="order-summary-row">
                  <span>{t("wizard.step4.summary.vatEstimate")}</span>
                  <span>{formatEur(pricing.vatAmount, locale)}</span>
                </div>
                <div className="order-summary-row">
                  <span>{t("wizard.step4.summary.rewardPool")}</span>
                  <span>{formatEur(pricing.rewardPool, locale)}</span>
                </div>
                <div className="order-summary-row total">
                  <span>{t("wizard.step4.summary.total")}</span>
                  <span>{formatEur(pricing.total, locale)}</span>
                </div>
                <p className="small" style={{ marginTop: 12, marginBottom: 0 }}>
                  {t("wizard.step4.summary.vatExplainer")}
                </p>
              </div>
            )}

            <div className="field" style={{ marginBottom: 10 }}>
              <label className="checkbox-row" htmlFor="consent-terms">
                <input
                  id="consent-terms"
                  type="checkbox"
                  required
                  aria-required="true"
                  checked={draft.consentTerms}
                  onChange={(e) => setDraft((d) => ({ ...d, consentTerms: e.target.checked }))}
                />
                <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  {t.rich("wizard.step4.consent.terms", {
                    termsLink: (chunks) => (
                      <Link href="/legal#terms" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                        {chunks}
                      </Link>
                    ),
                    privacyLink: (chunks) => (
                      <Link href="/legal#privacy" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                        {chunks}
                      </Link>
                    ),
                  })}
                </span>
              </label>
              {errors.consentTerms && (
                <span className="err" role="alert">
                  {t(`wizard.errors.${orderErrorKey(errors.consentTerms)}`)}
                </span>
              )}
            </div>
            <div className="field">
              <label className="checkbox-row" htmlFor="consent-gdpr">
                <input
                  id="consent-gdpr"
                  type="checkbox"
                  required
                  aria-required="true"
                  checked={draft.consentGdpr}
                  onChange={(e) => setDraft((d) => ({ ...d, consentGdpr: e.target.checked }))}
                />
                <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  {t("wizard.step4.consent.gdpr")}
                </span>
              </label>
              {errors.consentGdpr && (
                <span className="err" role="alert">
                  {t(`wizard.errors.${orderErrorKey(errors.consentGdpr)}`)}
                </span>
              )}
            </div>
          </div>
        )}

        {globalError && (
          <p role="alert" style={{ marginTop: 18, fontSize: 13.5, color: "#b91c1c" }}>
            {t(`wizard.errors.${orderErrorKey(globalError)}`)}
          </p>
        )}

        <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            {draft.step > 1 && (
              <button type="button" className="btn btn-glass" onClick={handleBack} disabled={submitting}>
                {t("wizard.nav.back")}
              </button>
            )}
          </div>
          {draft.step < TOTAL_STEPS ? (
            <button type="button" className="btn btn-primary" style={{ background: "var(--navy)" }} onClick={handleNext}>
              {t("wizard.nav.next")} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: "var(--navy)", opacity: submitting ? 0.7 : 1, cursor: submitting ? "wait" : "pointer" }}
              disabled={submitting}
              aria-disabled={submitting}
            >
              {submitting ? t("wizard.nav.submitting") : t("wizard.nav.submit")} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
