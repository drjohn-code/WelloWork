"use client";

import { useEffect, useState } from "react";

type NavItem = { id: string; label: string };

const ITEMS: NavItem[] = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "cookies", label: "Cookie Policy" },
  { id: "data-processing", label: "Data Processing" },
];

export function LegalNav() {
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
      <nav className="legal-side-nav" aria-label="Legal sections (desktop)">
        <div className="legal-side-nav-label">On this page</div>
        <ul>
          {ITEMS.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => onClick(e, it.id)}
                className={`legal-side-nav-link ${active === it.id ? "is-active" : ""}`}
              >
                <span className="legal-side-nav-dot" aria-hidden="true" />
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="legal-mobile-tabs" aria-label="Legal sections (mobile)">
        <div className="legal-mobile-tabs-track">
          {ITEMS.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => onClick(e, it.id)}
              className={`legal-mobile-tab ${active === it.id ? "is-active" : ""}`}
            >
              {it.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
