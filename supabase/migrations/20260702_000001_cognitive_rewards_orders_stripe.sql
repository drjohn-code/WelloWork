-- Stripe Checkout integration for Cognitive Rewards orders. Adds the
-- lifecycle states and reconciliation columns needed once orders leave
-- 'pending_payment' and go through hosted Checkout.
--
-- Status lifecycle: pending_payment -> awaiting_payment -> paid / failed / expired
--   pending_payment  — order row written by POST /api/orders, no Checkout Session yet.
--   awaiting_payment — Checkout Session created; buyer is on (or en route to) Stripe.
--   paid             — set only by the /api/stripe/webhook handler on a verified
--                       checkout.session.completed event. Never set from the browser
--                       redirect (success page) — that is display-only.
--   failed           — payment_intent.payment_failed.
--   expired          — checkout.session.expired (buyer abandoned the hosted page).
--
-- ALTER TYPE ... ADD VALUE cannot run in the same transaction that then uses
-- the new value, but running the ADD VALUE statements alone is safe — nothing
-- else in this migration reads/writes rows with the new statuses.

alter type public.cognitive_rewards_order_status add value if not exists 'awaiting_payment';
alter type public.cognitive_rewards_order_status add value if not exists 'failed';
alter type public.cognitive_rewards_order_status add value if not exists 'expired';

alter table public.cognitive_rewards_orders
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id  text,
  add column if not exists paid_at                   timestamptz,
  -- Stripe-computed totals in euros (converted from the integer-cent amounts
  -- Stripe returns), stored once the webhook confirms payment. NULL until paid.
  add column if not exists stripe_tax_amount          numeric(10,2),
  add column if not exists stripe_total                numeric(10,2);

create unique index if not exists cognitive_rewards_orders_stripe_checkout_session_id_idx
  on public.cognitive_rewards_orders (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create index if not exists cognitive_rewards_orders_stripe_payment_intent_id_idx
  on public.cognitive_rewards_orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
