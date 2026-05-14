import { Logo } from "./Logo";

const COLUMNS = [
  {
    h: "Platform",
    items: ["WelloRise [Education & Growth]]", "Wellowize [Assessment]", "Performance trends", "Workshops", "Bio Optimization"],
  },
  {
    h: "Solutions",
    items: ["HR & People", "Operations", "Learning & development", "Healthcare"],
  },
  {
    h: "Research",
    items: ["Methodology", "Science & insight", "Cognitive constructs", "Privacy by design"],
  },
  {
    h: "Company",
    items: ["About", "Careers", "Contact"],
  },
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
            <span style={{ color: "#ffffff" }}>
              <Logo />
            </span>
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
                {col.items.map((i, idx) => (
                  <li key={`${col.h}-${idx}`}>
                    <a href="#">{i}</a>
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
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
            <a href="#">Data processing</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
