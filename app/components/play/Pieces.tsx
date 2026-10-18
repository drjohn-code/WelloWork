"use client";

import { useTranslations } from "next-intl";
import type { Piece, TalkLabels } from "@/app/lib/game/types";
import { TILE_COLORS, parseCard } from "@/app/lib/game/visual";
import { CardArt, FaceArt, Tile } from "./TalkArt";

/** Renders a player's private piece. Data comes from the server; labels from the player's UI language. */
export function PieceView({ piece, labels }: { piece: Piece; labels?: TalkLabels | null }) {
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
    case "cards":
      return (
        <div className="piece piece-cards">
          <p className="piece-title">{t("hand", { n: piece.cards.length })}</p>
          <ul className="card-hand">
            {piece.cards.map((id) => {
              const c = parseCard(id);
              if (!c) return null;
              return (
                <li key={id} className="talk-card" aria-label={labels ? `${labels.cards[c.object]}, ${labels.colors[c.color]}` : undefined}>
                  <CardArt object={c.object} color={c.color} />
                </li>
              );
            })}
          </ul>
        </div>
      );
    case "witness":
      return (
        <div className="piece piece-witness">
          <p className="piece-title">{t("witness")}</p>
          <div className="witness-frame">
            <FaceArt face={{ [piece.feature]: piece.value }} only={piece.feature} size={112} />
          </div>
          <p className="play-small">{t("witnessNote")}</p>
        </div>
      );
    case "lineup":
      return (
        <div className="piece piece-lineup">
          <p className="piece-title">{t("lineup")}</p>
          <ol className="lineup">
            {piece.faces.map((f, i) => (
              <li key={i} className="lineup-face">
                <FaceArt face={f} size={72} />
                <span className="lineup-number">{i + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case "tiles":
      return (
        <div className="piece piece-tiles">
          <p className="piece-title">{t("tiles")}</p>
          {piece.rows.map((r) => (
            <div key={r.row} className="tile-row">
              <span className="tile-row-label">{t("row", { n: r.row })}</span>
              <span className="tile-row-cells" aria-label={labels ? r.tiles.map((v) => (v ? labels.colors[TILE_COLORS[v - 1]] : labels.emptyTile)).join(", ") : undefined}>
                {r.tiles.map((v, i) => (
                  <Tile key={i} value={v} colors={TILE_COLORS} />
                ))}
              </span>
            </div>
          ))}
        </div>
      );
    case "canvas":
      return null; // the solver's empty grid is the answer control (TalkAnswer)
    case "none":
      return null;
  }
}
