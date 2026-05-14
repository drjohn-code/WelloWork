import { Resend } from "resend";
import { ORG_EMAIL, SITE_NAME } from "./site";

let cached: Resend | null = null;

function client(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

const FROM =
  process.env.RESEND_FROM_EMAIL?.trim() ||
  `${SITE_NAME} <noreply@wellowork.net>`;

const REPLY_TO = process.env.RESEND_REPLY_TO?.trim() || ORG_EMAIL;

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#6a5d77;font-size:13px;vertical-align:top;">${esc(
    label
  )}</td><td style="padding:6px 0;color:#1a1024;font-size:14px;">${esc(value)}</td></tr>`;
}

function plainRow(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `${label}: ${value}\n`;
}

type NotifyContactArgs = {
  name: string;
  workEmail: string;
  company?: string | null;
  companySize?: string | null;
  role?: string | null;
  industry?: string | null;
  message: string;
};

export async function sendContactNotification(args: NotifyContactArgs): Promise<void> {
  const r = client();
  if (!r) return;

  const subject = `New contact message from ${args.name}${
    args.company ? ` (${args.company})` : ""
  }`;

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#1a1024;">
    <h2 style="margin:0 0 12px;font-size:18px;color:#162B5C;">New contact form submission</h2>
    <table style="border-collapse:collapse;">
      ${row("Name", args.name)}
      ${row("Work email", args.workEmail)}
      ${row("Company", args.company || null)}
      ${row("Company size", args.companySize || null)}
      ${row("Role", args.role || null)}
      ${row("Industry", args.industry || null)}
    </table>
    <h3 style="margin:18px 0 6px;font-size:14px;color:#162B5C;">Message</h3>
    <div style="white-space:pre-wrap;background:#F4F7FE;padding:14px 16px;border-radius:10px;font-size:14px;line-height:1.55;">${esc(
      args.message
    )}</div>
  </div>`;

  const text =
    `New contact form submission\n\n` +
    plainRow("Name", args.name) +
    plainRow("Work email", args.workEmail) +
    plainRow("Company", args.company) +
    plainRow("Company size", args.companySize) +
    plainRow("Role", args.role) +
    plainRow("Industry", args.industry) +
    `\nMessage:\n${args.message}\n`;

  try {
    await r.emails.send({
      from: FROM,
      to: [ORG_EMAIL],
      replyTo: args.workEmail,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("[email] sendContactNotification failed", err);
  }
}

type ConfirmDemoArgs = {
  to: string;
  name: string;
  preferredTimeframe?: string | null;
};

export async function sendDemoFallbackConfirmation(args: ConfirmDemoArgs): Promise<void> {
  const r = client();
  if (!r) return;

  const subject = `${SITE_NAME} demo — request received`;

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#1a1024;max-width:560px;">
    <p style="font-size:15px;line-height:1.55;margin:0 0 14px;">Hi ${esc(args.name)},</p>
    <p style="font-size:15px;line-height:1.55;margin:0 0 14px;">
      Thanks for requesting a WelloWork demo. A product specialist will be in touch within one
      working day to confirm a time${
        args.preferredTimeframe ? ` in your preferred window (${esc(args.preferredTimeframe)})` : ""
      }.
    </p>
    <p style="font-size:15px;line-height:1.55;margin:0 0 14px;">
      The demo is a focused 30-minute live walkthrough of the manager dashboard with realistic
      sample data from your industry — daily cognitive training, longitudinal trends, biomarker
      completion, and a short pilot-scoping chat. No fictional ROI charts.
    </p>
    <p style="font-size:15px;line-height:1.55;margin:0 0 14px;">
      If anything changes on your side, just reply to this email.
    </p>
    <p style="font-size:14px;line-height:1.55;color:#6a5d77;margin:24px 0 0;">
      — The ${esc(SITE_NAME)} team<br/>
      Uppsala, Sweden · GDPR-native
    </p>
  </div>`;

  const text =
    `Hi ${args.name},\n\n` +
    `Thanks for requesting a WelloWork demo. A product specialist will be in touch within one ` +
    `working day to confirm a time${
      args.preferredTimeframe ? ` in your preferred window (${args.preferredTimeframe})` : ""
    }.\n\n` +
    `The demo is a focused 30-minute live walkthrough of the manager dashboard with realistic ` +
    `sample data from your industry — daily cognitive training, longitudinal trends, biomarker ` +
    `completion, and a short pilot-scoping chat. No fictional ROI charts.\n\n` +
    `If anything changes on your side, just reply to this email.\n\n` +
    `— The ${SITE_NAME} team\n` +
    `Uppsala, Sweden · GDPR-native\n`;

  try {
    await r.emails.send({
      from: FROM,
      to: [args.to],
      replyTo: REPLY_TO,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("[email] sendDemoFallbackConfirmation failed", err);
  }
}
