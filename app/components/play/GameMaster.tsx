import { useTranslations } from "next-intl";
import { GameMasterFace } from "./PlayArt";

/** The Game Master: a deadpan office owl with a speech bubble. */
export function GameMasterSays({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "success" | "fail" }) {
  const t = useTranslations("play");
  return (
    <figure className={`gm gm-${tone}`}>
      <span className="gm-char">
        <GameMasterFace size={52} mood={tone} />
      </span>
      <figcaption className="sr-only">{t("gameMaster")}</figcaption>
      <blockquote className="gm-bubble">{children}</blockquote>
    </figure>
  );
}
