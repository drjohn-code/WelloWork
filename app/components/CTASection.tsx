import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { ArrowRight } from "./Icons";

type CTASectionProps = {
  title: React.ReactNode;
  body?: React.ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CTASection({ title, body, primary, secondary }: CTASectionProps) {
  return (
    <section style={{ padding: "40px 0 80px" }}>
      <div className="container">
        <Reveal>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 32,
              padding: "56px 40px",
              background: `
                radial-gradient(40% 60% at 8% 30%, color-mix(in oklch, var(--accent) 35%, transparent) 0%, transparent 60%),
                radial-gradient(45% 70% at 95% 70%, color-mix(in oklch, var(--secondary-deep) 55%, transparent) 0%, transparent 65%),
                linear-gradient(135deg, #FBFCFE 0%, #EEF3FE 100%)
              `,
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 24px 80px rgba(15,29,69,0.10)",
              textAlign: "center",
            }}
          >
            <h2 className="h-section" style={{ margin: "0 auto 14px", maxWidth: "22ch", fontSize: "clamp(28px,3.6vw,44px)" }}>
              {title}
            </h2>
            {body && (
              <p className="lede" style={{ margin: "0 auto 28px", maxWidth: "56ch" }}>
                {body}
              </p>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={primary.href} className="btn btn-primary" style={{ background: "var(--navy)" }}>
                {primary.label} <ArrowRight size={14} />
              </Link>
              {secondary && (
                <Link href={secondary.href} className="btn btn-glass">
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
