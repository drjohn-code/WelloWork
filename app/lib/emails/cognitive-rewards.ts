import { createTranslator } from "next-intl";
import { ENABLED_LOCALES, defaultLocale, type AppLocale } from "@/i18n/locales";
import { ORG_EMAIL } from "../site";
import { formatEurShort } from "../format";
import { computePoolSplit, type TeamSize } from "../cognitive-rewards-order";
import { button, divider, esc, factsBox, heading, paragraph, renderLayout, steps, subheading } from "./email-shell";

/**
 * Cognitive Rewards transactional emails: the per-player invitation and the
 * buyer's "your team has been invited" confirmation. Copy lives in
 * messages/<locale>.json under `emails.*`; the email goes out in the order's
 * locale (the buyer's site language).
 */

export type RenderedEmail = { subject: string; html: string; text: string };

function emailLocale(locale: string | null | undefined): AppLocale {
  return locale && (ENABLED_LOCALES as string[]).includes(locale) ? (locale as AppLocale) : defaultLocale;
}

async function translator(locale: AppLocale) {
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return createTranslator({ locale, messages, namespace: "emails" });
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName.trim();
}

/* ── Player invitation ──────────────────────────────────────────────────── */

export type PlayerInviteArgs = {
  locale: string | null;
  playerName: string;
  buyerName: string;
  companyName: string;
  teamSize: TeamSize;
  rewardPoolEur: number;
  joinUrl: string;
};

export async function renderPlayerInvite(args: PlayerInviteArgs): Promise<RenderedEmail> {
  const locale = emailLocale(args.locale);
  const t = await translator(locale);
  const eur = (n: number) => formatEurShort(n, locale);
  const { minPerPlayer } = computePoolSplit(args.teamSize, args.rewardPoolEur);
  const name = firstName(args.playerName);
  const vars = {
    name,
    buyer: args.buyerName,
    company: args.companyName,
    n: args.teamSize,
    pool: eur(args.rewardPoolEur),
    min: eur(minPerPlayer),
  };

  const subject = t("playerInvite.subject", vars);
  const stepItems = [t("playerInvite.step1"), t("playerInvite.step2", vars), t("playerInvite.step3", vars)];
  const facts: Array<[string, string]> = [
    [t("playerInvite.factTeam"), t("playerInvite.factTeamValue", vars)],
    [t("playerInvite.factPool"), eur(args.rewardPoolEur)],
    [t("playerInvite.factMin"), t("playerInvite.factMinValue", vars)],
  ];

  const bodyHtml = [
    heading(esc(t("playerInvite.heading", vars))),
    paragraph(esc(t("playerInvite.intro", vars))),
    factsBox(facts),
    subheading(t("playerInvite.howHeading")),
    steps(stepItems),
    button(args.joinUrl, t("playerInvite.cta")),
    paragraph(esc(t("playerInvite.personal")), { muted: true, size: 13, margin: "16px 0 4px" }),
    paragraph(esc(t("playerInvite.validUntil")), { muted: true, size: 13, margin: "0 0 4px" }),
    paragraph(
      `${esc(t("playerInvite.fallback"))}<br/><a href="${esc(args.joinUrl)}" style="color:#162B5C;word-break:break-all;">${esc(args.joinUrl)}</a>`,
      { muted: true, size: 12, margin: "0" }
    ),
    divider(),
    paragraph(esc(t("playerInvite.questions", { email: ORG_EMAIL })), { muted: true, size: 13, margin: "0" }),
  ].join("\n");

  const html = renderLayout({
    lang: locale,
    title: subject,
    preheader: t("playerInvite.preheader", vars),
    eyebrow: t("eyebrow"),
    bodyHtml,
    footerHtml: esc(t("playerInvite.footer", vars)),
  });

  const text = [
    t("playerInvite.heading", vars),
    "",
    t("playerInvite.intro", vars),
    "",
    ...facts.map(([label, value]) => `${label}: ${value}`),
    "",
    t("playerInvite.howHeading"),
    ...stepItems.map((s, i) => `${i + 1}. ${s}`),
    "",
    `${t("playerInvite.cta")}: ${args.joinUrl}`,
    "",
    t("playerInvite.personal"),
    t("playerInvite.validUntil"),
    "",
    t("playerInvite.questions", { email: ORG_EMAIL }),
    "",
    "—",
    t("playerInvite.footer", vars),
  ].join("\n");

  return { subject, html, text };
}

/* ── Buyer confirmation ─────────────────────────────────────────────────── */

export type BuyerConfirmationArgs = {
  locale: string | null;
  buyerName: string;
  companyName: string;
  teamSize: TeamSize;
  rewardPoolEur: number;
  playerNames: string[];
};

export async function renderBuyerConfirmation(args: BuyerConfirmationArgs): Promise<RenderedEmail> {
  const locale = emailLocale(args.locale);
  const t = await translator(locale);
  const eur = (n: number) => formatEurShort(n, locale);
  const vars = {
    name: firstName(args.buyerName),
    company: args.companyName,
    n: args.teamSize,
    pool: eur(args.rewardPoolEur),
  };
  let names: string;
  try {
    names = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(args.playerNames);
  } catch {
    names = args.playerNames.join(", ");
  }

  const subject = t("buyerConfirmation.subject", vars);
  const stepItems = [t("buyerConfirmation.step1"), t("buyerConfirmation.step2"), t("buyerConfirmation.step3")];
  const facts: Array<[string, string]> = [
    [t("buyerConfirmation.factPlayers"), names],
    [t("buyerConfirmation.factPool"), eur(args.rewardPoolEur)],
  ];

  const bodyHtml = [
    heading(esc(t("buyerConfirmation.heading", vars))),
    paragraph(esc(t("buyerConfirmation.intro", vars))),
    factsBox(facts),
    subheading(t("buyerConfirmation.nextHeading")),
    steps(stepItems),
    paragraph(esc(t("buyerConfirmation.receipt")), { muted: true, size: 13, margin: "8px 0 0" }),
    divider(),
    paragraph(esc(t("buyerConfirmation.questions", { email: ORG_EMAIL })), { muted: true, size: 13, margin: "0" }),
  ].join("\n");

  const html = renderLayout({
    lang: locale,
    title: subject,
    preheader: t("buyerConfirmation.preheader", vars),
    eyebrow: t("eyebrow"),
    bodyHtml,
    footerHtml: esc(t("buyerConfirmation.footer", vars)),
  });

  const text = [
    t("buyerConfirmation.heading", vars),
    "",
    t("buyerConfirmation.intro", vars),
    "",
    ...facts.map(([label, value]) => `${label}: ${value}`),
    "",
    t("buyerConfirmation.nextHeading"),
    ...stepItems.map((s, i) => `${i + 1}. ${s}`),
    "",
    t("buyerConfirmation.receipt"),
    "",
    t("buyerConfirmation.questions", { email: ORG_EMAIL }),
    "",
    "—",
    t("buyerConfirmation.footer", vars),
  ].join("\n");

  return { subject, html, text };
}
