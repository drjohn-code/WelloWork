"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { GameView } from "@/app/lib/game/types";
import { usePlay } from "./usePlay";
import { useSound } from "./useSound";
import { RoundIntro } from "./RoundIntro";
import { Lobby } from "./Lobby";
import { Intake } from "./Intake";
import { Briefing } from "./Briefing";
import { Round } from "./Round";
import { Challenge } from "./Challenge";
import { KeyCeremony } from "./KeyCeremony";
import { Scorecard } from "./Scorecard";
import { TeamBar } from "./TeamBar";
import { Scene } from "./PlayArt";

/** Phase router for a player. The lobby lives at /play/<token>, everything else at /play/<token>/game. */
export function PlayClient({ token, initial, page }: { token: string; initial: GameView; page: "lobby" | "game" }) {
  const t = useTranslations("play");
  const router = useRouter();
  const { view, invalid, offline, act, join } = usePlay(token, initial);
  const sound = useSound();
  const [introFor, setIntroFor] = useState<number | null>(null);
  const seenRound = useRef<number>(-1);

  // Level-style title card + jingle whenever a new round becomes active; cues for the other beats.
  useEffect(() => {
    const idx = view.phase === "round" && view.round?.status === "active" ? view.round.index : null;
    if (idx !== null && idx !== seenRound.current) {
      seenRound.current = idx;
      const id = window.setTimeout(() => setIntroFor(idx), 0);
      sound.play("round");
      return () => window.clearTimeout(id);
    }
  }, [view.phase, view.round?.index, view.round?.status, sound]);
  const lastStatus = useRef<string | null>(null);
  useEffect(() => {
    const status = view.round ? `${view.round.index}:${view.round.status}` : null;
    if (status && status !== lastStatus.current && lastStatus.current !== null) {
      if (view.round?.status === "solved") sound.play("correct");
      if (view.round?.status === "failed") sound.play("stamp");
    }
    lastStatus.current = status;
  }, [view.round, sound]);
  const lastPhase = useRef(view.phase);
  useEffect(() => {
    if (view.phase !== lastPhase.current) {
      if (view.phase === "scorecard") sound.play("unlock");
      lastPhase.current = view.phase;
    }
  }, [view.phase, sound]);

  // Keep the URL in step with the phase (the host's Start moves everyone).
  useEffect(() => {
    if (view.phase === "lobby" && page === "game") router.replace(`/play/${token}`);
    if (view.phase !== "lobby" && page === "lobby") router.replace(`/play/${token}/game`);
  }, [view.phase, page, router, token]);

  if (invalid) {
    return (
      <section className="play-card glass-strong">
        <h1 className="play-title">{t("invalid.title")}</h1>
        <p className="play-intro">{t("invalid.body")}</p>
      </section>
    );
  }

  if (view.finished) {
    return (
      <section className="play-card glass-strong play-finished">
        <p className="play-eyebrow">{t("eyebrow")}</p>
        <h1 className="play-title">{t("finished.title")}</h1>
        <p className="play-intro">{t("finished.body")}</p>
      </section>
    );
  }

  let body: React.ReactNode;
  switch (view.phase) {
    case "lobby":
      body = <Lobby view={view} act={act} join={join} sound={sound} />;
      break;
    case "intake":
      body = <Intake view={view} act={act} />;
      break;
    case "generating":
      body = <Waiting view={view} title={t("generating.title")} text={t("generating.body")} />;
      break;
    case "briefing":
      body = <Briefing view={view} act={act} />;
      break;
    case "round":
      // Keyed by round so input state resets when the next round starts.
      body = view.round ? <Round key={view.round.index} view={view} act={act} sound={sound} /> : <Waiting view={view} title={t("loading")} text="" />;
      break;
    case "challenge":
    case "judging":
      body = <Challenge view={view} act={act} />;
      break;
    case "key":
      body = <KeyCeremony view={view} act={act} />;
      break;
    case "scorecard":
    case "done":
      body = view.scorecard ? <Scorecard view={view} act={act} /> : <Waiting view={view} title={t("loading")} text="" />;
      break;
  }

  return (
    <>
      {offline && (
        <p className="play-offline" role="status">
          {t("offline")}
        </p>
      )}
      {introFor !== null && view.round && view.round.index === introFor && (
        <RoundIntro index={view.round.index} title={view.round.title} template={view.round.template} onDone={() => setIntroFor(null)} />
      )}
      {/* Keyed by phase so each step enters with a short fade/slide; the phase class tints the page. */}
      <div key={view.phase} className={`phase-enter phase-${view.phase}`}>
        {body}
      </div>
    </>
  );
}

function Waiting({ view, title, text }: { view: GameView; title: string; text: string }) {
  return (
    <div className="play-stack">
      <TeamBar view={view} />
      <section className="play-card glass-strong play-waiting-card scene-card">
        <Scene kind="generating" />
        <span className="play-spinner" aria-hidden="true" />
        <h1 className="play-title">{title}</h1>
        {text && <p className="play-intro">{text}</p>}
      </section>
    </div>
  );
}
