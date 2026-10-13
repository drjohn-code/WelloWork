"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatEurShort } from "@/app/lib/format";
import type { GameView } from "@/app/lib/game/types";
import { enabledLocaleMetas } from "@/i18n/locales";
import type { ActResult } from "./usePlay";
import { avatarStyle, firstName, initials } from "./usePlay";
import { LobbyTable } from "./PlayArt";
import { computePoolSplit, type TeamSize } from "@/app/lib/cognitive-rewards-order";

export function Lobby({ view, act, join, sound }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult>; join: () => Promise<boolean>; sound?: { enabled: boolean; toggle: () => void; play: (n: "join") => void } }) {
  const t = useTranslations("play");
  const tSound = useTranslations("play.sound");
  const locale = useLocale();
  const [busy, setBusy] = useState<"join" | "start" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const me = view.players.find((p) => p.id === view.me.id)!;
  const joinedCount = view.players.filter((p) => p.joined).length;
  const allJoined = joinedCount === view.teamSize;
  const eur = (n: number) => formatEurShort(n, locale);
  const minPer = computePoolSplit(view.teamSize as TeamSize, view.pool).minPerPlayer;
  const waitingFor = view.players.filter((p) => !p.joined && p.id !== view.me.id).map((p) => firstName(p.name));
  let waitingList: string;
  try {
    waitingList = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(waitingFor);
  } catch {
    waitingList = waitingFor.join(", ");
  }
  const languageOptions = enabledLocaleMetas();
  const languageName = languageOptions.find((l) => l.code === view.language)?.endonym ?? view.language;

  async function onJoin() {
    setBusy("join");
    setError(null);
    const ok = await join();
    if (ok) sound?.play("join");
    if (!ok) setError(t("errors.join"));
    setBusy(null);
  }
  async function onStart() {
    setBusy("start");
    setError(null);
    const res = await act({ action: "start" });
    if (!res.ok) setError(t("errors.generic"));
    setBusy(null);
  }
  async function onLanguage(code: string) {
    setError(null);
    const res = await act({ action: "language", language: code });
    if (!res.ok) setError(t("errors.generic"));
  }

  return (
    <div className="play-stack">
      <section className="play-card glass-strong scene-card" aria-labelledby="play-welcome">
        <LobbyTable players={view.players.map((p, i) => ({ name: p.name, joined: p.joined, colorIndex: i }))} />
        {sound && (
          <div className="lobby-sound">
            <button type="button" className={`sound-toggle ${sound.enabled ? "on" : ""}`} onClick={sound.toggle} aria-pressed={sound.enabled}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4z" />{sound.enabled ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /> : <path d="m17 9 4 6M21 9l-4 6" />}</svg>
              <span>{sound.enabled ? tSound("on") : tSound("off")}</span>
            </button>
          </div>
        )}
        <p className="play-eyebrow">{t("eyebrow")}</p>
        <h1 id="play-welcome" className="play-title">
          {t("welcomeLead")}
          <span className="italic-serif" style={{ color: "var(--accent)" }}>
            {firstName(view.me.name)}
          </span>
        </h1>
        <p className="play-intro">{t("intro", { buyer: view.buyerName, company: view.companyName, n: view.teamSize })}</p>

        <dl className="play-facts">
          <div>
            <dt>{t("facts.team")}</dt>
            <dd>{t("facts.teamValue", { n: view.teamSize })}</dd>
          </div>
          <div>
            <dt>{t("facts.pool")}</dt>
            <dd>{eur(view.pool)}</dd>
          </div>
          <div>
            <dt>{t("facts.min")}</dt>
            <dd>{eur(minPer)}</dd>
          </div>
        </dl>

        <div className="play-board" aria-labelledby="play-board-title">
          <div className="play-board-head">
            <h2 id="play-board-title" className="play-subtitle">
              {t("board.title")}
            </h2>
            <p className="play-board-count" aria-live="polite">
              {t("board.count", { joined: joinedCount, total: view.teamSize })}
            </p>
          </div>
          <div className="play-progress" role="progressbar" aria-valuemin={0} aria-valuemax={view.teamSize} aria-valuenow={joinedCount}>
            <span style={{ width: `${(joinedCount / view.teamSize) * 100}%` }} />
          </div>
          <ul className="play-seats">
            {view.players.map((p, i) => (
              <li key={p.id} className={`play-seat ${p.joined ? "joined" : ""} ${p.id === view.me.id ? "me" : ""}`}>
                <span className="play-avatar" style={p.joined ? avatarStyle(i) : undefined} aria-hidden="true">
                  {initials(p.name)}
                </span>
                <span className="play-seat-name">
                  {p.name}
                  {p.id === view.me.id && <span className="play-you">{t("board.you")}</span>}
                  {p.isHost && <span className="play-you host">{t("board.host")}</span>}
                </span>
                <span className={`play-status ${p.joined ? "joined" : ""}`}>{p.joined ? t("board.joined") : t("board.waiting")}</span>
              </li>
            ))}
          </ul>
          {!allJoined && <p className="play-small play-missing">{t("board.missingHint")}</p>}
        </div>

        {allJoined && view.host && (
          <div className="play-language">
            <div className="play-language-row">
              <label htmlFor="game-language" className="play-language-label">
                {t("language.label")}
              </label>
              {view.me.isHost ? (
                <select id="game-language" className="play-select" value={view.language} onChange={(e) => onLanguage(e.target.value)}>
                  {languageOptions.map((l) => (
                    <option key={l.code} value={l.code} lang={l.code}>
                      {l.endonym}
                    </option>
                  ))}
                </select>
              ) : (
                <span id="game-language" className="play-language-value">
                  {languageName}
                </span>
              )}
            </div>
            <p className="play-small">{view.me.isHost ? t("language.hostHint") : t("language.guestHint", { host: firstName(view.host.name) })}</p>
          </div>
        )}

        <div className="play-action" aria-live="polite">
          {!me.joined ? (
            <>
              <button type="button" className="btn btn-primary play-primary" onClick={onJoin} disabled={busy === "join"}>
                {busy === "join" ? t("actions.joining") : t("actions.join")}
              </button>
              <p className="play-small">{t("actions.joinNote")}</p>
            </>
          ) : !allJoined ? (
            <>
              <p className="play-waiting">
                <span className="play-pulse" aria-hidden="true" />
                {t("actions.waitingFor", { names: waitingList, count: waitingFor.length })}
              </p>
              <button type="button" className="btn btn-primary play-primary" disabled aria-disabled="true">
                {t("actions.start")}
              </button>
              <p className="play-small">{t("actions.keepOpen")}</p>
            </>
          ) : view.me.isHost ? (
            <>
              <p className="play-ready">{t("actions.allHereHost")}</p>
              <button type="button" className="btn btn-primary play-primary" onClick={onStart} disabled={busy === "start"}>
                {busy === "start" ? t("actions.starting") : t("actions.startIn", { language: languageName })}
              </button>
              <p className="play-small">{t("actions.callHint")}</p>
            </>
          ) : (
            <>
              <p className="play-ready">{t("actions.allHere")}</p>
              <p className="play-waiting">
                <span className="play-pulse" aria-hidden="true" />
                {t("actions.waitingForHost", { host: firstName(view.host?.name ?? "") })}
              </p>
              <p className="play-small">{t("actions.callHint")}</p>
            </>
          )}
          {error && (
            <p className="play-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>

      <section className="play-card play-how glass" aria-labelledby="play-how-title">
        <h2 id="play-how-title" className="play-subtitle">
          {t("how.title")}
        </h2>
        <ol>
          <li>{t("how.step1")}</li>
          <li>{t("how.step2", { min: eur(minPer) })}</li>
          <li>{t("how.step3")}</li>
        </ol>
        <p className="play-small">{t("privacy")}</p>
      </section>
    </div>
  );
}
