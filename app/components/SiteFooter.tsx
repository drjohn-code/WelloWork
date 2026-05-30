import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

type FooterColumn = { key: "platform" | "research" | "company"; hrefs: string[] };

const COLUMNS: FooterColumn[] = [
  {
    key: "platform",
    hrefs: [
      "/platform/growth",
      "/platform/assessment",
      "/platform/measure",
      "/platform/workshops",
      "/platform/proactive-care",
    ],
  },
  {
    key: "research",
    hrefs: [
      "/research/methodology",
      "/research/science-insight",
      "/research/cognitive-constructs",
    ],
  },
  {
    key: "company",
    hrefs: ["/about", "/careers", "/contact"],
  },
];

const LEGAL_LINKS: { key: "privacy" | "terms" | "cookies" | "dataProcessing"; href: string }[] = [
  { key: "privacy", href: "/legal#privacy" },
  { key: "terms", href: "/legal#terms" },
  { key: "cookies", href: "/legal#cookies" },
  { key: "dataProcessing", href: "/legal#data-processing" },
];

const BADGES: ("gdpr" | "iso" | "soc" | "hipaa")[] = ["gdpr", "iso", "soc", "hipaa"];

export function SiteFooter() {
  const t = useTranslations("footer");
  return (
    <footer className="footer-wrap">
      <div className="container" style={{ position: "relative", padding: "64px 32px 32px" }}>
        <div
          className="ft-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          <div>
            <Link href="/" aria-label={t("aria.home")} style={{ display: "inline-block" }}>
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
              {t("tagline")}
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
                  {t(`badges.${b}`)}
                </span>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => {
            const labels = t.raw(`columns.${col.key}.items`) as string[];
            return (
              <div key={col.key} className="footer-col">
                <h4>{t(`columns.${col.key}.h`)}</h4>
                <ul>
                  {col.hrefs.map((href, idx) => (
                    <li key={href}>
                      <Link href={href}>{labels[idx]}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
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
          <span>{t("copyright")}</span>
          <div style={{ display: "flex", gap: 24 }}>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {t(`legal.${l.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
