import { ORG_LEGAL_NAME, SITE_NAME, SITE_URL } from "../site";

/**
 * Shared transactional email layout. Table-based with inline styles so it
 * renders consistently in Gmail, Outlook (incl. Windows desktop), Apple Mail
 * and mobile clients. Every email built on it also ships a plain-text part.
 */

export const EMAIL_COLORS = {
  navy: "#162B5C",
  accent: "#5C73FB",
  ink1: "#1a1024",
  ink2: "#3b2c4a",
  ink3: "#6a5d77",
  page: "#F4F7FE",
  card: "#FFFFFF",
  tint: "#EEF3FC",
  line: "#E3E8F3",
} as const;

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif";

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function paragraph(html: string, opts: { muted?: boolean; size?: number; margin?: string } = {}): string {
  const color = opts.muted ? EMAIL_COLORS.ink3 : EMAIL_COLORS.ink2;
  return `<p style="margin:${opts.margin ?? "0 0 16px"};font-family:${FONT};font-size:${opts.size ?? 15}px;line-height:1.6;color:${color};">${html}</p>`;
}

export function heading(html: string): string {
  return `<h1 style="margin:0 0 16px;font-family:${FONT};font-size:24px;line-height:1.25;font-weight:700;letter-spacing:-0.01em;color:${EMAIL_COLORS.ink1};">${html}</h1>`;
}

export function subheading(text: string): string {
  return `<h2 style="margin:28px 0 12px;font-family:${FONT};font-size:15px;line-height:1.4;font-weight:700;color:${EMAIL_COLORS.ink1};">${esc(text)}</h2>`;
}

/** Bulletproof button: a padded table cell, so Outlook renders the full hit area. */
export function button(href: string, label: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px;">
  <tr>
    <td align="center" bgcolor="${EMAIL_COLORS.navy}" style="border-radius:12px;">
      <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 28px;font-family:${FONT};font-size:16px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:12px;">${esc(label)}</a>
    </td>
  </tr>
</table>`;
}

/** Label/value rows in a tinted box. */
export function factsBox(rows: Array<[string, string]>): string {
  const body = rows
    .map(
      ([label, value], i) => `
    <tr>
      <td style="padding:${i === 0 ? "0" : "10px"} 16px 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${EMAIL_COLORS.ink3};vertical-align:top;white-space:nowrap;">${esc(label)}</td>
      <td style="padding:${i === 0 ? "0" : "10px"} 0 0;font-family:${FONT};font-size:14px;line-height:1.5;font-weight:600;color:${EMAIL_COLORS.ink1};vertical-align:top;">${esc(value)}</td>
    </tr>`
    )
    .join("");
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 8px;background:${EMAIL_COLORS.tint};border-radius:12px;">
  <tr><td style="padding:16px 18px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">${body}</table>
  </td></tr>
</table>`;
}

/** Numbered steps with round badges. */
export function steps(items: string[]): string {
  const body = items
    .map(
      (text, i) => `
    <tr>
      <td width="34" style="padding:0 0 12px;vertical-align:top;">
        <div style="width:24px;height:24px;border-radius:12px;background:${EMAIL_COLORS.tint};color:${EMAIL_COLORS.navy};font-family:${FONT};font-size:12px;font-weight:700;line-height:24px;text-align:center;">${i + 1}</div>
      </td>
      <td style="padding:2px 0 12px;font-family:${FONT};font-size:14px;line-height:1.55;color:${EMAIL_COLORS.ink2};vertical-align:top;">${esc(text)}</td>
    </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0;">${body}</table>`;
}

export function divider(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td style="border-top:1px solid ${EMAIL_COLORS.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

type LayoutArgs = {
  lang: string;
  title: string;
  /** Inbox preview line (hidden in the body). */
  preheader: string;
  eyebrow: string;
  bodyHtml: string;
  /** Small print under the card: why they got it, who sent it. */
  footerHtml: string;
};

export function renderLayout({ lang, title, preheader, eyebrow, bodyHtml, footerHtml }: LayoutArgs): string {
  return `<!doctype html>
<html lang="${esc(lang)}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>${esc(title)}</title>
<style>
  @media only screen and (max-width: 620px) {
    .wrap { padding: 16px 8px !important; }
    .card { padding: 28px 20px !important; border-radius: 16px !important; }
  }
  a { color: ${EMAIL_COLORS.navy}; }
</style>
</head>
<body style="margin:0;padding:0;background:${EMAIL_COLORS.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EMAIL_COLORS.page};">
  <tr>
    <td align="center" class="wrap" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td style="padding:0 4px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:10px;"><img src="${SITE_URL}/logo.png" width="32" height="32" alt="" style="display:block;border:0;" /></td>
              <td style="vertical-align:middle;font-family:${FONT};font-size:18px;font-weight:700;letter-spacing:-0.02em;color:${EMAIL_COLORS.ink1};">${esc(SITE_NAME)}</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td class="card" style="background:${EMAIL_COLORS.card};border-radius:20px;padding:40px 40px 36px;border:1px solid ${EMAIL_COLORS.line};">
            <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${EMAIL_COLORS.accent};">${esc(eyebrow)}</p>
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 8px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${EMAIL_COLORS.ink3};text-align:center;">
            ${footerHtml}
            <p style="margin:12px 0 0;">${esc(ORG_LEGAL_NAME)} · Uppsala, Sweden</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
