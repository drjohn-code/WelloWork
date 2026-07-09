import { randomInt } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getSupabaseServerClient } from "@/app/lib/supabase";
import { getStripeClient, STRIPE_TAX_CODE } from "@/app/lib/stripe";
import { rateLimit, getClientIp } from "@/app/lib/rate-limit";
import { GAME_FEE_EUR, CURRENCY, type TeamSize } from "@/app/lib/cognitive-rewards-order";
import { SITE_URL } from "@/app/lib/site";
// TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
import { sendCognitiveRewardsMockInvite } from "@/app/lib/email";
import type { CognitiveRewardsOrderRow, CognitiveRewardsOrderPlayerRow } from "@/app/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creates a Stripe Checkout Session for a pending Cognitive Rewards order.
// This is the second half of the payment seam: POST /api/orders writes the
// pending order and returns orderId; this route (called by the client via
// app/lib/checkout.ts) turns that orderId into a hosted Checkout url. Pricing
// is recomputed here from team_size + the stored reward_pool — the client
// never supplies an amount. VAT itself is computed by Stripe Tax
// (automatic_tax), not by the app.

const CHECKOUT_ERROR = {
  RATE_LIMITED: "RATE_LIMITED",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  ALREADY_PAID: "ALREADY_PAID",
  NOT_CONFIGURED: "NOT_CONFIGURED",
  REQUEST_FAILED: "REQUEST_FAILED",
} as const;

const STRIPE_LOCALES = new Set([
  "en",
  "sv",
  "nl",
  "de",
  "fr",
  "es",
  "it",
  "lt",
]);

function toStripeLocale(locale: unknown): Stripe.Checkout.SessionCreateParams.Locale {
  if (typeof locale === "string" && STRIPE_LOCALES.has(locale)) {
    return locale as Stripe.Checkout.SessionCreateParams.Locale;
  }
  return "auto";
}

type CheckoutRequestBody = { locale?: unknown };

// TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
// Server-only flag: when true, POST requests to this route skip Stripe
// entirely and fake a successful payment so the order -> invitation flow can
// be demoed/tested without live payments. Unset (or any value other than
// "true"), this route behaves byte-for-byte like the real Stripe flow below.
const PAYMENT_MOCK_MODE = process.env.PAYMENT_MOCK_MODE === "true";

// No 0/O/1/I — avoids support-desk transcription errors reading the code aloud.
const MOCK_REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function generateMockOrderReference(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += MOCK_REFERENCE_ALPHABET[randomInt(MOCK_REFERENCE_ALPHABET.length)];
  }
  return `CR-${suffix}`;
}

// TODO: this token is a plain, non-expiring reference — fine for an internal
// demo, but replace with a signed, time-limited join token before any real
// (non-demo/test) player ever receives this link.
function buildMockJoinUrl(reference: string): string {
  return `https://puzzify-platform.web.app/join?order=${encodeURIComponent(reference)}`;
}

function mockSuccessUrl(order: Pick<CognitiveRewardsOrderRow, "id" | "locale">): string {
  const localePrefix = order.locale && order.locale !== "en" ? `/${order.locale}` : "";
  return `${SITE_URL}${localePrefix}/cognitive-rewards/order/success?mock_order=${order.id}`;
}

// Fakes a successful payment for a pending order: skips Stripe, marks the
// order 'mock_paid' (never 'paid', so it can never be mistaken for real
// revenue in reporting) with payment_provider 'mock', and emails every
// player captured in step 2 a temporary Puzzify join link. Only ever called
// when PAYMENT_MOCK_MODE is true.
async function handleMockCheckout(orderId: string): Promise<NextResponse> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.error("[checkout:mock] Supabase not configured — cannot process mock payment.");
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.NOT_CONFIGURED }, { status: 503 });
  }

  const { data: order, error: fetchError } = await supabase
    .from("cognitive_rewards_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.ORDER_NOT_FOUND }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.ALREADY_PAID }, { status: 409 });
  }

  // Idempotent: a resubmit (e.g. browser back + retry) replays the same
  // success URL instead of generating a new reference or re-sending invites.
  if (order.status === "mock_paid") {
    return NextResponse.json({ ok: true, url: mockSuccessUrl(order) });
  }

  let reference = "";
  let updated: CognitiveRewardsOrderRow | null = null;
  for (let attempt = 0; attempt < 5 && !updated; attempt++) {
    reference = generateMockOrderReference();
    const { data, error } = await supabase
      .from("cognitive_rewards_orders")
      .update({
        status: "mock_paid",
        payment_provider: "mock",
        mock_reference: reference,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .select("*")
      .single();
    if (!error) {
      updated = data;
    } else if (error.code !== "23505") {
      // Not a unique-constraint collision on mock_reference — a real failure.
      console.error("[checkout:mock] failed to mark order mock_paid", order.id, error);
      return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.REQUEST_FAILED }, { status: 500 });
    }
  }

  if (!updated) {
    console.error("[checkout:mock] exhausted retries generating a unique mock reference", order.id);
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.REQUEST_FAILED }, { status: 500 });
  }

  const { data: players, error: playersError } = await supabase
    .from("cognitive_rewards_order_players")
    .select("*")
    .eq("order_id", order.id);

  if (playersError) {
    console.error("[checkout:mock] failed to load players for invite emails", order.id, playersError);
  } else {
    const joinUrl = buildMockJoinUrl(reference);
    await Promise.allSettled(
      (players ?? []).map((player: CognitiveRewardsOrderPlayerRow) =>
        sendCognitiveRewardsMockInvite({
          to: player.email,
          playerName: player.name,
          buyerName: order.buyer_name,
          companyName: order.company_name,
          teamSize: order.team_size,
          rewardPoolEur: Number(order.reward_pool),
          orderReference: reference,
          joinUrl,
          locale: order.locale || "en",
        })
      )
    );
  }

  return NextResponse.json({ ok: true, url: mockSuccessUrl(updated) });
}

