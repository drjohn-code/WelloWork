-- TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
--
-- Adds the demo-only "pay without Stripe" path used when PAYMENT_MOCK_MODE=true
-- (see app/api/orders/[orderId]/checkout/route.ts). Mock-paid orders must never
-- be mistaken for real revenue, so they get:
--   - a distinct status ('mock_paid', never 'paid')
--   - a distinct payment_provider ('mock', never 'stripe')
--   - a short, support-lookup-safe reference code (e.g. "CR-4F8K2P"), separate
--     from the internal uuid `id`, shown to the buyer and used as the temporary
--     Puzzify join-link token
--
-- To remove once mock mode is retired: stop writing these columns/status in
-- app code, then in a follow-up migration drop payment_provider and
-- mock_reference (the 'mock_paid' enum value can be left in place — Postgres
-- cannot drop enum values, but an unused one is harmless).
--
-- ALTER TYPE ... ADD VALUE cannot run in the same transaction that then uses
-- the new value (see 20260702_000001's note) — this migration only adds it.

alter type public.cognitive_rewards_order_status add value if not exists 'mock_paid';

alter table public.cognitive_rewards_orders
  add column if not exists payment_provider text not null default 'stripe'
    check (payment_provider in ('stripe', 'mock')),
  add column if not exists mock_reference text;

create unique index if not exists cognitive_rewards_orders_mock_reference_idx
  on public.cognitive_rewards_orders (mock_reference)
  where mock_reference is not null;
