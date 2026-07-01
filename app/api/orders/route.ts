import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase";
import { rateLimit, getClientIp } from "../../lib/rate-limit";
import {
  computeOrderPricing,
  hasOrderErrors,
  normalizeEmail,
  validateOrderInput,
  ORDER_ERROR_CODE,
  type OrderInput,
  type TeamSize,
} from "../../lib/cognitive-rewards-order";
import type {
  CognitiveRewardsOrderInsert,
  CognitiveRewardsOrderPlayerInsert,
  CognitiveRewardsPlayerRole,
} from "../../types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creates a pending Cognitive Rewards order from the buyer wizard. This is
// the payment SEAM: on success the client calls the (stubbed) initiateCheckout
// with the returned orderId — see app/lib/checkout.ts. No Stripe integration
// happens here; that is a later task.

type RawPlayer = { name?: unknown; email?: unknown; role?: unknown };

type OrderRequestBody = {
  teamSize?: unknown;
  players?: RawPlayer[];
  rewardPool?: unknown;
  buyer?: { name?: unknown; workEmail?: unknown; company?: unknown };
  consentTerms?: unknown;
  consentGdpr?: unknown;
  locale?: unknown;
  website?: unknown; // honeypot
};

function clean(v: unknown, max = 320): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return NaN;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`orders:${ip}`, 5, 10 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, code: ORDER_ERROR_CODE.RATE_LIMITED }, { status: 429 });
  }

  let body: OrderRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: ORDER_ERROR_CODE.REQUEST_FAILED }, { status: 400 });
  }

  // Honeypot — silently accept without persisting.
  if (clean(body.website, 200).length > 0) {
    return NextResponse.json({ ok: true, orderId: "spam-discarded", persisted: false });
  }

  const input: OrderInput = {
    teamSize: toNumber(body.teamSize),
    players: Array.isArray(body.players)
      ? body.players.map((p) => ({
          name: clean(p?.name, 200),
          email: normalizeEmail(clean(p?.email, 320)),
          role: clean(p?.role, 40),
        }))
      : [],
    rewardPool: toNumber(body.rewardPool),
    buyer: {
      name: clean(body.buyer?.name, 200),
      workEmail: normalizeEmail(clean(body.buyer?.workEmail, 320)),
      company: clean(body.buyer?.company, 200),
    },
    consentTerms: body.consentTerms === true,
    consentGdpr: body.consentGdpr === true,
  };

  const errors = validateOrderInput(input);
  if (hasOrderErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  // Server is the pricing authority — recompute from team_size, never trust the client.
  const pricing = computeOrderPricing(input.teamSize as TeamSize, input.rewardPool);
  const locale = clean(body.locale, 10) || "en";

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const mockOrderId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    // TODO: set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY so orders persist.
    console.warn("[orders] Supabase not configured — order not persisted.", {
      mockOrderId,
      input,
      pricing,
    });
    return NextResponse.json({ ok: true, orderId: mockOrderId, persisted: false, pricing });
  }

  const orderRow: CognitiveRewardsOrderInsert = {
    status: "pending_payment",
    buyer_name: input.buyer.name,
    buyer_email: input.buyer.workEmail,
    company_name: input.buyer.company,
    team_size: input.teamSize,
    game_fee: pricing.gameFee,
    vat_rate: pricing.vatRate,
    vat_amount: pricing.vatAmount,
    reward_pool: pricing.rewardPool,
    currency: pricing.currency,
    total: pricing.total,
    locale,
    consent_terms: input.consentTerms,
    consent_gdpr: input.consentGdpr,
    user_agent: request.headers.get("user-agent") || null,
  };

  const { data: order, error: orderError } = await supabase
    .from("cognitive_rewards_orders")
    .insert(orderRow)
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[orders] insert error", orderError);
    return NextResponse.json({ ok: false, code: ORDER_ERROR_CODE.REQUEST_FAILED }, { status: 500 });
  }

  const playerRows: CognitiveRewardsOrderPlayerInsert[] = input.players.map((p) => ({
    order_id: order.id,
    name: p.name,
    email: p.email,
    role: p.role as CognitiveRewardsPlayerRole,
  }));

  const { error: playersError } = await supabase
    .from("cognitive_rewards_order_players")
    .insert(playerRows);

  if (playersError) {
    console.error("[orders] players insert error", playersError);
    return NextResponse.json({ ok: false, code: ORDER_ERROR_CODE.REQUEST_FAILED }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderId: order.id, persisted: true, pricing });
}
