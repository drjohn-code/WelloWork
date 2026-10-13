"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { GameView } from "@/app/lib/game/types";
import { GameMasterSays } from "./GameMaster";
import { TeamBar } from "./TeamBar";
import { firstName, type ActResult } from "./usePlay";
import { Scene } from "./PlayArt";

export function Briefing({ view, act }: { view: GameView; act: (b: { action: string } & Record<string, unknown>) => Promise<ActResult> }) {
  const t = useTranslations("play.briefing");
  const tp = useTranslations("play");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function begin() {
    setBusy(true);
    setError(null);
    const res = await act({ action: "begin" });
    if (!res.ok) setError(tp("errors.generic"));
    setBusy(false);
  }

  return (
    <div className="play-stack">
      <TeamBar view={view} label={t("stepLabel")} />
      <section className="play-card glass-strong scene-card" aria-labelledby="briefing-title">
        <Scene kind="briefing" />
        <p className="play-eyebrow">{tp("eyebrow")}</p>
        <h1 id="briefing-title" className="play-title">
          {t("title")}
        </h1>
        <GameMasterSays>{view.briefing!.text}</GameMasterSays>
        <h2 className="play-subtitle" style={{ marginTop: 24 }}>
          {t("rulesTitle")}
        </h2>
        <ol className="play-rules">
          <li>{t("rule1")}</li>
          <li>{t("rule2")}</li>
          <li>{t("rule3")}</li>
        </ol>
        <div className="play-action">
          {view.me.isHost ? (
            <>
              <button type="button" className="btn btn-primary play-primary" onClick={begin} disabled={busy}>
                {busy ? t("beginning") : t("begin")}
              </button>
              <p className="play-small">{t("hostNote")}</p>
            </>
          ) : (
            <p className="play-waiting">
              <span className="play-pulse" aria-hidden="true" />
              {t("waitingHost", { host: firstName(view.host?.name ?? "") })}
            </p>
          )}
          {error && (
            <p className="play-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
