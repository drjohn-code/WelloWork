"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Piece, TalkLabels } from "@/app/lib/game/types";
import { COLOR_HEX, TILE_COLORS, parseCard } from "@/app/lib/game/visual";
import { CardArt, FaceArt, Tile } from "./TalkArt";

/**
 * Answer controls for talk rounds. The solver answers with their own piece:
 * tap the shared card in their hand, tap a face in the line-up, or paint the
 * empty grid. The value sent is the same string the server hashed.
 */

type Submit = (answer: string) => void;

export function ChoiceAnswer({ piece, busy, wrong, attemptsLeft, labels, onSubmit }: { piece: Piece; busy: boolean; wrong: boolean; attemptsLeft: number; labels?: TalkLabels | null; onSubmit: Submit }) {
  const t = useTranslations("play.round.talk");
  const [picked, setPicked] = useState<string | null>(null);
  const options =
    piece.kind === "cards"
      ? piece.cards.map((id) => ({ value: id, node: cardNode(id), label: cardLabel(id, labels) }))
      : piece.kind === "lineup"
        ? piece.faces.map((f, i) => ({ value: String(i + 1), node: <FaceArt face={f} size={72} />, label: t("faceLabel", { n: i + 1 }) }))
        : [];
  return (
    <div className={`talk-answer ${wrong ? "shake" : ""}`}>
      <p className="round-piece-label">{piece.kind === "cards" ? t("pickCard") : t("pickFace")}</p>
      <ul className={piece.kind === "cards" ? "card-hand pickable" : "lineup pickable"} role="radiogroup" aria-label={piece.kind === "cards" ? t("pickCard") : t("pickFace")}>
        {options.map((o, i) => (
          <li key={o.value}>
            <button
              type="button"
              role="radio"
              aria-checked={picked === o.value}
              aria-label={o.label}
              className={`${piece.kind === "cards" ? "talk-card" : "lineup-face"} pick ${picked === o.value ? "picked" : ""}`}
              onClick={() => setPicked(o.value)}
            >
              {o.node}
              {piece.kind === "lineup" && <span className="lineup-number">{i + 1}</span>}
            </button>
          </li>
        ))}
      </ul>
      <div className="talk-answer-row">
        <button type="button" className="btn btn-primary play-primary" disabled={!picked || busy} onClick={() => picked && onSubmit(picked)}>
          {busy ? t("checking") : t("lockIn")}
        </button>
        <span className="order-hint">{t("attemptsLeft", { n: attemptsLeft })}</span>
      </div>
    </div>
  );
}

function cardNode(id: string) {
  const c = parseCard(id);
  return c ? <CardArt object={c.object} color={c.color} /> : null;
}
function cardLabel(id: string, labels?: TalkLabels | null) {
  const c = parseCard(id);
  if (!c) return id;
  return labels ? `${labels.cards[c.object]}, ${labels.colors[c.color]}` : id;
}

export function GridAnswer({ rows, cols, busy, wrong, attemptsLeft, labels, onSubmit }: { rows: number; cols: number; busy: boolean; wrong: boolean; attemptsLeft: number; labels?: TalkLabels | null; onSubmit: Submit }) {
  const t = useTranslations("play.round.talk");
  const [grid, setGrid] = useState<number[]>(() => Array(rows * cols).fill(0));
  const [brush, setBrush] = useState(1);
  const paint = (i: number) => setGrid((g) => g.map((v, j) => (j === i ? (v === brush ? 0 : brush) : v)));
  return (
    <div className={`talk-answer ${wrong ? "shake" : ""}`}>
      <p className="round-piece-label">{t("paintHelp")}</p>
      <div className="brushes" role="radiogroup" aria-label={t("brushes")}>
        {TILE_COLORS.map((c, i) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={brush === i + 1}
            aria-label={labels?.colors[c] ?? c}
            className={`brush ${brush === i + 1 ? "on" : ""}`}
            style={{ background: COLOR_HEX[c] }}
            onClick={() => setBrush(i + 1)}
          />
        ))}
        <button type="button" role="radio" aria-checked={brush === 0} className={`brush eraser ${brush === 0 ? "on" : ""}`} onClick={() => setBrush(0)}>
          {t("eraser")}
        </button>
      </div>
      <div className="canvas" style={{ gridTemplateColumns: `auto repeat(${cols}, auto)` }}>
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="canvas-row" style={{ display: "contents" }}>
            <span className="tile-row-label">{t("row", { n: r + 1 })}</span>
            {Array.from({ length: cols }, (_, c) => {
              const i = r * cols + c;
              const v = grid[i];
              return (
                <button
                  key={c}
                  type="button"
                  className="canvas-cell"
                  aria-label={`${t("row", { n: r + 1 })}, ${c + 1}: ${v ? (labels?.colors[TILE_COLORS[v - 1]] ?? TILE_COLORS[v - 1]) : (labels?.emptyTile ?? "")}`}
                  onClick={() => paint(i)}
                >
                  <Tile value={v} colors={TILE_COLORS} size={40} />
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="talk-answer-row">
        <button type="button" className="btn btn-primary play-primary" disabled={busy || grid.every((v) => v === 0)} onClick={() => onSubmit(grid.join(""))}>
          {busy ? t("checking") : t("sendGrid")}
        </button>
        <button type="button" className="btn btn-ghost round-tool" onClick={() => setGrid(Array(rows * cols).fill(0))}>
          {t("clear")}
        </button>
        <span className="order-hint">{t("attemptsLeft", { n: attemptsLeft })}</span>
      </div>
    </div>
  );
}
