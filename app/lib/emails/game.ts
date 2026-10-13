import { createTranslator } from "next-intl";
import { ENABLED_LOCALES, defaultLocale, type AppLocale } from "@/i18n/locales";
import { ORG_EMAIL } from "../site";
import { formatEurShort } from "../format";
import { button, divider, esc, factsBox, heading, paragraph, renderLayout, steps, subheading } from "./email-shell";
import type { RenderedEmail } from "./cognitive-rewards";

/** Emails sent around the end of a game: result + payout request, payout received, payout sent, buyer summary. */

function emailLocale(locale: string | null | undefined): AppLocale {
  return locale && (ENABLED_LOCALES as string[]).includes(locale) ? (locale as AppLocale) : defaultLocale;
}
async function translator(locale: AppLocale) {
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return createTranslator({ locale, messages, namespace: "emails" });
}
function firstName(n: string) {
  return n.trim().split(/\s+/)[0] || n;
}

export async function renderGameResult(args: {
  locale: string | null;
  playerName: string;
  companyName: string;
  shareEur: number;
  rank: number;
  teamSize: number;
  highlights: string[];
  link: string | null;
}): Promise<RenderedEmail> {
  const locale = emailLocale(args.locale);
  const t = await translator(locale);
  const vars = { name: firstName(args.playerName), company: args.companyName, share: formatEurShort(args.shareEur, locale), rank: args.rank, n: args.teamSize };
  const subject = t("gameResult.subject", vars);
  const highlightLines = args.highlights.map((h) => t(`gameResult.highlights.${h}` as "gameResult.highlights.helper"));
  const facts: Array<[string, string]> = [
    [t("gameResult.factShare"), vars.share],
    [t("gameResult.factRank"), t("gameResult.factRankValue", vars)],
  ];
  if (highlightLines.length) facts.push([t("gameResult.factHighlights"), highlightLines.join(" · ")]);
  const stepItems = [t("gameResult.step1"), t("gameResult.step2"), t("gameResult.step3")];

  const bodyHtml = [
    heading(esc(t("gameResult.heading", vars))),
    paragraph(esc(t("gameResult.intro", vars))),
    factsBox(facts),
    subheading(t("gameResult.nextHeading")),
    steps(stepItems),
    args.link ? button(args.link, t("gameResult.cta")) : "",
    paragraph(esc(t("gameResult.taxNote")), { muted: true, size: 12, margin: "16px 0 0" }),
    divider(),
    paragraph(esc(t("gameResult.questions", { email: ORG_EMAIL })), { muted: true, size: 13, margin: "0" }),
  ].join("\n");
  const html = renderLayout({ lang: locale, title: subject, preheader: t("gameResult.preheader", vars), eyebrow: t("eyebrow"), bodyHtml, footerHtml: esc(t("gameResult.footer", vars)) });
  const text = [
    t("gameResult.heading", vars),
    "",
    t("gameResult.intro", vars),
    "",
    ...facts.map(([l, v]) => `${l}: ${v}`),
    "",
    t("gameResult.nextHeading"),
    ...stepItems.map((s, i) => `${i + 1}. ${s}`),
    "",
    args.link ? `${t("gameResult.cta")}: ${args.link}` : "",
    "",
    t("gameResult.taxNote"),
    "",
    t("gameResult.questions", { email: ORG_EMAIL }),
  ].join("\n");
  return { subject, html, text };
}

export async function renderPayoutReceived(args: { locale: string | null; playerName: string; amountEur: number; last4: string }): Promise<RenderedEmail> {
  const locale = emailLocale(args.locale);
  const t = await translator(locale);
  const vars = { name: firstName(args.playerName), amount: formatEurShort(args.amountEur, locale), last4: args.last4 };
  const subject = t("payoutReceived.subject", vars);
  const bodyHtml = [
    heading(esc(t("payoutReceived.heading", vars))),
    paragraph(esc(t("payoutReceived.intro", vars))),
    factsBox([
      [t("payoutReceived.factAmount"), vars.amount],
      [t("payoutReceived.factAccount"), `•••• ${vars.last4}`],
    ]),
    paragraph(esc(t("payoutReceived.timing"))),
    divider(),
    paragraph(esc(t("payoutReceived.questions", { email: ORG_EMAIL })), { muted: true, size: 13, margin: "0" }),
  ].join("\n");
  const html = renderLayout({ lang: locale, title: subject, preheader: t("payoutReceived.preheader", vars), eyebrow: t("eyebrow"), bodyHtml, footerHtml: esc(t("payoutReceived.footer")) });
  const text = [t("payoutReceived.heading", vars), "", t("payoutReceived.intro", vars), "", `${t("payoutReceived.factAmount")}: ${vars.amount}`, `${t("payoutReceived.factAccount")}: •••• ${vars.last4}`, "", t("payoutReceived.timing"), "", t("payoutReceived.questions", { email: ORG_EMAIL })].join("\n");
  return { subject, html, text };
}

