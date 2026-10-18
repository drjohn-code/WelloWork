"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TemplateIcon } from "./PlayIcons";

/** Level-style title card shown for a moment when a round begins. */
export function RoundIntro({ index, title, template, twist, onDone }: { index: number; title: string; template: string; twist?: "flash" | "rush" | null; onDone: () => void }) {
  const t = useTranslations("play.round");
  const [phase, setPhase] = useState<"in" | "go" | "out">("in");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = window.setTimeout(() => setPhase("go"), reduced ? 300 : 1400);
    const b = window.setTimeout(() => setPhase("out"), reduced ? 600 : 2200);
    const c = window.setTimeout(onDone, reduced ? 700 : 2600);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      window.clearTimeout(c);
    };
  }, [onDone]);

  return (
    <div className={`round-intro ${phase}`} role="status" aria-live="polite">
      <div className="round-intro-card">
        <span className="round-intro-icon" aria-hidden="true">
          <TemplateIcon template={template} size={40} />
        </span>
        <p className="round-intro-level">{t("introLevel", { n: index + 1 })}</p>
        <h2 className="round-intro-title">{title}</h2>
        {twist && <p className={`round-intro-twist twist-${twist}`}>{t(`twistIntro.${twist}`)}</p>}
        <p className="round-intro-go">{phase === "in" ? t("introReady") : t("introGo")}</p>
      </div>
    </div>
  );
}
