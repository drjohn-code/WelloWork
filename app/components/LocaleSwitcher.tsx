"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { enabledLocaleMetas } from "@/i18n/locales";

const COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

/** Persist the language choice so it is sticky across visits (functional cookie). */
function setLocaleCookie(code: string) {
  document.cookie = `${COOKIE}=${code}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/**
 * Toolbar language switcher (SEO_GUIDELINES §9: endonyms, no flags).
 * - Route-preserving: switches to the SAME page in the target locale via
 *   next-intl's locale-aware Link (real anchors → crawlable, right-clickable).
 * - WCAG 2.1 AA: keyboard operable (Enter/Space/Escape), visible focus,
 *   aria-haspopup/expanded, aria-current, and a per-option `lang`/`hrefLang`
 *   so assistive tech pronounces each endonym in its own language.
 * - Renders nothing when only one locale is enabled (nothing to switch to).
 */
export function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const locales = enabledLocaleMetas();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (locales.length < 2) return null;

  const current = locales.find((l) => l.code === activeLocale) ?? locales[0];

  return (
    <div className="locale-switcher" ref={ref}>
      <button
        type="button"
        className="locale-switcher__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t("label")}: ${current.englishName}. ${t("change")}`}
        onClick={() => setOpen((o) => !o)}
      >
        <GlobeIcon />
        <span lang={current.hreflang}>{current.endonym}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul className="locale-switcher__menu" role="menu" aria-label={t("menu")}>
          {locales.map((l) => {
            const isCurrent = l.code === activeLocale;
            return (
              <li key={l.code} role="none">
                <Link
                  href={pathname}
                  locale={l.code}
                  role="menuitem"
                  lang={l.hreflang}
                  hrefLang={l.hreflang}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`locale-switcher__item${isCurrent ? " is-current" : ""}`}
                  onClick={() => {
                    setLocaleCookie(l.code);
                    setOpen(false);
                  }}
                >
                  <span lang={l.hreflang}>{l.endonym}</span>
                  {isCurrent && <CheckIcon />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12l5 5L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
