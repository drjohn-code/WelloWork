"use client";

import { useTranslations } from "next-intl";
import type { Piece } from "@/app/lib/game/types";

/** Renders a player's private piece. Data comes from the server; labels from the player's UI language. */
export function PieceView({ piece }: { piece: Piece }) {
  const t = useTranslations("play.round.pieces");
  switch (piece.kind) {
    case "calendar":
      return (
        <div className="piece piece-calendar">
          <p className="piece-title">{piece.owner}</p>
          <ul className="cal">
            {piece.hours.map((h) => {
              const busy = piece.busy.includes(h);
              return (
                <li key={h} className={busy ? "busy" : "free"}>
                  <span className="cal-hour">{String(h).padStart(2, "0")}:00</span>
                  <span className="cal-state">{busy ? t("busy") : t("free")}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    case "shelf":
      return (
        <div className="piece piece-shelf">
          <p className="piece-title">{piece.label}</p>
          <ul className="shelf">
            {piece.items.map((it, i) => (
              <li key={i} className={it.expired ? "expired" : ""}>
                <span className="shelf-count">{it.count}×</span>
                <span className="shelf-name">{it.name}</span>
                {it.expired && <span className="shelf-badge">{t("expired")}</span>}
              </li>
            ))}
          </ul>
        </div>
      );
    case "messages":
      return (
        <div className="piece piece-messages">
          <p className="piece-title">{t("yourMessages", { n: piece.items.length })}</p>
          <ul className="thread">
            {piece.items.map((m, i) => (
              <li key={i}>
                <div className="thread-meta">
                  <span className="thread-from">{m.from}</span>
                  <span className="thread-time">{m.time}</span>
                </div>
                <p className="thread-text">{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    case "rule":
      return (
        <div className="piece piece-rule">
          <p className="piece-title">{t("rule", { n: piece.order })}</p>
          <p className="rule-text">{piece.text}</p>
        </div>
      );
    case "clue":
      return (
        <div className="piece piece-clue">
          <p className="piece-title">{t("clue", { n: piece.texts.length })}</p>
          {piece.texts.map((text, i) => (
            <p key={i} className="rule-text clue-text">
              {text}
            </p>
          ))}
        </div>
      );
    case "none":
      return null;
  }
}
