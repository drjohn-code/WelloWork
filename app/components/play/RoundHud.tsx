"use client";

import { useTranslations } from "next-intl";
import type { PathNode, RoundView } from "@/app/lib/game/types";
import { BoltIcon, CheckBurstIcon, FlameIcon, SpeakerIcon, StopwatchIcon, TemplateIcon } from "./PlayIcons";
import { usePulse } from "./usePlay";

export type SoundControls = { enabled: boolean; toggle: () => void };

/** Bar above the round card: level, the episode path, the team streak and the sound switch. */
export function RoundHud({ r, sound }: { r: RoundView; sound?: SoundControls }) {
  const t = useTranslations("play.hud");
  const tr = useTranslations("play.round");
  return (
    <div className="round-hud glass" role="group" aria-label={t("aria")}>
      <span className="level-chip round-hud-level">{tr("progress", { n: r.index + 1, total: r.total })}</span>
      <EpisodePath path={r.path} current={r.index} />
      <StreakFlame streak={r.streak} />
      {sound && <SoundToggle sound={sound} />}
    </div>
  );
}

type NodeState = "pending" | "current" | "solved" | "clean" | "failed";

function nodeState(node: PathNode, i: number, current: number): NodeState {
  if (node.status === "solved") return node.clean ? "clean" : "solved";
  if (node.status === "failed") return "failed";
  return i === current ? "current" : "pending";
}

/** One stop per round: upcoming ones show their round type, finished ones how they went. */
function EpisodePath({ path, current }: { path: PathNode[]; current: number }) {
  const t = useTranslations("play.hud");
  const tr = useTranslations("play.round");
  return (
    <ol className="ep-path" aria-label={t("path")}>
      {path.map((node, i) => {
        const state = nodeState(node, i, current);
        // Only the round that just ended animates its new state; earlier ones arrive settled.
        const just = i === current && (state === "solved" || state === "clean" || state === "failed");
        return (
          <li key={i} className={`ep-node is-${state}${just ? " just" : ""}`} aria-current={i === current ? "step" : undefined}>
            <span className="ep-stop" aria-hidden="true">
              <span className="ep-dot">{state === "solved" || state === "clean" ? <CheckBurstIcon size={14} /> : <TemplateIcon template={node.template} size={13} />}</span>
              {node.twist && <span className={`ep-twist twist-${node.twist}`}>{node.twist === "flash" ? <BoltIcon size={9} /> : <StopwatchIcon size={9} />}</span>}
            </span>
            <span className="sr-only">
              {t("round", { n: i + 1 })}: {t(`status.${state}`)}
              {node.twist ? `, ${t("twist", { name: tr(`twist.${node.twist}`) })}` : ""}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Solved rounds in a row. Pops with a "+1" when it goes up; grey at zero. */
function StreakFlame({ streak }: { streak: number }) {
  const t = useTranslations("play.hud");
  const popping = usePulse(streak, 1000);
  return (
    <span className={`streak ${streak > 0 ? "lit" : ""} ${popping ? "pop" : ""}`} role="img" aria-label={t("streak", { n: streak })} title={t("streak", { n: streak })}>
      <FlameIcon size={20} />
      <span className="streak-n">{streak}</span>
      {popping && (
        <span className="streak-plus" aria-hidden="true">
          +1
        </span>
      )}
    </span>
  );
}

function SoundToggle({ sound }: { sound: SoundControls }) {
  const t = useTranslations("play.sound");
  return (
    <button type="button" className={`sound-toggle round-hud-sound ${sound.enabled ? "on" : ""}`} onClick={sound.toggle} aria-pressed={sound.enabled} aria-label={t("label")} title={sound.enabled ? t("on") : t("off")}>
      <SpeakerIcon size={18} on={sound.enabled} />
    </button>
  );
}
