import { getTranslations } from "next-intl/server";
import { ORG_EMAIL } from "@/app/lib/site";

export async function InvalidLink() {
  const t = await getTranslations("play.invalid");
  return (
    <section className="play-card glass-strong" aria-labelledby="play-invalid-title">
      <h1 id="play-invalid-title" className="play-title">
        {t("title")}
      </h1>
      <p className="play-intro">{t("body")}</p>
      <p className="play-small">
        {t.rich("help", {
          email: ORG_EMAIL,
          link: (chunks) => <a href={`mailto:${ORG_EMAIL}`}>{chunks}</a>,
        })}
      </p>
    </section>
  );
}
