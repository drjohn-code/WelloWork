"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const ITEMS = [
  { id: "privacy", labelKey: "nav.privacy" },
  { id: "terms", labelKey: "nav.terms" },
  { id: "cookies", labelKey: "nav.cookies" },
  { id: "data-processing", labelKey: "nav.dataProcessing" },
] as const;

export function LegalNav() {
  const t = useTranslations("legal");
  const [active, setActive] = useState<string>("privacy");

  useEffect(() => {
    const sections = ITEMS.map((it) => document.getElementById(it.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((el) => observer.observe(el));

    const hash = window.location.hash.replace("#", "");
    if (hash && ITEMS.some((it) => it.id === hash)) {
      setActive(hash);
    }

    return () => observer.disconnect();
  }, []);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className="legal-side-nav" aria-label={t("nav.desktopAria")}>
        <div className="legal-side-nav-label">{t("nav.onThisPage")}</div>
        <ul>
          {ITEMS.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => onClick(e, it.id)}
                className={`legal-side-nav-link ${active === it.id ? "is-active" : ""}`}
              >
                <span className="legal-side-nav-dot" aria-hidden="true" />
                {t(it.labelKey)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="legal-mobile-tabs" aria-label={t("nav.mobileAria")}>
        <div className="legal-mobile-tabs-track">
          {ITEMS.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => onClick(e, it.id)}
              className={`legal-mobile-tab ${active === it.id ? "is-active" : ""}`}
            >
              {t(it.labelKey)}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
