import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { JsonLd } from "../components/JsonLd";
import { LeadForm } from "../components/LeadForm";
import {
  buildMetadata,
  breadcrumbList,
  organizationSchema,
  ORG_EMAIL,
  ORG_PHONE,
  ORG_PHONE_TEL,
  ORG_CITY,
  ORG_COUNTRY,
} from "../lib/site";
import { Icon } from "../components/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Contact WelloWork — talk to sales, support, or partnerships",
  description:
    "Get in touch with the WelloWork team in Uppsala, Sweden. Email info@wellowork.net or call +46 760 28 1272 for sales, partnerships, or general enquiries.",
  path: "/contact",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export default function ContactPage() {
  const schema = [breadcrumbList(CRUMBS), organizationSchema()];

  return (
    <SiteShell>
      <JsonLd schema={schema} />
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to a real person —{" "}
            <span className="italic-serif" style={{ color: "var(--accent)" }}>
              in Uppsala.
            </span>
          </>
        }
        lede="Sales, partnerships, support, careers — every message reaches a small team in Sweden. Most enquiries get a reply within one working day."
        crumbs={CRUMBS}
      />

      <section style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 48,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, margin: "0 0 14px" }}>
                  How can I reach WelloWork?
                </h2>
                <div className="answer-block">
                  <strong>Email or phone is fastest.</strong> For demo requests, use the form on
                  this page or <a href="/book-a-demo">/book-a-demo</a>. For everything else —
                  partnerships, press, careers, support — write to{" "}
                  <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> or call{" "}
                  <a href={`tel:${ORG_PHONE_TEL}`}>{ORG_PHONE}</a> during EU business hours.
                </div>

                <div
                  style={{
                    marginTop: 28,
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 14,
                  }}
                >
                  <ContactRow icon="lock" label="Email" value={ORG_EMAIL} href={`mailto:${ORG_EMAIL}`} />
                  <ContactRow icon="bolt" label="Phone" value={ORG_PHONE} href={`tel:${ORG_PHONE_TEL}`} />
                  <ContactRow
                    icon="layers"
                    label="Office & service area"
                    value={`${ORG_CITY}, ${ORG_COUNTRY} · serving the EU, UK, and Nordics`}
                  />
                  <ContactRow
                    icon="calendar"
                    label="Hours"
                    value="Mon–Fri · 09:00–17:00 CET"
                  />
                </div>

                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, margin: "36px 0 14px" }}>
                  Where is WelloWork based?
                </h2>
                <p className="body" style={{ margin: 0, maxWidth: "56ch" }}>
                  WelloWork AB is registered in Sweden and operates out of Uppsala. All employee
                  data is stored inside the EU on infrastructure that complies with the GDPR. We
                  serve customers across the EU, the United Kingdom, and the Nordics.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <LeadForm
                endpoint="/api/contact-messages"
                submitLabel="Send message"
                successTitle="Message received."
                successBody="We’ll reply within one working day. For urgent matters please call the number on this page."
                messageRequired
                companyRequired={false}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="glass" style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, white), color-mix(in oklch, var(--secondary) 60%, white))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: "1px solid rgba(255,255,255,0.7)",
        }}
      >
        <Icon name={icon} size={18} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-3)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-1)" }}>{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} style={{ display: "block" }}>
      {content}
    </a>
  ) : (
    content
  );
}
