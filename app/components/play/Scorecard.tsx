"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatEurShort } from "@/app/lib/format";
import type { GameView, ScoreComponents } from "@/app/lib/game/types";
import { GameMasterSays } from "./GameMaster";
import { TeamBar } from "./TeamBar";
import { PayoutForm } from "./PayoutForm";
import { BadgeIcon, Confetti } from "./PlayIcons";
import { Coins, Fireworks, Medal, Vault } from "./PlayArt";
import { avatarStyle, firstName, initials, type ActResult } from "./usePlay";

const COMPONENTS: Array<keyof ScoreComponents> = ["dataTransfer", "teamwork", "problemSolving", "focus", "memory"];
/** Ceremony beats (ms): lock opens → amount counts up → confetti → cards cascade in. */
const BEAT = { unlock: 500, count: 1900, settle: 3200 } as const;

export function Scorecard({ view, act }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult> }) {
  const t = useTranslations("play.scorecard");
  const tp = useTranslations("play");
  const locale = useLocale();
  const s = view.scorecard!;
  const eur = (n: number) => formatEurShort(n, locale);
  const [stage, setStage] = useState<"locked" | "open" | "settled">("locked");
  const [shown, setShown] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const mine = s.players.find((p) => p.id === view.me.id);
  const podium = s.players.slice(0, 3);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = window.setTimeout(() => {
        setShown(view.pool);
        setStage("settled");
      }, 0);
      return () => window.clearTimeout(id);
    }
    const timers: number[] = [];
    let raf = 0;
    timers.push(
      window.setTimeout(() => {
        setStage("open");
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / BEAT.count);
          setShown(Math.round(view.pool * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, BEAT.unlock)
    );
    timers.push(window.setTimeout(() => setStage("settled"), BEAT.settle));
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
    };
  }, [view.pool]);

  const settled = stage === "settled";

  return (
    <div className="play-stack">
      <TeamBar view={view} label={t("stepLabel")} />

      <section className={`play-card glass-strong unlock stage-${stage}`} aria-labelledby="unlock-title">
        {stage !== "locked" && <Confetti />}
        {stage !== "locked" && <Coins />}
        {stage !== "locked" && <Fireworks />}
        {stage === "open" && <span className="flash" aria-hidden="true" />}
        <span className="spotlight l" aria-hidden="true" />
        <span className="spotlight r" aria-hidden="true" />
        <Vault open={stage !== "locked"} />
        <p className="play-eyebrow">{t("unlockedEyebrow")}</p>
        <h1 id="unlock-title" className="play-title">
          {t("unlockedTitle")}
        </h1>
        <p className={`unlock-amount ${stage === "open" ? "rolling" : ""}`} aria-live="polite">
          {eur(shown)}
        </p>
        <p className="play-small">{t("unlockedNote", { n: view.teamSize })}</p>
      </section>

      {settled && (
        <>
          <section className="play-card glass-strong podium-card cascade" style={{ animationDelay: "0ms" }} aria-labelledby="podium-title">
            <h2 id="podium-title" className="play-subtitle">
              {t("podiumTitle")}
            </h2>
            <ol className="podium">
              {[podium[1], podium[0], podium[2]].filter(Boolean).map((p) => (
                <li key={p.id} className={`podium-place place-${p.rank} ${p.id === view.me.id ? "me" : ""}`} style={{ animationDelay: `${p.rank * 180}ms` }}>
                  {p.rank === 1 && <span className="podium-crown" aria-hidden="true" />}
                  <span className="podium-avatar" style={avatarStyle(view.players.findIndex((x) => x.id === p.id))} aria-hidden="true">
                    {initials(p.name)}
                  </span>
                  <span className="podium-name">{firstName(p.name)}</span>
                  <span className="podium-share">{eur(p.shareEur)}</span>
                  <span className="podium-bar">
                    <span className="podium-rank" aria-hidden="true">
                      {p.rank}
                    </span>
                  </span>
                  <span className="sr-only">{t("placeLabel", { rank: p.rank })}</span>
                </li>
              ))}
            </ol>
          </section>

          {mine && (
            <section className="play-card glass-strong share-card cascade" style={{ animationDelay: "250ms" }} aria-labelledby="share-title">
              <p className="play-eyebrow">{t("yourShareEyebrow")}</p>
              <h2 id="share-title" className="share-amount">
                {eur(mine.shareEur)}
              </h2>
              <p className="play-intro">{t("yourShareBody", { rank: mine.rank, total: view.teamSize })}</p>
              {mine.highlights.length > 0 && (
                <ul className="medals">
                  {mine.highlights.map((h, i) => (
                    <li key={h} className="medal-item pop" style={{ animationDelay: `${600 + i * 200}ms` }}>
                      <Medal kind={h} size={64}>
                        <BadgeIcon kind={h} size={24} />
                      </Medal>
                      <span className="medal-label">{t(`highlights.${h}` as "highlights.helper")}</span>
                    </li>
                  ))}
                </ul>
              )}
              <PayoutForm view={view} act={act} />
            </section>
          )}

          <section className="play-card glass-strong cascade" style={{ animationDelay: "450ms" }} aria-labelledby="board-title">
            <h2 id="board-title" className="play-subtitle">
              {t("boardTitle")}
            </h2>
            <p className="play-small" style={{ marginTop: 4, marginBottom: 16 }}>
              {t("boardNote")}
            </p>
            <ol className="score-list">
              {s.players.map((p) => (
                <li key={p.id} className={`score-row ${p.id === view.me.id ? "me" : ""}`}>
                  <button type="button" className="score-row-main" aria-expanded={expanded === p.id} onClick={() => setExpanded((e) => (e === p.id ? null : p.id))}>
                    <span className={`score-rank rank-${p.rank}`} aria-hidden="true">
                      {p.rank}
                    </span>
                    <span className="play-avatar small" style={avatarStyle(view.players.findIndex((x) => x.id === p.id))} aria-hidden="true">
                      {initials(p.name)}
                    </span>
                    <span className="score-name">
                      {p.name}
                      {p.highlights.length > 0 && (
                        <span className="score-badges">
                          {p.highlights.map((h) => (
                            <span key={h} className={`badge small badge-${h}`}>
                              <BadgeIcon kind={h} size={13} />
                              {t(`highlights.${h}` as "highlights.helper")}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                    <span className="score-share">{eur(p.shareEur)}</span>
                  </button>
                  {expanded === p.id && (
                    <dl className="score-components">
                      {COMPONENTS.map((c) => (
                        <div key={c}>
                          <dt>{t(`components.${c}`)}</dt>
                          <dd>
                            <span className="score-bar" aria-hidden="true">
                              <span style={{ width: `${p.components[c]}%` }} />
                            </span>
                            <span className="score-value">{Math.round(p.components[c])}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {s.verdict && (
            <section className="play-card glass cascade" style={{ animationDelay: "600ms" }} aria-labelledby="verdict-title">
              <h2 id="verdict-title" className="play-subtitle">
                {t("verdictTitle")}
              </h2>
              <GameMasterSays>{s.verdict.verdict}</GameMasterSays>
              <p className="play-small">{t("verdictScore", { score: s.verdict.total })}</p>
            </section>
          )}

          <section className="play-card glass cascade" style={{ animationDelay: "750ms" }} aria-labelledby="outro-title">
            <h2 id="outro-title" className="sr-only">
              {tp("gameMaster")}
            </h2>
            <GameMasterSays>{s.outro}</GameMasterSays>
            <p className="play-small">{t("thanks", { host: firstName(view.host?.name ?? "") })}</p>
          </section>
        </>
      )}
    </div>
  );
}
