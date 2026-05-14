"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Platform", href: "/#platform" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Research", href: "/#research" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLogoClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/") {
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
            aria-label="WelloWork home"
            style={{ display: "inline-flex" }}
          >
            <Logo size={28} />
          </Link>
          <nav
            aria-label="Primary"
            style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 20, flex: 1 }}
            className="nav-links"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
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
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="btn btn-glass signin-link"
            style={{ padding: "11px 18px", fontSize: 14 }}
          >
            Contact
          </Link>
          <Link
            href="/book-a-demo"
            className="btn btn-primary"
            style={{ padding: "11px 18px", fontSize: 14 }}
          >
            Book a demo
          </Link>
        </div>
      </div>
    </header>
  );
}
