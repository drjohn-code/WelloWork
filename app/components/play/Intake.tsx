"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { INTAKE_OPTIONAL, INTAKE_QUESTIONS, type GameView, type IntakeKey } from "@/app/lib/game/types";
import { TeamBar } from "./TeamBar";
import { firstName, useCountdown, type ActResult } from "./usePlay";
import { Scene } from "./PlayArt";

export function Intake({ view, act }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult> }) {
  const t = useTranslations("play.intake");
  const tp = useTranslations("play");
  const intake = view.intake!;
  const [answers, setAnswers] = useState<Partial<Record<IntakeKey, string>>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const left = useCountdown(intake.deadlineAt, view.serverNow);
  const submitted = intake.mine !== null;
  const missing = INTAKE_QUESTIONS.filter((k) => !INTAKE_OPTIONAL.has(k) && !(answers[k] ?? "").trim());
  const waiting = view.players.filter((p) => !intake.submitted.includes(p.id)).map((p) => firstName(p.name));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (missing.length) return;
    setBusy(true);
    setError(null);
    const res = await act({ action: "intake", answers });
    if (!res.ok) setError(tp("errors.generic"));
    setBusy(false);
  }

  return (
    <div className="play-stack">
      <TeamBar view={view} label={t("stepLabel")} />
      <section className="play-card glass-strong scene-card" aria-labelledby="intake-title">
        <Scene kind="intake" />
        <p className="play-eyebrow">{tp("eyebrow")}</p>
        <h1 id="intake-title" className="play-title">
          {t("title")}
        </h1>
        <p className="play-intro">{t("intro")}</p>
        <p className="intake-tip">{t("tip")}</p>
        <p className="play-timer" aria-live="off">
          {t("timeLeft", { m: Math.floor(left / 60), s: String(left % 60).padStart(2, "0") })}
        </p>

        {submitted ? (
          <div className="play-action">
            <p className="play-ready">{t("thanks")}</p>
            {waiting.length > 0 ? (
              <p className="play-waiting">
                <span className="play-pulse" aria-hidden="true" />
                {t("waiting", { names: waiting.join(", "), count: waiting.length })}
              </p>
            ) : (
              <p className="play-waiting">
                <span className="play-pulse" aria-hidden="true" />
                {t("building")}
              </p>
            )}
            <p className="play-small">{t("privateNote")}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="intake-form">
            {INTAKE_QUESTIONS.map((k, i) => {
              const optional = INTAKE_OPTIONAL.has(k);
              const invalid = touched && missing.includes(k);
              return (
                <div key={k} className={`order-field sticky-note tone-${i % 4}`} style={{ animationDelay: `${i * 70}ms` }}>
                  <label htmlFor={`intake-${k}`}>
                    <span className="intake-num">{i + 1}</span> {t(`questions.${k}`)}{" "}
                    {optional && <span className="intake-optional">{t("optional")}</span>}
                  </label>
                  <div className={`order-input ${invalid ? "invalid" : ""}`}>
                    <input
                      id={`intake-${k}`}
                      type="text"
                      maxLength={120}
                      autoComplete="off"
                      placeholder={t(`placeholders.${k}`)}
                      value={answers[k] ?? ""}
                      aria-invalid={invalid}
                      onChange={(e) => setAnswers((a) => ({ ...a, [k]: e.target.value }))}
                    />
                  </div>
                  <span className="order-error" role="alert">
                    {invalid ? t("required") : ""}
                  </span>
                </div>
              );
            })}
            <p className="play-small">{t("safetyNote")}</p>
            <div className="play-action">
              <button type="submit" className="btn btn-primary play-primary" disabled={busy}>
                {busy ? t("submitting") : t("submit")}
              </button>
              {error && (
                <p className="play-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
