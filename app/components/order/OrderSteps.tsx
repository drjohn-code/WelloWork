"use client";

import type { Dispatch, SetStateAction } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatEurShort } from "@/app/lib/format";
import {
  computePoolSplit,
  GAME_FEE_EUR,
  MAX_REWARD_POOL_EUR,
  MIN_REWARD_POOL_EUR,
  PLAYER_ROLES,
  REWARD_POOL_QUICK_PICKS,
  REWARD_POOL_SUGGESTED,
  TEAM_SIZES,
  type PlayerInput,
  type PlayerRole,
  type TeamSize,
} from "@/app/lib/cognitive-rewards-order";
import { ChoiceCard, FieldError, OrderCheckbox, OrderTextField, SegmentedRadio } from "./OrderFields";
import { PeopleIcon } from "./OrderIcons";
import { OrderPriceLines } from "./OrderSummary";
import type { DraftState, OrderStep } from "./orderDraft";

export type StepProps = {
  draft: DraftState;
  setDraft: Dispatch<SetStateAction<DraftState>>;
  /** Translated error for a field, or undefined if it's valid or not yet shown (untouched + not attempted). */
  errorFor: (key: string) => string | undefined;
  touch: (key: string) => void;
};

const EMPTY_PLAYER: PlayerInput = { name: "", email: "", role: "" };

function StepHeading({ children, intro }: { children: string; intro?: string }) {
  return (
    <div className="order-step-head">
      {/* Focus target on step change (tabIndex -1), so screen readers announce the new step. */}
      <h2 id="order-step-heading" tabIndex={-1} className="order-step-title">
        {children}
      </h2>
      {intro && <p className="order-step-intro">{intro}</p>}
    </div>
  );
}

/* ── Step 1 — Team size ─────────────────────────────────────────────────── */

export function StepTeamSize({ draft, setDraft, errorFor }: StepProps) {
  const t = useTranslations("cognitiveRewardsOrder.wizard.step1");
  const locale = useLocale();
  const error = errorFor("teamSize");

  function select(size: TeamSize) {
    setDraft((d) => ({
      ...d,
      teamSize: size,
      players: Array.from({ length: size }, (_, i) => d.players[i] ?? { ...EMPTY_PLAYER }),
    }));
  }

  return (
    <div>
      <StepHeading intro={t("intro")}>{t("heading")}</StepHeading>
      <div className="order-team-grid" role="radiogroup" aria-labelledby="order-step-heading" aria-describedby="team-size-helper">
        {TEAM_SIZES.map((size) => {
          const fee = GAME_FEE_EUR[size];
          return (
            <ChoiceCard
              key={size}
              id={`team-size-${size}`}
              name="teamSize"
              checked={draft.teamSize === size}
              onSelect={() => select(size)}
            >
              <span className="order-team-people">
                <PeopleIcon count={size} />
              </span>
              <span className="order-team-count">{t("playersCount", { n: size })}</span>
              <span className="order-team-price">{t("feePlusVat", { price: formatEurShort(fee, locale) })}</span>
              <span className="order-team-per">{t("perPerson", { price: formatEurShort(fee / size, locale) })}</span>
            </ChoiceCard>
          );
        })}
      </div>
      <FieldError id="team-size-error" error={error} />
      <p id="team-size-helper" className="order-help">
        {t("helper")}
      </p>
    </div>
  );
}

/* ── Step 2 — Players ───────────────────────────────────────────────────── */

