"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { GameView } from "@/app/lib/game/types";
import { GameMasterSays } from "./GameMaster";
import { TeamBar } from "./TeamBar";
import { firstName, initials, type ActResult } from "./usePlay";
import { LockIcon } from "./PlayIcons";
import { Scene } from "./PlayArt";
import { avatarStyle } from "./usePlay";

export function KeyCeremony({ view, act }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult> }) {
  const t = useTranslations("play.key");
  const tp = useTranslations("play");
  const k = view.key!;
  const [values, setValues] = useState<string[]>(() => k.blanks.map((b) => b.value ?? ""));
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mineDone = k.enteredCorrectly.includes(view.me.id);
  const waiting = view.players.filter((p) => !k.enteredCorrectly.includes(p.id)).map((p) => firstName(p.name));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setWrong(false);
    const res = await act({ action: "key", values });
    if (!res.ok) setError(tp("errors.generic"));
    else if (res.correct === false) setWrong(true);
    setBusy(false);
  }

  return (
    <div className="play-stack">
      <TeamBar view={view} label={t("stepLabel")} />
      <section className="play-card glass-strong key-card scene-card" aria-labelledby="key-title">
        <Scene kind="key" />
        <p className="play-eyebrow">{t("stepLabel")}</p>
        <h1 id="key-title" className="play-title">
          {t("title")}
        </h1>
        <GameMasterSays>{k.intro}</GameMasterSays>

        <div className={`key-lock ${wrong ? "shake" : ""}`}>
          <span className={`key-lock-icon ${mineDone ? "mine" : ""}`} aria-hidden="true">
            <LockIcon size={30} open={k.enteredCorrectly.length === view.teamSize} />
          </span>
          <div>
            <span className="key-lock-count">{t("entered", { n: k.enteredCorrectly.length, total: view.teamSize })}</span>
            <ul className="key-avatars" aria-hidden="true">
              {view.players.map((p, i) => (
                <li key={p.id} className={k.enteredCorrectly.includes(p.id) ? "lit" : ""} style={k.enteredCorrectly.includes(p.id) ? avatarStyle(i) : undefined}>
                  {initials(p.name)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {mineDone ? (
          <div className="play-action">
            <p className="play-ready">{t("yours")}</p>
            {waiting.length > 0 && (
              <p className="play-waiting">
                <span className="play-pulse" aria-hidden="true" />
                {t("waiting", { names: waiting.join(", "), count: waiting.length })}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="key-form">
            <p className="play-small">{t("help")}</p>
            <div className="key-blanks">
              {k.blanks.map((b, i) => (
                <div key={i} className="order-field dial-field">
                  <label htmlFor={`key-${i}`}>{b.label}</label>
                  <div className={`order-input dial-input ${wrong ? "invalid" : ""}`}>
                    <span className="dial-number" aria-hidden="true">{i + 1}</span>
                    <input
                      id={`key-${i}`}
                      type="text"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      maxLength={20}
                      value={values[i] ?? ""}
                      readOnly={b.value !== null}
                      onChange={(e) => setValues((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
                    />
                  </div>
                  {b.value !== null && <span className="order-hint">{t("revealed")}</span>}
                </div>
              ))}
            </div>
            <p className="order-error" role="alert">
              {wrong ? t("wrong") : error ?? ""}
            </p>
            <div className="play-action">
              <button type="submit" className="btn btn-primary play-primary" disabled={busy || values.some((v) => !v.trim())}>
                {busy ? t("checking") : t("submit")}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
