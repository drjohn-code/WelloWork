import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getSupabaseServerClient } from "@/app/lib/supabase";
import { getStripeClient, getStripeWebhookSecret } from "@/app/lib/stripe";
import { onOrderPaid } from "@/app/lib/order-fulfillment";
import type { CognitiveRewardsOrderStatus } from "@/app/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe Checkout webhook. Fulfillment is webhook-driven ONLY — the success
// page (app/[locale]/cognitive-rewards/order/success) never marks an order
// paid itself, it just displays state. App Router route handlers must read
// the raw request body (not request.json()) for Stripe's signature check to
// verify correctly.

const OPEN_STATUSES: CognitiveRewardsOrderStatus[] = ["pending_payment", "awaiting_payment"];

async function findOrderByStripeId(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  orderId: string | undefined
) {
  if (!orderId) return null;
  const { data, error } = await supabase
    .from("cognitive_rewards_orders")
    .select("id, status")
    .eq("id", orderId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

async function handleCheckoutSessionCompleted(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  session: Stripe.Checkout.Session
) {
  const orderId = session.metadata?.orderId;
  const order = await findOrderByStripeId(supabase, orderId);
  if (!order) {
    console.error("[stripe-webhook] checkout.session.completed for unknown orderId", orderId);
    return;
  }

  // Idempotent: Stripe may resend this event; a second delivery is a no-op.
  if (order.status === "paid") return;

  if (session.payment_status !== "paid") {
    console.warn("[stripe-webhook] checkout.session.completed but payment_status !== paid", {
      orderId,
      paymentStatus: session.payment_status,
    });
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
  const taxAmountCents = session.total_details?.amount_tax;
  const totalCents = session.amount_total;

  const { error } = await supabase
    .from("cognitive_rewards_orders")
    .update({
      status: "paid",
      stripe_payment_intent_id: paymentIntentId,
      paid_at: new Date().toISOString(),
      stripe_tax_amount: typeof taxAmountCents === "number" ? taxAmountCents / 100 : null,
      stripe_total: typeof totalCents === "number" ? totalCents / 100 : null,
    })
    .eq("id", order.id)
    // Re-check status in the write itself to close the race between two
    // concurrent deliveries of the same event.
    .neq("status", "paid");

  if (error) {
    console.error("[stripe-webhook] failed to mark order paid", order.id, error);
    return;
  }

  await onOrderPaid(order.id);
}

async function handleCheckoutSessionExpired(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  session: Stripe.Checkout.Session
) {
  const order = await findOrderByStripeId(supabase, session.metadata?.orderId);
  if (!order || !OPEN_STATUSES.includes(order.status)) return;

  const { error } = await supabase
    .from("cognitive_rewards_orders")
    .update({ status: "expired" })
    .eq("id", order.id);
  if (error) console.error("[stripe-webhook] failed to mark order expired", order.id, error);
}

async function handlePaymentIntentFailed(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  paymentIntent: Stripe.PaymentIntent
) {
  const order = await findOrderByStripeId(supabase, paymentIntent.metadata?.orderId);
  if (!order || !OPEN_STATUSES.includes(order.status)) return;

  const { error } = await supabase
    .from("cognitive_rewards_orders")
    .update({ status: "failed", stripe_payment_intent_id: paymentIntent.id })
    .eq("id", order.id);
  if (error) console.error("[stripe-webhook] failed to mark order failed", order.id, error);
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = getStripeWebhookSecret();
  if (!stripe || !webhookSecret) {
    console.error("[stripe-webhook] Stripe not configured (missing secret key or webhook secret).");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.error("[stripe-webhook] Supabase not configured — event acknowledged but not processed.", event.type);
    return NextResponse.json({ received: true, persisted: false });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.expired":
        await handleCheckoutSessionExpired(supabase, event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(supabase, event.data.object as Stripe.PaymentIntent);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error", event.type, err);
    // Still return 200 — Stripe would otherwise retry indefinitely on a bug
    // in our handler, and these events are read again from the Dashboard if
    // reconciliation is needed. Log loudly instead.
  }

  return NextResponse.json({ received: true });
}