export function StepPlayers({ draft, setDraft, errorFor, touch }: StepProps) {
  const t = useTranslations("cognitiveRewardsOrder.wizard.step2");
  const roleOptions = PLAYER_ROLES.map((r) => ({ value: r, label: t(`roles.${r}`) }));

  function update(i: number, patch: Partial<PlayerInput>) {
    setDraft((d) => {
      const players = d.players.slice();
      players[i] = { ...players[i], ...patch };
      return { ...d, players };
    });
  }

  return (
    <div>
      <StepHeading intro={t("intro")}>{t("heading")}</StepHeading>
      <div className="order-players">
        {draft.players.map((p, i) => {
          const roleError = errorFor(`p${i}.role`);
          return (
            <fieldset key={i} className="order-player">
              <legend className="order-player-title">{t("playerLabel", { n: i + 1 })}</legend>
              <div className="order-player-grid">
                <OrderTextField
                  id={`player-${i}-name`}
                  label={t("fields.name")}
                  type="text"
                  autoComplete="off"
                  aria-required="true"
                  value={p.name}
                  error={errorFor(`p${i}.name`)}
                  onChange={(e) => update(i, { name: e.target.value })}
                  onBlur={() => touch(`p${i}.name`)}
                />
                <OrderTextField
                  id={`player-${i}-email`}
                  label={t("fields.email")}
                  type="email"
                  autoComplete="off"
                  spellCheck={false}
                  aria-required="true"
                  value={p.email}
                  error={errorFor(`p${i}.email`)}
                  onChange={(e) => update(i, { email: e.target.value })}
                  onBlur={() => touch(`p${i}.email`)}
                />
              </div>
              <div className="order-field">
                <span id={`player-${i}-role-label`} className="order-label">
                  {t("fields.role")}
                </span>
                {i === 0 && (
                  <span id="player-role-hint" className="order-hint order-hint-top">
                    {t("roleHint")}
                  </span>
                )}
                <SegmentedRadio<PlayerRole>
                  name={`player-${i}-role`}
                  idPrefix={`player-${i}-role`}
                  options={roleOptions}
                  value={p.role}
                  onChange={(role) => update(i, { role })}
                  labelledBy={`player-${i}-role-label`}
                  describedBy={[i === 0 ? "player-role-hint" : null, roleError ? `player-${i}-role-error` : null].filter(Boolean).join(" ") || undefined}
                  invalid={Boolean(roleError)}
                />
                <FieldError id={`player-${i}-role-error`} error={roleError} />
              </div>
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 3 — Reward pool ───────────────────────────────────────────────── */

export function StepRewardPool({ draft, setDraft, errorFor, touch }: StepProps) {
  const t = useTranslations("cognitiveRewardsOrder.wizard.step3");
  const locale = useLocale();
  const error = errorFor("rewardPool");
  const fmt = (n: number) => formatEurShort(n, locale);
  const split =
    draft.teamSize && draft.rewardPool !== "" ? computePoolSplit(draft.teamSize, draft.rewardPool) : null;

  function onCustomChange(raw: string) {
    const digits = raw.replace(/\D/g, "").replace(/^0+/, "").slice(0, 5);
    const n = digits === "" ? NaN : Number(digits);
    const valid = Number.isInteger(n) && n >= MIN_REWARD_POOL_EUR && n <= MAX_REWARD_POOL_EUR;
    setDraft((d) => ({ ...d, customPool: digits, rewardPool: valid ? n : "" }));
  }

  return (
    <div>
      <StepHeading intro={t("intro")}>{t("heading")}</StepHeading>

      <p id="pool-presets-label" className="order-label">
        {t("presetsLabel")}
      </p>
      <div className="order-pool-presets" role="radiogroup" aria-labelledby="pool-presets-label">
        {REWARD_POOL_QUICK_PICKS.map((amount) => (
          <ChoiceCard
            key={amount}
            id={`pool-${amount}`}
            name="rewardPoolPreset"
            checked={draft.customPool === "" && draft.rewardPool === amount}
            onSelect={() => setDraft((d) => ({ ...d, rewardPool: amount, customPool: "" }))}
            badge={amount === REWARD_POOL_SUGGESTED ? t("suggested") : undefined}
            className="order-pool-choice"
          >
            <span className="order-pool-amount">{fmt(amount)}</span>
          </ChoiceCard>
        ))}
      </div>

      <div className="order-pool-custom">
        <OrderTextField
          id="pool-custom"
          label={t("customLabel")}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          prefix="€"
          value={draft.customPool}
          hint={t("customHint", { min: fmt(MIN_REWARD_POOL_EUR), max: fmt(MAX_REWARD_POOL_EUR) })}
          error={error}
          onChange={(e) => onCustomChange(e.target.value)}
          onBlur={() => {
            if (draft.customPool !== "") touch("rewardPool");
          }}
        />
      </div>

      <div className="order-split" aria-live="polite">
        <p className="order-split-title">{t("splitHeading")}</p>
        <p className="order-split-body">
          {split && draft.teamSize
            ? t("split", {
                pool: fmt(draft.rewardPool as number),
                n: draft.teamSize,
                min: fmt(split.minPerPlayer),
                rest: fmt(split.performancePart),
              })
            : t("splitEmpty")}
        </p>
      </div>

      <p className="order-help">{t("noVat")}</p>
    </div>
  );
}

/* ── Step 4 — Details & review ──────────────────────────────────────────── */

export type ErrorSummaryItem = { key: string; targetId: string; message: string };

export function StepReview({
  draft,
  setDraft,
  errorFor,
  touch,
  onEdit,
  summaryItems,
}: StepProps & { onEdit: (step: OrderStep) => void; summaryItems: ErrorSummaryItem[] }) {
  const t = useTranslations("cognitiveRewardsOrder.wizard.step4");
  const tSteps = useTranslations("cognitiveRewardsOrder.wizard.steps");
  const locale = useLocale();
  const names = draft.players.map((p) => p.name.trim()).filter(Boolean);
  const listFormat = (() => {
    try {
      return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(names);
    } catch {
      return names.join(", ");
    }
  })();

  return (
    <div>
      <StepHeading>{t("heading")}</StepHeading>

      {summaryItems.length > 0 && (
        <div className="order-error-summary" role="alert" aria-labelledby="order-error-summary-title">
          <p id="order-error-summary-title">{t("errorSummary")}</p>
          <ul>
            {summaryItems.map((item) => (
              <li key={item.key}>
                <a
                  href={`#${item.targetId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.targetId)?.focus();
                  }}
                >
                  {item.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="order-review" aria-labelledby="order-review-title">
        <h3 id="order-review-title" className="order-subtitle">
          {t("reviewHeading")}
        </h3>
        <dl className="order-review-list">
          <div className="order-review-row">
            <dt>{t("reviewTeam")}</dt>
            <dd>{t("reviewTeamValue", { names: listFormat, n: draft.teamSize ?? 0 })}</dd>
            <button type="button" className="order-link-btn" onClick={() => onEdit(2)} aria-label={t("editLabel", { section: tSteps("players") })}>
              {t("edit")}
            </button>
          </div>
          <div className="order-review-row">
            <dt>{t("reviewPool")}</dt>
            <dd>{draft.rewardPool === "" ? "—" : formatEurShort(draft.rewardPool, locale)}</dd>
            <button type="button" className="order-link-btn" onClick={() => onEdit(3)} aria-label={t("editLabel", { section: tSteps("pool") })}>
              {t("edit")}
            </button>
          </div>
        </dl>
      </section>

      <section aria-labelledby="order-buyer-title">
        <h3 id="order-buyer-title" className="order-subtitle">
          {t("buyerHeading")}
        </h3>
        <div className="order-buyer-grid">
          <OrderTextField
            id="buyer-name"
            label={t("fields.buyerName")}
            type="text"
            autoComplete="name"
            aria-required="true"
            value={draft.buyerName}
            error={errorFor("buyerName")}
            onChange={(e) => setDraft((d) => ({ ...d, buyerName: e.target.value }))}
            onBlur={() => touch("buyerName")}
          />
          <OrderTextField
            id="buyer-email"
            label={t("fields.buyerEmail")}
            type="email"
            autoComplete="email"
            spellCheck={false}
            aria-required="true"
            value={draft.buyerWorkEmail}
            error={errorFor("buyerEmail")}
            onChange={(e) => setDraft((d) => ({ ...d, buyerWorkEmail: e.target.value }))}
            onBlur={() => touch("buyerEmail")}
          />
          <div className="order-buyer-wide">
            <OrderTextField
              id="buyer-company"
              label={t("fields.buyerCompany")}
              type="text"
              autoComplete="organization"
              aria-required="true"
              value={draft.buyerCompany}
              error={errorFor("buyerCompany")}
              onChange={(e) => setDraft((d) => ({ ...d, buyerCompany: e.target.value }))}
              onBlur={() => touch("buyerCompany")}
            />
          </div>
        </div>
        <p className="order-help">{t("billingNote")}</p>
      </section>

      {/* On desktop the price lives in the sticky side card; on mobile it's shown here. */}
      <div className="order-inline-price">
        <OrderPriceLines teamSize={draft.teamSize} rewardPool={draft.rewardPool} />
      </div>

      <div className="order-consents">
        <OrderCheckbox
          id="consent-terms"
          checked={draft.consentTerms}
          onChange={(v) => setDraft((d) => ({ ...d, consentTerms: v }))}
          error={errorFor("consentTerms")}
        >
          {t.rich("consent.terms", {
            termsLink: (chunks) => <Link href="/legal#terms">{chunks}</Link>,
            privacyLink: (chunks) => <Link href="/legal#privacy">{chunks}</Link>,
          })}
        </OrderCheckbox>
        <OrderCheckbox
          id="consent-gdpr"
          checked={draft.consentGdpr}
          onChange={(v) => setDraft((d) => ({ ...d, consentGdpr: v }))}
          error={errorFor("consentGdpr")}
        >
          {t("consent.gdpr")}
        </OrderCheckbox>
      </div>
    </div>
  );
}

export function WhatHappensNext() {
  const t = useTranslations("cognitiveRewardsOrder.wizard.step4.next");
  return (
    <section className="order-next" aria-labelledby="order-next-title">
      <h3 id="order-next-title" className="order-subtitle">
        {t("heading")}
      </h3>
      <ol>
        <li>{t("pay")}</li>
        <li>{t("invoice")}</li>
        {/* onOrderPaid is still a stub — keep this neutral until invitations ship. */}
        <li>{t("email")}</li>
      </ol>
    </section>
  );
}
