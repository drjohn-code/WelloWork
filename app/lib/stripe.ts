import Stripe from "stripe";

let cached: Stripe | null = null;

/** Server-only. Returns null (never throws) if STRIPE_SECRET_KEY isn't configured, so callers can fail gracefully instead of crashing the site. */
export function getStripeClient(): Stripe | null {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  cached = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  return cached;
}

export function getStripeWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || null;
}

/**
 * Stripe Tax product tax codes for the two Cognitive Rewards line items.
 * Verified against https://docs.stripe.com/tax/tax-codes at integration time.
 *
 * - GAME_FEE: "General - Electronically Supplied Services" — a digital
 *   service delivered over the internet with minimal human involvement.
 *   This is the closest general-purpose code for a B2B SaaS/game fee; confirm
 *   with an accountant whether a more specific digital-services code fits
 *   WelloWork's actual delivery model better before going live.
 * - REWARD_POOL: "Nontaxable" — the pool is collected on the buyer's behalf
 *   and disbursed to players later (a payout, not a sold good/service), so it
 *   must never carry VAT. This is a placeholder pending accountant sign-off —
 *   see docs/stripe-setup.md. Changing it is a one-line edit here.
 */
export const STRIPE_TAX_CODE = {
  GAME_FEE: "txcd_10000000",
  REWARD_POOL: "txcd_00000000",
} as const;