export async function POST(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;

  const ip = getClientIp(request.headers);
  const rl = rateLimit(`checkout:${ip}`, 8, 10 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.RATE_LIMITED }, { status: 429 });
  }

  // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
  if (PAYMENT_MOCK_MODE) {
    return handleMockCheckout(orderId);
  }

  const stripe = getStripeClient();
  const supabase = getSupabaseServerClient();
  if (!stripe || !supabase) {
    console.error("[checkout] Stripe or Supabase not configured — cannot create a Checkout Session.");
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.NOT_CONFIGURED }, { status: 503 });
  }

  let body: CheckoutRequestBody = {};
  try {
    body = await request.json();
  } catch {
    // No body / not JSON — fall back to the order's stored locale.
  }

  const { data: order, error: fetchError } = await supabase
    .from("cognitive_rewards_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.ORDER_NOT_FOUND }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.ALREADY_PAID }, { status: 409 });
  }

  // Pricing authority: recompute the game fee from team_size; read the
  // reward pool from the stored order. Never trust a client-submitted amount.
  const gameFeeEur = GAME_FEE_EUR[order.team_size as TeamSize];
  const rewardPoolEur = Number(order.reward_pool);
  const currency = CURRENCY.toLowerCase();

  const localePrefix = order.locale && order.locale !== "en" ? `/${order.locale}` : "";
  const successUrl = `${SITE_URL}${localePrefix}/cognitive-rewards/order/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${SITE_URL}${localePrefix}/cognitive-rewards/order?checkout=cancelled&orderId=${order.id}`;

  // Idempotency key is stable within the order's current lifecycle phase, so
  // an accidental double-submit or network retry returns the SAME session
  // instead of creating a duplicate. A genuine retry after failure/expiry
  // sees a different `order.status` here and gets a fresh key -> fresh session.
  const idempotencyKey = `cr-checkout-${order.id}-${order.status}`;

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        currency,
        customer_email: order.buyer_email,
        customer_creation: "always",
        locale: toStripeLocale(body.locale ?? order.locale),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              unit_amount: Math.round(gameFeeEur * 100),
              tax_behavior: "exclusive",
              product_data: {
                name: `Cognitive Rewards — ${order.team_size}-player game`,
                tax_code: STRIPE_TAX_CODE.GAME_FEE,
              },
            },
          },
          {
            quantity: 1,
            price_data: {
              currency,
              unit_amount: Math.round(rewardPoolEur * 100),
              tax_behavior: "exclusive",
              product_data: {
                name: "Reward pool (paid out to your team)",
                tax_code: STRIPE_TAX_CODE.REWARD_POOL,
              },
            },
          },
        ],
        automatic_tax: { enabled: true },
        tax_id_collection: { enabled: true },
        billing_address_collection: "required",
        invoice_creation: { enabled: true },
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { orderId: order.id },
        payment_intent_data: {
          metadata: { orderId: order.id },
        },
      },
      { idempotencyKey }
    );
  } catch (err) {
    console.error("[checkout] Stripe session creation failed", err);
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.REQUEST_FAILED }, { status: 500 });
  }

  if (!session.url) {
    console.error("[checkout] Stripe session created without a url", session.id);
    return NextResponse.json({ ok: false, code: CHECKOUT_ERROR.REQUEST_FAILED }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("cognitive_rewards_orders")
    .update({ status: "awaiting_payment", stripe_checkout_session_id: session.id })
    .eq("id", order.id);

  if (updateError) {
    // Non-fatal: the session was created and the buyer can still pay. The
    // webhook will still find the order via metadata.orderId when it lands.
    console.error("[checkout] failed to persist checkout session id on order", updateError);
  }

  return NextResponse.json({ ok: true, url: session.url });
}
