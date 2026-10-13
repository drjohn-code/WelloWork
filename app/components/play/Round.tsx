"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { GameView } from "@/app/lib/game/types";
import { GameMasterSays } from "./GameMaster";
import { PieceView } from "./Pieces";
import { TeamBar } from "./TeamBar";
import { CheckBurstIcon, TemplateIcon } from "./PlayIcons";
import { Burst, Scene, Stamp } from "./PlayArt";
import { firstName, useCountdown, type ActResult } from "./usePlay";

const DETAIL_VISIBLE_SEC = 8;

export function Round({ view, act, sound }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult>; sound?: { enabled: boolean; toggle: () => void; play: (n: "wrong" | "correct") => void } }) {
  const t = useTranslations("play.round");
  const tp = useTranslations("play");
  const r = view.round!;
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"wrong" | null>(null);
  const [burst, setBurst] = useState<"success" | "fail" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintIn = useCountdown(r.hintAvailableAt, view.serverNow);
  const capIn = useCountdown(r.capAt, view.serverNow);
  const nextIn = useCountdown(r.nextAt, view.serverNow);
  const detailLeft = useCountdown(r.detail ? new Date(Date.parse(r.detail.shownAt) + DETAIL_VISIBLE_SEC * 1000).toISOString() : null, view.serverNow);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || busy) return;
    setBusy("attempt");
    setError(null);
    const res = await act({ action: "attempt", answer });
    if (!res.ok) setError(tp("errors.generic"));
    else if (res.correct === false) {
      setFeedback("wrong");
      setBurst("fail");
      sound?.play("wrong");
      setAnswer("");
      inputRef.current?.focus();
      window.setTimeout(() => setBurst(null), 700);
    } else if (res.correct) {
      setBurst("success");
    }
    setBusy(null);
  }
  async function simple(action: string) {
    setBusy(action);
    setError(null);
    const res = await act({ action });
    if (!res.ok) setError(tp("errors.generic"));
    setBusy(null);
  }

  const total = r.capAt && r.startedAt ? (Date.parse(r.capAt) - Date.parse(r.startedAt)) / 1000 : 1;
  const progress = Math.max(0, Math.min(100, 100 - (capIn / total) * 100));
  const label = t("progress", { n: r.index + 1, total: r.total });

  return (
    <div className="play-stack">
      <TeamBar view={view} solverId={r.solver.id} label={label} progress={{ current: r.index, total: r.total }} sound={sound} />

      <section className="play-card glass-strong round-card deal-in scene-card" aria-labelledby="round-title">
        <Scene kind={r.template} />
        <div className="round-head">
          <div className="round-head-main">
            <span className={`round-icon icon-${r.template}`} aria-hidden="true">
              <TemplateIcon template={r.template} size={26} />
              {r.status === "active" && (
                <svg className="timer-ring" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="29" />
                  <circle cx="32" cy="32" r="29" className="timer-ring-fill" style={{ strokeDashoffset: `${182 * (progress / 100)}` }} />
                </svg>
              )}
            </span>
            <div>
              <p className="play-eyebrow">{label}</p>
              <h1 id="round-title" className="play-title round-title">
                {r.title}
              </h1>
            </div>
          </div>
          <div className="round-role" aria-live="polite">
            {r.isSolver ? <span className="round-role-chip solver">{t("youSolve")}</span> : <span className="round-role-chip">{t("solverIs", { name: firstName(r.solver.name) })}</span>}
          </div>
        </div>
        <GameMasterSays>{r.setup}</GameMasterSays>

        {r.status === "active" && (
          <div className="round-timer" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="round-prompt">
          <p className="round-prompt-label">{t("promptLabel")}</p>
          <p className="round-prompt-text">{r.prompt.text}</p>
        </div>

        {r.detail && detailLeft > 0 && (
          <div className="round-detail" role="status">
            <p className="round-detail-text">{r.detail.text}</p>
            <p className="round-detail-meta">{t("detailMeta", { s: detailLeft })}</p>
          </div>
        )}

        {r.myPiece && r.myPiece.kind !== "none" && (
          <div className="round-piece flip-in">
            <p className="round-piece-label">{r.isSolver ? t("yourPieceSolver") : t("yourPiece", { name: firstName(r.solver.name) })}</p>
            <PieceView piece={r.myPiece} />
          </div>
        )}
        {r.template === "callback" && !r.isSolver && <p className="play-small">{t("callbackSource")}</p>}

        {r.revealedPieces.length > 0 && (
          <div className="round-revealed">
            <p className="round-piece-label">{t("revealedLabel")}</p>
            {r.revealedPieces.map((rp) => (
              <div key={rp.name} className="round-revealed-item">
                <p className="play-small">{t("revealedFrom", { name: firstName(rp.name) })}</p>
                <PieceView piece={rp.piece} />
              </div>
            ))}
          </div>
        )}

        {r.status === "active" && r.isSolver && (
          <form onSubmit={submit} className={`round-answer console ${feedback === "wrong" ? "shake" : ""}`} noValidate>
            <label htmlFor="round-answer" className="order-label console-label">
              {t("answerLabel")}
            </label>
            <div className="round-answer-row">
              <div className={`order-input console-input ${feedback === "wrong" ? "invalid" : ""}`}>
                {burst && <Burst tone={burst} />}
                <input
                  ref={inputRef}
                  id="round-answer"
                  type="text"
                  inputMode={r.prompt.answerType === "digits" ? "numeric" : "text"}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={40}
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setFeedback(null);
                  }}
                  aria-describedby="round-answer-help"
                />
              </div>
              <button type="submit" className="btn btn-primary play-primary" disabled={busy === "attempt" || !answer.trim()}>
                {busy === "attempt" ? t("checking") : t("submit")}
              </button>
            </div>
            <p id="round-answer-help" className="order-hint">
              {r.prompt.answerType === "digits" ? t("digitsHelp") : t("textHelp")} · {t("attemptsLeft", { n: r.attemptsLeft })}
            </p>
            <p className="order-error" role="alert">
              {feedback === "wrong" ? t("wrong") : error ?? ""}
            </p>
            {r.hint && <p className="round-hint">{r.hint}</p>}
            <div className="round-tools">
              {!r.hint && (
                <button type="button" className="btn btn-ghost round-tool" onClick={() => simple("hint")} disabled={hintIn > 0 || busy === "hint"}>
                  {hintIn > 0 ? t("hintIn", { s: hintIn }) : t("hint")}
                </button>
              )}
              {!r.stuck ? (
                <button type="button" className="btn btn-ghost round-tool" onClick={() => simple("stuck")} disabled={busy === "stuck"}>
                  {t("stuck")}
                </button>
              ) : (
                <span className="round-stuck-sent">{t("stuckSent", { n: r.acknowledgedCount })}</span>
              )}
            </div>
          </form>
        )}

        {r.status === "active" && !r.isSolver && (
          <div className="round-source" aria-live="polite">
            {r.stuck ? (
              <div className="round-stuck">
                <p className="round-stuck-text">{t("stuckBanner", { name: firstName(r.solver.name) })}</p>
                {r.acknowledgedByMe ? (
                  <span className="round-stuck-sent">{t("acknowledged")}</span>
                ) : (
                  <button type="button" className="btn btn-primary play-primary" onClick={() => simple("acknowledge")} disabled={busy === "acknowledge"}>
                    {t("acknowledge")}
                  </button>
                )}
              </div>
            ) : (
              <p className="play-waiting">
                <span className="play-pulse" aria-hidden="true" />
                {t("sourceWaiting", { name: firstName(r.solver.name) })}
              </p>
            )}
            {error && (
              <p className="play-error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        {r.status !== "active" && (
          <div className={`round-result ${r.status}`} role="status">
            <Stamp tone={r.status === "solved" ? "success" : "fail"}>{r.status === "solved" ? t("solved") : t("failed")}</Stamp>
            <p className="round-result-title">
              {r.status === "solved" && (
                <span className="result-burst" aria-hidden="true">
                  <CheckBurstIcon size={22} />
                </span>
              )}
              {r.status === "solved" ? t("solved") : t("failed")}
            </p>
            {r.revealedAnswer && <p className="round-result-answer">{t("answerWas", { answer: r.revealedAnswer })}</p>}
            {r.reaction && <GameMasterSays tone={r.status === "solved" ? "success" : "fail"}>{r.reaction}</GameMasterSays>}
            <p className="play-small">{r.index + 1 < r.total ? t("nextIn", { s: nextIn }) : t("finaleIn", { s: nextIn })}</p>
          </div>
        )}
      </section>
    </div>
  );
}