export async function renderPayoutSent(args: { locale: string | null; playerName: string; amountEur: number; last4: string | null }): Promise<RenderedEmail> {
  const locale = emailLocale(args.locale);
  const t = await translator(locale);
  const vars = { name: firstName(args.playerName), amount: formatEurShort(args.amountEur, locale), last4: args.last4 ?? "····" };
  const subject = t("payoutSent.subject", vars);
  const bodyHtml = [
    heading(esc(t("payoutSent.heading", vars))),
    paragraph(esc(t("payoutSent.intro", vars))),
    factsBox([
      [t("payoutSent.factAmount"), vars.amount],
      [t("payoutSent.factAccount"), `•••• ${vars.last4}`],
    ]),
    paragraph(esc(t("payoutSent.timing"))),
    divider(),
    paragraph(esc(t("payoutSent.questions", { email: ORG_EMAIL })), { muted: true, size: 13, margin: "0" }),
  ].join("\n");
  const html = renderLayout({ lang: locale, title: subject, preheader: t("payoutSent.preheader", vars), eyebrow: t("eyebrow"), bodyHtml, footerHtml: esc(t("payoutSent.footer")) });
  const text = [t("payoutSent.heading", vars), "", t("payoutSent.intro", vars), "", `${t("payoutSent.factAmount")}: ${vars.amount}`, "", t("payoutSent.timing"), "", t("payoutSent.questions", { email: ORG_EMAIL })].join("\n");
  return { subject, html, text };
}

export async function renderBuyerSummary(args: {
  locale: string | null;
  buyerName: string;
  companyName: string;
  poolEur: number;
  players: Array<{ name: string; shareEur: number }>;
  rubricTotal: number | null;
  diagnostic: { strength: string; growth: string };
}): Promise<RenderedEmail> {
  const locale = emailLocale(args.locale);
  const t = await translator(locale);
  const vars = { name: firstName(args.buyerName), company: args.companyName, pool: formatEurShort(args.poolEur, locale) };
  const subject = t("buyerSummary.subject", vars);
  const skill = (k: string) => t(`buyerSummary.skills.${k}` as "buyerSummary.skills.teamwork");
  const facts: Array<[string, string]> = args.players.map((p) => [p.name, formatEurShort(p.shareEur, locale)]);
  const bodyHtml = [
    heading(esc(t("buyerSummary.heading", vars))),
    paragraph(esc(t("buyerSummary.intro", vars))),
    subheading(t("buyerSummary.splitHeading")),
    factsBox(facts),
    subheading(t("buyerSummary.diagnosticHeading")),
    paragraph(esc(t("buyerSummary.diagnostic", { strength: skill(args.diagnostic.strength), growth: skill(args.diagnostic.growth) }))),
    args.rubricTotal !== null ? paragraph(esc(t("buyerSummary.rubric", { score: args.rubricTotal })), { muted: true, size: 13 }) : "",
    paragraph(esc(t("buyerSummary.privacy")), { muted: true, size: 13 }),
    divider(),
    paragraph(esc(t("buyerSummary.questions", { email: ORG_EMAIL })), { muted: true, size: 13, margin: "0" }),
  ].join("\n");
  const html = renderLayout({ lang: locale, title: subject, preheader: t("buyerSummary.preheader", vars), eyebrow: t("eyebrow"), bodyHtml, footerHtml: esc(t("buyerSummary.footer", vars)) });
  const text = [
    t("buyerSummary.heading", vars),
    "",
    t("buyerSummary.intro", vars),
    "",
    t("buyerSummary.splitHeading"),
    ...facts.map(([l, v]) => `${l}: ${v}`),
    "",
    t("buyerSummary.diagnostic", { strength: skill(args.diagnostic.strength), growth: skill(args.diagnostic.growth) }),
    "",
    t("buyerSummary.privacy"),
    "",
    t("buyerSummary.questions", { email: ORG_EMAIL }),
  ].join("\n");
  return { subject, html, text };
}
