"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatEurShort } from "@/app/lib/format";
import { computePoolSplit, isTeamSize } from "@/app/lib/cognitive-rewards-order";
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
/** Title ceremony (ms after the cards appear): one title card per player, in seat order. */
const TITLES = { first: 250, each: 400 } as const;
/** Card entrance delay; `--delay` lets the bars inside start growing when their card appears. */
const delay = (ms: number) => ({ animationDelay: `${ms}ms`, "--delay": `${ms}ms` }) as React.CSSProperties;

/**
 * End of the game. Everything above the personal card is the same for every
 * player (pool, titles, team averages, verdict); the personal card holds the
 * only amount this player ever sees, which is their own.
 */
export function Scorecard({ view, act }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult> }) {
  const t = useTranslations("play.scorecard");
  const tp = useTranslations("play");
  const locale = useLocale();
  const s = view.scorecard!;
  const eur = (n: number) => formatEurShort(n, locale);
  const [stage, setStage] = useState<"locked" | "open" | "settled">("locked");
  const [shown, setShown] = useState(0);
  const mine = s.mine;
  const split = isTeamSize(view.teamSize) ? computePoolSplit(view.teamSize, view.pool) : null;
  const seat = (id: string) => view.players.findIndex((x) => x.id === id);
  // Later cards wait for the last title card to land.
  const after = TITLES.first + s.team.length * TITLES.each;

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
          <section className="play-card glass-strong cascade" aria-labelledby="titles-title">
            <p className="play-eyebrow">{t("teamEyebrow")}</p>
            <h2 id="titles-title" className="play-subtitle">
              {t("titlesTitle")}
            </h2>
            <p className="play-small titles-note">{t("titlesNote")}</p>
            <ul className={`title-grid n-${s.team.length}`}>
              {s.team.map((p, i) => (
                <li key={p.id} className={`title-card ${p.id === view.me.id ? "me" : ""}`} style={delay(TITLES.first + i * TITLES.each)}>
                  <span className="title-who">
                    <span className="play-avatar small" style={avatarStyle(seat(p.id))} aria-hidden="true">
                      {initials(p.name)}
                    </span>
                    <span className="title-player">{firstName(p.name)}</span>
                    {p.id === view.me.id && <span className="title-you">{t("you")}</span>}
                  </span>
                  {p.title && (
                    <>
                      <Medal kind={p.title} size={56}>
                        <BadgeIcon kind={p.title} size={22} />
                      </Medal>
                      <span className="title-label">{t(`highlights.${p.title}`)}</span>
                      <span className="title-desc">{t(`titleNotes.${p.title}`)}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="play-card glass-strong cascade" style={delay(after)} aria-labelledby="profile-title">
            <h2 id="profile-title" className="play-subtitle">
              {t("profileTitle")}
            </h2>
            <p className="play-small profile-note">{t("profileNote")}</p>
            <dl className="profile">
              {COMPONENTS.map((c) => (
                <div key={c} className="profile-row">
                  <dt>{t(`components.${c}`)}</dt>
                  <dd>
                    <span className="profile-bar" aria-hidden="true">
                      <span className="profile-fill team" style={{ width: `${s.teamAverage[c]}%` }} />
                    </span>
                    <span className="profile-value">{Math.round(s.teamAverage[c])}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {mine && (
            <section className="play-card glass-strong share-card cascade" style={delay(after + 200)} aria-labelledby="share-title">
              <p className="play-eyebrow private-eyebrow">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </svg>
                {t("privateEyebrow")}
              </p>
              <h2 id="share-title" className="play-subtitle">
                {t("yourShareEyebrow")}
              </h2>
              <p className="share-amount">{eur(mine.shareEur)}</p>
              {split && (
                <dl className="share-split">
                  <div>
                    <dt>{t("shareMinimum")}</dt>
                    <dd>{eur(split.minPerPlayer)}</dd>
                  </div>
                  <div>
                    <dt>{t("sharePerformance")}</dt>
                    <dd>{eur(Math.max(0, mine.shareEur - split.minPerPlayer))}</dd>
                  </div>
                </dl>
              )}
              <p className="play-small">{t("shareNote")}</p>

              {mine.title && (
                <div className="my-title">
                  <Medal kind={mine.title} size={48}>
                    <BadgeIcon kind={mine.title} size={20} />
                  </Medal>
                  <p>
                    <span className="my-title-eyebrow">{t("yourTitle")}</span>
                    <span className="title-label">{t(`highlights.${mine.title}`)}</span>
                    <span className="title-desc">{t(`titleNotes.${mine.title}`)}</span>
                  </p>
                </div>
              )}

              <h3 className="play-subtitle compare-title">{t("compareTitle")}</h3>
              <p className="profile-legend" aria-hidden="true">
                <span className="legend-you">{t("legendYou")}</span>
                <span className="legend-team">{t("legendTeam")}</span>
              </p>
              <dl className="profile compare">
                {COMPONENTS.map((c) => (
                  <div key={c} className="profile-row">
                    <dt>{t(`components.${c}`)}</dt>
                    <dd>
                      <span className="profile-bar" aria-hidden="true">
                        <span className="profile-fill" style={{ width: `${mine.components[c]}%` }} />
                        <span className="profile-mark" style={{ left: `${s.teamAverage[c]}%` }} />
                      </span>
                      <span className="profile-value" aria-hidden="true">
                        {Math.round(mine.components[c])}
                        <span className="profile-team">{Math.round(s.teamAverage[c])}</span>
                      </span>
                      <span className="sr-only">{t("compareValue", { you: Math.round(mine.components[c]), team: Math.round(s.teamAverage[c]) })}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="play-small">{t("privacyNote")}</p>
              <PayoutForm view={view} act={act} />
            </section>
          )}

          {s.verdict && (
            <section className="play-card glass cascade" style={delay(after + 400)} aria-labelledby="verdict-title">
              <h2 id="verdict-title" className="play-subtitle">
                {t("verdictTitle")}
              </h2>
              <GameMasterSays>{s.verdict.verdict}</GameMasterSays>
              <p className="play-small">{t("verdictScore", { score: s.verdict.total })}</p>
            </section>
          )}

          <section className="play-card glass cascade" style={delay(after + 550)} aria-labelledby="outro-title">
            <h2 id="outro-title" className="sr-only">
              {tp("gameMaster")}
            </h2>
            {view.episode && (
              <p className="episode-wrap">
                <span className="episode-wrap-label">{t("episodeWrap", { world: view.episode.worldName, n: view.episode.number })}</span> {view.episode.title}
              </p>
            )}
            <GameMasterSays>{s.outro}</GameMasterSays>
            {view.episode?.teaser && (
              <p className="episode-teaser">{view.episode.teaser}</p>
            )}
            <p className="play-small">{t("thanks", { host: firstName(view.host?.name ?? "") })}</p>
          </section>
        </>
      )}
    </div>
  );
}
