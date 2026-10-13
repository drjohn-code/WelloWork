import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Crumb } from "../lib/site";

export function Breadcrumbs({ items, separator = "/" }: { items: Crumb[]; separator?: string }) {
  const t = useTranslations("common");
  return (
    <nav aria-label={t("breadcrumb.aria")} className="crumbs">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={c.href} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {last ? (
              <span aria-current="page">{c.name}</span>
            ) : (
              <Link href={c.href}>{c.name}</Link>
            )}
            {!last && <span className="crumb-sep" aria-hidden="true">{separator}</span>}
          </span>
        );
      })}
    </nav>
  );
}
