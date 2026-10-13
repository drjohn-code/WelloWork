"use client";

import { useTranslations } from "next-intl";
import type { GameView } from "@/app/lib/game/types";
import { avatarStyle, initials } from "./usePlay";

/** Compact strip at the top of every game phase: who's here, who's solving, where we are. */
export function TeamBar({ view, solverId, label, progress, sound }: { view: GameView; solverId?: string | null; label?: string; progress?: { current: number; total: number }; sound?: { enabled: boolean; toggle: () => void } }) {
  const t = useTranslations("play.team");
  const ts = useTranslations("play.sound");
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
      <div className="teambar-right">
        {progress && (
          <ol className="floor-map" aria-hidden="true">
            {Array.from({ length: progress.total }, (_, i) => (
              <li key={i} className={`door ${i < progress.current ? "done" : i === progress.current ? "current" : ""}`}>
                <span className="door-leaf" />
              </li>
            ))}
          </ol>
        )}
        {label && <p className="teambar-label">{progress ? <span className="level-chip">{label}</span> : label}</p>}
        {sound && (
          <button type="button" className={`sound-toggle ${sound.enabled ? "on" : ""}`} onClick={sound.toggle} aria-pressed={sound.enabled} aria-label={sound.enabled ? ts("on") : ts("off")} title={sound.enabled ? ts("on") : ts("off")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10v4h4l5 4V6l-5 4z" />
              {sound.enabled ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /> : <path d="m17 9 4 6M21 9l-4 6" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
