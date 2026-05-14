import Link from "next/link";
import type { Crumb } from "../lib/site";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={c.href} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {last ? (
              <span aria-current="page">{c.name}</span>
            ) : (
              <Link href={c.href}>{c.name}</Link>
            )}
            {!last && <span className="crumb-sep" aria-hidden="true">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
