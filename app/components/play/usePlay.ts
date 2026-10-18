"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameView } from "@/app/lib/game/types";

/**
 * Client state for a player: polls the personalised view, pauses while the
 * tab is hidden, and routes every action through one POST. Polling cadence
 * follows the phase (faster during rounds, slower while waiting on a model).
 */

export type ActionBody = Record<string, unknown> & { action: string };
export type ActResult = { ok: true; view: GameView; correct?: boolean } | { ok: false; code: string };

const POLL_MS: Partial<Record<GameView["phase"], number>> = {
  lobby: 3000,
  intake: 3000,
  generating: 4000,
  briefing: 3000,
  round: 2000,
  challenge: 2000,
  judging: 3000,
  key: 2000,
  scorecard: 8000,
  done: 15000,
};

export function usePlay(token: string, initial: GameView) {
  const [view, setView] = useState<GameView>(initial);
  const [invalid, setInvalid] = useState(false);
  const [offline, setOffline] = useState(false);
  const inFlight = useRef(false);
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/play/${encodeURIComponent(token)}`, { cache: "no-store" });
      if (res.status === 404) {
        setInvalid(true);
        return;
      }
      const data = (await res.json()) as { ok?: boolean; view?: GameView };
      if (data.ok && data.view) {
        setView(data.view);
        setOffline(false);
      }
    } catch {
      setOffline(true);
    } finally {
      inFlight.current = false;
    }
  }, [token]);

  useEffect(() => {
    if (invalid) return;
    let timer: number | undefined;
    const schedule = () => {
      const ms = POLL_MS[viewRef.current.phase] ?? 3000;
      timer = window.setTimeout(async () => {
        if (document.visibilityState === "visible") await refresh();
        schedule();
      }, ms);
    };
    schedule();
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [invalid, refresh]);

  const act = useCallback(
    async (body: ActionBody): Promise<ActResult> => {
      try {
        const res = await fetch(`/api/play/${encodeURIComponent(token)}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.status === 404) {
          setInvalid(true);
          return { ok: false, code: "NOT_FOUND" };
        }
        const data = (await res.json()) as { ok?: boolean; view?: GameView; code?: string; correct?: boolean };
        if (data.ok && data.view) {
          setView(data.view);
          return { ok: true, view: data.view, correct: data.correct };
        }
        return { ok: false, code: data.code ?? "REQUEST_FAILED" };
      } catch {
        return { ok: false, code: "NETWORK" };
      }
    },
    [token]
  );

  const join = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/play/${encodeURIComponent(token)}/join`, { method: "POST" });
      if (res.status === 404) {
        setInvalid(true);
        return false;
      }
      const data = (await res.json()) as { ok?: boolean; view?: GameView };
      if (data.ok && data.view) setView(data.view);
      return Boolean(data.ok);
    } catch {
      return false;
    }
  }, [token]);

  return { view, invalid, offline, refresh, act, join };
}

/** Seconds left until an ISO timestamp (server clock), re-rendering once a second. */
export function useCountdown(until: string | null | undefined, serverNow: string): number {
  // Server/client clock offset, refreshed whenever a new view arrives; read only in the ticker.
  const offsetRef = useRef(0);
  useEffect(() => {
    offsetRef.current = Date.parse(serverNow) - Date.now();
  }, [serverNow]);
  // "Now" on the server clock, ticking once a second.
  const [serverTick, setServerTick] = useState(() => Date.parse(serverNow));
  useEffect(() => {
    const id = window.setInterval(() => setServerTick(Date.now() + offsetRef.current), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (!until) return 0;
  return Math.max(0, Math.round((Date.parse(until) - serverTick) / 1000));
}

/**
 * True for `ms` after `count` goes up (a wrong attempt, a streak step), so a
 * reaction can play once. Going down, or the first render, does not trigger it.
 */
export function usePulse(count: number, ms: number): boolean {
  const [seen, setSeen] = useState(count);
  const [on, setOn] = useState(false);
  if (count !== seen) {
    setSeen(count);
    if (count > seen) setOn(true);
  }
  useEffect(() => {
    if (!on) return;
    const id = window.setTimeout(() => setOn(false), ms);
    return () => window.clearTimeout(id);
  }, [on, seen, ms]);
  return on;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

/** Inline gradient for a player's avatar, by seat index (stable for the whole game). */
export function avatarStyle(index: number): React.CSSProperties {
  const palette: Array<[string, string]> = [["#5C73FB", "#7C3AED"], ["#10B981", "#0f6b47"], ["#F2C94C", "#c47d00"], ["#F28B82", "#c0392b"], ["#162B5C", "#0E1D45"]];
  const [a, b] = palette[index % palette.length];
  return { background: `linear-gradient(145deg, ${a}, ${b})`, color: "white" };
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}
