"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { GameView } from "@/app/lib/game/types";
import { GameMasterSays } from "./GameMaster";
import { PieceView } from "./Pieces";
import { TeamBar } from "./TeamBar";
import { CheckBurstIcon, TemplateIcon } from "./PlayIcons";
import { Burst, Scene, Stamp } from "./PlayArt";
import { ChoiceAnswer, GridAnswer } from "./TalkAnswer";
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
  const hideIn = useCountdown(r.pieceHidesAt, view.serverNow);
  // Flash twist: the server stops sending the piece once its time is up; hide it locally on the beat too.
  const pieceGone = r.pieceHidden || (r.pieceHidesAt !== null && hideIn <= 0);
  const talkAnswer = r.prompt.answerType === "choice" || r.prompt.answerType === "grid";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await send(answer);
  }
  async function send(value: string) {
    if (!value.trim() || busy) return;
    setBusy("attempt");
    setError(null);
    setFeedback(null);
    const res = await act({ action: "attempt", answer: value });
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
  async function simple(action: string, extra: Record<string, unknown> = {}) {
    setBusy(action);
    setError(null);
    const res = await act({ action, ...extra });
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
            {r.twist && <span className={`round-role-chip twist twist-${r.twist}`}>{t(`twist.${r.twist}`)}</span>}
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

        {r.twist === "rush" && r.status === "active" && <p className="round-twist-note">{t("twistNote.rush")}</p>}

        {!r.isSolver && r.status === "active" && r.pieceHidesAt && !pieceGone && (
          <p className="round-twist-note is-flash" role="status">
            {t("twistNote.flash", { s: hideIn })}
          </p>
        )}
        {!r.isSolver && r.status === "active" && pieceGone && (
          <div className="round-piece gone" role="status">
            <p className="round-piece-label">{t("twistNote.gone", { name: firstName(r.solver.name) })}</p>
          </div>
        )}

        {r.myPiece && r.myPiece.kind !== "none" && !(talkAnswer && r.isSolver && r.status === "active") && !(pieceGone && !r.isSolver) && (
          <div className="round-piece flip-in">
            <p className="round-piece-label">{r.isSolver ? t("yourPieceSolver") : t("yourPiece", { name: firstName(r.solver.name) })}</p>
            <PieceView piece={r.myPiece} labels={r.labels} />
          </div>
        )}
        {r.template === "callback" && !r.isSolver && <p className="play-small">{t("callbackSource")}</p>}

        {r.revealedPieces.length > 0 && (
          <div className="round-revealed">
            <p className="round-piece-label">{t("revealedLabel")}</p>
            {r.revealedPieces.map((rp) => (
              <div key={rp.name} className="round-revealed-item">
                <p className="play-small">{t("revealedFrom", { name: firstName(rp.name) })}</p>
                <PieceView piece={rp.piece} labels={r.labels} />
              </div>
            ))}
          </div>
        )}

        {r.status === "active" && r.isSolver && talkAnswer && r.myPiece && (
          <div className="round-answer console">
            {burst && <Burst tone={burst} />}
            {r.prompt.answerType === "grid" && r.myPiece.kind === "canvas" ? (
              <GridAnswer rows={r.myPiece.rows} cols={r.myPiece.cols} busy={busy === "attempt"} wrong={feedback === "wrong"} attemptsLeft={r.attemptsLeft} labels={r.labels} onSubmit={send} />
            ) : (
              <ChoiceAnswer piece={r.myPiece} busy={busy === "attempt"} wrong={feedback === "wrong"} attemptsLeft={r.attemptsLeft} labels={r.labels} onSubmit={send} />
            )}
            <p className="order-error" role="alert">
              {feedback === "wrong" ? t("wrong") : error ?? ""}
            </p>
            {r.hint && <p className="round-hint">{r.hint}</p>}
            <SolverTools r={r} view={view} hintIn={hintIn} busy={busy} onAction={simple} />
          </div>
        )}

        {r.status === "active" && r.isSolver && !talkAnswer && (
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
            <SolverTools r={r} view={view} hintIn={hintIn} busy={busy} onAction={simple} />
          </form>
        )}

        {r.status === "active" && !r.isSolver && (
          <div className="round-source" aria-live="polite">
            {r.stuck ? (
              <div className="round-stuck">
                <p className="round-stuck-text">
                  {r.stuckNeed.length === 0
                    ? t("stuckBanner", { name: firstName(r.solver.name) })
                    : r.stuckNeed.includes(view.me.id)
                      ? t("stuckBannerYou", { name: firstName(r.solver.name) })
                      : t("stuckBannerOthers", { name: firstName(r.solver.name), names: view.players.filter((p) => r.stuckNeed.includes(p.id)).map((p) => firstName(p.name)).join(", ") })}
                </p>
                <p className="round-stuck-tip">{t(`stuckTip.${STUCK_TIPS.has(r.template) ? r.template : "default"}` as "stuckTip.default")}</p>
                {r.stuckNudge && <GameMasterSays>{r.stuckNudge}</GameMasterSays>}
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

const STUCK_TIPS = new Set(["common", "lineup", "blueprint", "slot", "snack", "replyall", "wifi", "desks"]);

function SolverTools({ r, view, hintIn, busy, onAction }: { r: NonNullable<GameView["round"]>; view: GameView; hintIn: number; busy: string | null; onAction: (a: string, extra?: Record<string, unknown>) => void }) {
  const t = useTranslations("play.round");
  const [picking, setPicking] = useState(false);
  const [need, setNeed] = useState<string[]>([]);
  const teammates = view.players.filter((p) => p.id !== view.me.id);
  if (picking && !r.stuck) {
    return (
      <div className="stuck-picker" role="group" aria-labelledby="stuck-pick-label">
        <p id="stuck-pick-label" className="round-piece-label">{t("stuckPick")}</p>
        <div className="stuck-chips">
          {teammates.map((p) => (
            <button key={p.id} type="button" aria-pressed={need.includes(p.id)} className={`stuck-chip ${need.includes(p.id) ? "on" : ""}`} onClick={() => setNeed((n) => (n.includes(p.id) ? n.filter((x) => x !== p.id) : [...n, p.id]))}>
              {firstName(p.name)}
            </button>
          ))}
        </div>
        <div className="round-tools">
          <button type="button" className="btn btn-primary round-tool" disabled={busy === "stuck"} onClick={() => onAction("stuck", { need })}>
            {need.length ? t("stuckSend") : t("stuckEveryone")}
          </button>
          <button type="button" className="btn btn-ghost round-tool" onClick={() => setPicking(false)}>
            {t("stuckCancel")}
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      {r.stuck && r.stuckNudge && <GameMasterSays>{r.stuckNudge}</GameMasterSays>}
      <div className="round-tools">
        {!r.hint && (
          <button type="button" className="btn btn-ghost round-tool" onClick={() => onAction("hint")} disabled={hintIn > 0 || busy === "hint"}>
            {hintIn > 0 ? t("hintIn", { s: hintIn }) : t("hint")}
          </button>
        )}
        {!r.stuck ? (
          <button type="button" className="btn btn-ghost round-tool" onClick={() => setPicking(true)} disabled={busy === "stuck"}>
            {t("stuck")}
          </button>
        ) : (
          <span className="round-stuck-sent">{t("stuckSent", { n: r.acknowledgedCount })}</span>
        )}
      </div>
    </>
  );
}
