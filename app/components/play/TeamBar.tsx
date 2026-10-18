"use client";

import { useTranslations } from "next-intl";
import type { GameView } from "@/app/lib/game/types";
import { avatarStyle, initials } from "./usePlay";

/** Compact strip at the top of every game phase: who's here, who's solving, which step. Rounds add the RoundHud below it. */
export function TeamBar({ view, solverId, label }: { view: GameView; solverId?: string | null; label?: string }) {
  const t = useTranslations("play.team");
  return (
    <div className="teambar" aria-label={t("aria")}>
      <ul className="teambar-players">
        {view.players.map((p, i) => (
          <li key={p.id} className={`teambar-player ${p.online ? "online" : "offline"} ${p.id === solverId ? "solving" : ""} ${p.id === view.me.id ? "me" : ""}`}>
            <span className="teambar-avatar" style={avatarStyle(i)} aria-hidden="true">
              {initials(p.name)}
            </span>
            <span className="teambar-name">{p.name.split(/\s+/)[0]}</span>
            {p.isHost && <span className="teambar-tag">{t("host")}</span>}
            {p.id === solverId && <span className="teambar-tag solving">{t("solving")}</span>}
            <span className="sr-only">{p.online ? t("online") : t("offline")}</span>
          </li>
        ))}
      </ul>
      {label && (
        <div className="teambar-right">
          <p className="teambar-label">{label}</p>
        </div>
      )}
    </div>
  );
}
