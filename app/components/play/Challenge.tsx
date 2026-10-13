"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { GameView } from "@/app/lib/game/types";
import { GameMasterSays } from "./GameMaster";
import { TeamBar } from "./TeamBar";
import { firstName, useCountdown, type ActResult } from "./usePlay";
import { Scene } from "./PlayArt";

const MAX = 600;

export function Challenge({ view, act }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult> }) {
  const t = useTranslations("play.challenge");
  const tp = useTranslations("play");
  const c = view.challenge!;
  const judging = view.phase === "judging";
  const [text, setText] = useState(c.text);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const left = useCountdown(c.deadlineAt, view.serverNow);
  const dirty = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  // Non-hosts follow the host's text live; the host edits a local draft.
  const shown = c.isHost ? text : c.text;

  // Host: debounced sync so teammates see the draft as it's written.
  function onChange(v: string) {
    setText(v.slice(0, MAX));
    dirty.current = true;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      dirty.current = false;
      void act({ action: "challenge", text: v.slice(0, MAX) });
    }, 700);
  }

  async function submit() {
    setBusy(true);
    setError(null);
    if (timer.current) window.clearTimeout(timer.current);
    const res = await act({ action: "submitChallenge", text });
    if (!res.ok) setError(tp("errors.generic"));
    setBusy(false);
  }

  return (
    <div className="play-stack">
      <TeamBar view={view} label={t("stepLabel")} />
      <section className="play-card glass-strong scene-card" aria-labelledby="challenge-title">
        <Scene kind="challenge" />
        <p className="play-eyebrow">{t("stepLabel")}</p>
        <h1 id="challenge-title" className="play-title">
          {t("title")}
        </h1>
        <GameMasterSays>{c.prompt}</GameMasterSays>
        {!judging && (
          <p className="play-timer">{t("timeLeft", { m: Math.floor(left / 60), s: String(left % 60).padStart(2, "0") })}</p>
        )}

        {judging ? (
          <div className="play-action">
            <p className="play-waiting">
              <span className="play-pulse" aria-hidden="true" />
              {t("judging")}
            </p>
          </div>
        ) : c.isHost ? (
          <div className="challenge-editor">
            <label htmlFor="challenge-text" className="order-label">
              {t("editorLabel")}
            </label>
            <textarea id="challenge-text" className="challenge-textarea whiteboard" rows={5} maxLength={MAX} value={text} onChange={(e) => onChange(e.target.value)} />
            <p className="order-hint">
              {t("hostHint")} · {text.length}/{MAX}
            </p>
            <div className="play-action">
              <button type="button" className="btn btn-primary play-primary" onClick={submit} disabled={busy || text.trim().length < 10}>
                {busy ? t("submitting") : t("submit")}
              </button>
              {error && (
                <p className="play-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="challenge-readonly">
            <p className="order-label">{t("liveLabel", { host: firstName(view.host?.name ?? "") })}</p>
            <div className="challenge-live" aria-live="polite">
              {shown.trim() ? shown : <span className="challenge-empty">{t("liveEmpty")}</span>}
            </div>
            <p className="play-small">{t("guestHint")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
