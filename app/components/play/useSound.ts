"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tiny synthesized sound effects (no audio files): short tones built with the
 * Web Audio API. Off by default; the player's choice is remembered per browser.
 */

export type SoundName = "join" | "round" | "correct" | "wrong" | "stamp" | "unlock" | "coin";

const KEY = "wellowork:play-sound";

type Note = [freq: number, startMs: number, durMs: number, type?: OscillatorType, gain?: number];
const PATTERNS: Record<SoundName, Note[]> = {
  join: [[660, 0, 90], [880, 90, 140]],
  round: [[523, 0, 100], [659, 110, 100], [784, 220, 180]],
  correct: [[784, 0, 90], [988, 90, 90], [1319, 180, 220]],
  wrong: [[220, 0, 160, "square", 0.08], [180, 170, 220, "square", 0.08]],
  stamp: [[140, 0, 120, "square", 0.12]],
  unlock: [[392, 0, 120], [523, 120, 120], [659, 240, 120], [784, 360, 160], [1047, 520, 420]],
  coin: [[1568, 0, 70, "triangle"], [2093, 70, 160, "triangle"]],
};

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Read the saved preference after mount (deferred, so the SSR markup matches).
    const id = window.setTimeout(() => {
      try {
        setEnabled(window.localStorage.getItem(KEY) === "on");
      } catch {
        // storage unavailable
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        if (!ctxRef.current) ctxRef.current = new Ctx();
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        const t0 = ctx.currentTime;
        for (const [freq, start, dur, type = "sine", gain = 0.12] of PATTERNS[name]) {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = type;
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, t0 + start / 1000);
          g.gain.linearRampToValueAtTime(gain, t0 + start / 1000 + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + (start + dur) / 1000);
          osc.connect(g).connect(ctx.destination);
          osc.start(t0 + start / 1000);
          osc.stop(t0 + (start + dur) / 1000 + 0.02);
        }
      } catch {
        // audio not available
      }
    },
    [enabled]
  );

  const toggle = useCallback(() => {
    setEnabled((e) => {
      const next = !e;
      try {
        window.localStorage.setItem(KEY, next ? "on" : "off");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { enabled, toggle, play };
}
