"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { GameMasterFace, type GameMasterMood } from "./PlayArt";

const TYPE_MS = 600;

/**
 * The Game Master: a deadpan office owl with a speech bubble. Plain-text
 * speech types in over ~600 ms (instant under reduced motion); `mood` sets the
 * owl's face, `tone` the bubble colour. `paused` holds the typing back, for
 * example while the round's title card covers the screen.
 */
export function GameMasterSays({ children, tone = "default", mood, paused = false }: { children: React.ReactNode; tone?: "default" | "success" | "fail"; mood?: GameMasterMood; paused?: boolean }) {
  const t = useTranslations("play");
  const face = mood ?? tone;
  return (
    <figure className={`gm gm-${tone} gm-mood-${face}`}>
      <span className="gm-char">
        <GameMasterFace size={52} mood={face} />
      </span>
      <figcaption className="sr-only">{t("gameMaster")}</figcaption>
      <blockquote className="gm-bubble">{typeof children === "string" ? <TypedText key={children} text={children} paused={paused} /> : children}</blockquote>
    </figure>
  );
}

/**
 * Reveals `text` a few characters per frame. The full text is laid out from
 * the start (the untyped rest is invisible), so the bubble never grows and
 * nothing below it jumps. Screen readers get the whole sentence once.
 */
function TypedText({ text, paused }: { text: string; paused: boolean }) {
  const [shown, setShown] = useState(0);
  // Where to resume after a pause; read in the effect, so it must not be state.
  const shownRef = useRef(0);
  const done = shown >= text.length;

  useEffect(() => {
    if (paused || shownRef.current >= text.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = shownRef.current;
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const next = reduced ? text.length : Math.min(text.length, from + Math.ceil(((now - start) / TYPE_MS) * text.length));
      shownRef.current = next;
      setShown(next);
      if (next < text.length) frame = window.requestAnimationFrame(tick);
    };
    // A short beat first, so a title card that opens on the same tick can pause it before anything shows.
    const delay = window.setTimeout(() => (frame = window.requestAnimationFrame(tick)), 120);
    return () => {
      window.clearTimeout(delay);
      window.cancelAnimationFrame(frame);
    };
  }, [paused, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={done ? undefined : "gm-typing"}>
        {text.slice(0, shown)}
        <span className="gm-untyped">{text.slice(shown)}</span>
      </span>
    </>
  );
}
