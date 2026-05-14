import Link from "next/link";
import { Logo } from "./Logo";

type FooterLink = { label: string; href: string };
type FooterColumn = { h: string; items: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    h: "Platform",
    items: [
      { label: "WelloRise [Growth]", href: "/platform/growth" },
      { label: "Wellowize [Assessment]", href: "/platform/assessment" },
      { label: "Performance trends", href: "/platform/measure" },
      { label: "Workshops", href: "/platform/workshops" },
      { label: "Proactive Care", href: "/platform/proactive-care" },
    ],
  },
  {
    h: "Solutions",
    items: [
      { label: "HR & People", href: "/solutions/hr-people" },
      { label: "Operations", href: "/solutions/operations" },
      { label: "Learning & development", href: "/solutions/learning-development" },
      { label: "Healthcare", href: "/solutions/healthcare" },
    ],
  },
  {
    h: "Research",
    items: [
      { label: "Methodology", href: "/research/methodology" },
      { label: "Science & insight", href: "/research/science-insight" },
      { label: "Cognitive constructs", href: "/research/cognitive-constructs" },
      { label: "Privacy by design", href: "/research/privacy-by-design" },
    ],
  },
  {
    h: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Data processing", href: "/legal/data-processing" },
];

const BADGES = ["GDPR-native", "ISO 27001", "SOC Type II", "HIPAA-ready"];

export function SiteFooter() {
  return (
    <footer className="footer-wrap">
      <div className="container" style={{ position: "relative", padding: "64px 32px 32px" }}>
        <div
          className="ft-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          <div>
            <Link href="/" aria-label="WelloWork home" style={{ display: "inline-block" }}>
              <Logo textColor="white" />
            </Link>

            <p
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                maxWidth: "34ch",
                lineHeight: 1.55,
              }}
            >
              The workplace performance platform. Daily cognitive training, longitudinal trends, and
              biomarker-based health insights, built in Sweden.
            </p>
            <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {BADGES.map((b) => (
                <span
                  key={b}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.h} className="footer-col">
              <h4>{col.h}</h4>
              <ul>
                {col.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href}>{i.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.10)", marginBottom: 24 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            color: "rgba(255,255,255,0.55)",
            fontSize: 13,
          }}
        >
          <span>© 2024-2026 WelloWork AB · Uppsala, Sweden</span>
          <div style={{ display: "flex", gap: 24 }}>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
