"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatEurShort } from "@/app/lib/format";
import type { GameView } from "@/app/lib/game/types";
import type { ActResult } from "./usePlay";

const COUNTRIES = ["SE", "FI", "NO", "DK", "DE", "NL", "BE", "FR", "ES", "IT", "LT", "LV", "EE", "PL", "AT", "IE", "PT", "LU", "CH", "GB"] as const;

export function PayoutForm({ view, act }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult> }) {
  const t = useTranslations("play.payout");
  const locale = useLocale();
  const payout = view.scorecard?.payout;
  const [holderName, setHolderName] = useState(view.me.name);
  const [iban, setIban] = useState("");
  const [country, setCountry] = useState<string>("SE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  if (!payout) return null;
  const amount = formatEurShort(payout.amountEur, locale);
  let countryName = (code: string) => code;
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    countryName = (code: string) => dn.of(code) ?? code;
  } catch {
    // keep codes
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await act({ action: "payout", holderName, iban, country });
    if (!res.ok) {
      setError(res.code === "INVALID_IBAN" ? t("errors.iban") : res.code === "INVALID_NAME" ? t("errors.name") : t("errors.generic"));
    } else {
      setEditing(false);
      setIban("");
    }
    setBusy(false);
  }

  if (payout.status === "paid") {
    return (
      <div className="payout payout-done" role="status">
        <p className="payout-status">{t("paid", { amount, last4: payout.last4 ?? "" })}</p>
      </div>
    );
  }
  if (payout.status === "ready" && !editing) {
    return (
      <div className="payout payout-ready" role="status">
        <p className="payout-status">{t("received", { amount, last4: payout.last4 ?? "" })}</p>
        <p className="play-small">{t("timing")}</p>
        <button type="button" className="order-link-btn" onClick={() => setEditing(true)}>
          {t("change")}
        </button>
      </div>
    );
  }

  return (
    <form className="payout" onSubmit={submit} noValidate aria-labelledby="payout-title">
      <h3 id="payout-title" className="play-subtitle">
        {t("title", { amount })}
      </h3>
      <p className="play-small" style={{ margin: "4px 0 16px" }}>
        {t("intro")}
      </p>
      <div className="payout-grid">
        <div className="order-field">
          <label htmlFor="payout-name">{t("holderName")}</label>
          <div className="order-input">
            <input id="payout-name" type="text" autoComplete="name" maxLength={120} value={holderName} onChange={(e) => setHolderName(e.target.value)} />
          </div>
        </div>
        <div className="order-field">
          <label htmlFor="payout-country">{t("country")}</label>
          <div className="order-input">
            <select id="payout-country" className="payout-select" value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {countryName(c)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="order-field payout-wide">
          <label htmlFor="payout-iban">{t("iban")}</label>
          <div className={`order-input ${error === t("errors.iban") ? "invalid" : ""}`}>
            <input
              id="payout-iban"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={42}
              placeholder="SE35 5000 0000 0549 1000 0003"
              value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase())}
            />
          </div>
          <span className="order-hint">{t("ibanHint")}</span>
        </div>
      </div>
      <p className="order-error" role="alert">
        {error ?? ""}
      </p>
      <p className="play-small">{t("taxNote")}</p>
      <div className="play-action">
        <button type="submit" className="btn btn-primary play-primary" disabled={busy || !iban.trim() || holderName.trim().length < 2}>
          {busy ? t("saving") : t("submit")}
        </button>
        {editing && (
          <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)} style={{ marginTop: 8 }}>
            {t("cancel")}
          </button>
        )}
        <p className="play-small">{t("laterNote")}</p>
      </div>
    </form>
  );
}
