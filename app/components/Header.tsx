"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";

const NAV_ITEMS: Array<{
  key: "platform" | "solutions" | "gameReward" | "pricing" | "research" | "about";
  href: string;
}> = [
  { key: "platform", href: "/#platform" },
  { key: "solutions", href: "/#solutions" },
  { key: "gameReward", href: "/cognitive-rewards" },
  { key: "pricing", href: "/#pricing" },
  { key: "research", href: "/#research" },
  { key: "about", href: "/about" },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLogoClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    // usePathname() is locale-prefix-stripped, so "/" means the home page in any locale.
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header style={{ position: "sticky", top: 16, zIndex: 50, padding: "0 16px", transition: "all .3s ease" }}>
      <div className="container" style={{ padding: 0 }}>
        <div
          className="glass"
          style={{
            padding: "12px 18px 12px 22px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: scrolled ? "rgba(255,255,255,0.82)" : "var(--glass-bg-strong)",
            backdropFilter: `blur(${scrolled ? "28px" : "20px"}) saturate(170%)`,
            WebkitBackdropFilter: `blur(${scrolled ? "28px" : "20px"}) saturate(170%)`,
            boxShadow: scrolled ? "0 6px 24px rgba(15,29,69,0.10)" : "var(--glass-shadow)",
            borderRadius: 100,
            transition: "all .3s ease",
          }}
        >
          <Link
            href="/"
            onClick={onLogoClick}
            aria-label={t("aria.logoHome")}
            style={{ display: "inline-flex" }}
          >
            <Logo size={28} />
          </Link>
          <nav
            aria-label={t("aria.primary")}
            style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 20, flex: 1 }}
            className="nav-links"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                style={{
                  padding: "8px 14px",
                  borderRadius: 100,
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: "var(--ink-2)",
                  transition: "background .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,29,69,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {t(`items.${item.key}`)}
              </Link>
            ))}
          </nav>
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="btn btn-glass signin-link"
            style={{ padding: "11px 18px", fontSize: 14 }}
          >
            {t("cta.contact")}
          </Link>
          <Link
            href="/book-a-demo"
            className="btn btn-primary"
            style={{ padding: "11px 18px", fontSize: 14 }}
          >
            {t("cta.bookDemo")}
          </Link>
        </div>
      </div>
    </header>
  );
}
