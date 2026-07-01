-- Cognitive Rewards order flow: a buyer configures a team-size game + reward
-- pool and reaches a payment handoff. Stripe checkout/invoicing is a later
-- task — these rows start (and, for now, stay) in 'pending_payment'.
--
-- Posture matches demo_bookings: RLS enabled, NO policies for `anon` or
-- `authenticated`. The createOrder route runs server-side with
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. Back-office access goes
-- through the service role or a future authenticated admin role.

create extension if not exists "pgcrypto";

create type public.cognitive_rewards_order_status as enum ('pending_payment', 'paid', 'cancelled');
create type public.cognitive_rewards_player_role as enum ('staff', 'manager', 'clevel');

create table if not exists public.cognitive_rewards_orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  status          public.cognitive_rewards_order_status not null default 'pending_payment',

  -- Buyer (guest checkout — no account is created)
  buyer_name      text not null check (char_length(buyer_name) between 1 and 200),
  buyer_email     text not null check (char_length(buyer_email) between 4 and 320),
  company_name    text not null check (char_length(company_name) between 1 and 200),

  team_size       smallint not null check (team_size in (3, 4, 5)),

  -- Authoritative pricing, computed server-side from team_size at order time.
  -- The client-submitted price is never trusted (see app/api/orders/route.ts).
  game_fee        numeric(10,2) not null,
  vat_rate        numeric(5,4) not null,
  vat_amount      numeric(10,2) not null,
  reward_pool     numeric(10,2) not null check (reward_pool >= 100),
  currency        text not null default 'EUR',
  total           numeric(10,2) not null,

  locale          text,
  consent_terms   boolean not null default false,
  consent_gdpr    boolean not null default false,

  user_agent      text
);

create index if not exists cognitive_rewards_orders_created_at_idx
  on public.cognitive_rewards_orders (created_at desc);

create or replace function public.cognitive_rewards_orders_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cognitive_rewards_orders_set_updated_at on public.cognitive_rewards_orders;
create trigger cognitive_rewards_orders_set_updated_at
  before update on public.cognitive_rewards_orders
  for each row execute function public.cognitive_rewards_orders_set_updated_at();

alter table public.cognitive_rewards_orders enable row level security;
-- Intentionally no policies: anon and authenticated have zero access.

create table if not exists public.cognitive_rewards_order_players (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  order_id    uuid not null references public.cognitive_rewards_orders(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 200),
  -- Not unique at the DB level: uniqueness is enforced per-order (case-insensitively)
  -- in application validation (see validateOrderInput), not globally across orders.
  email       text not null check (char_length(email) between 4 and 320),
  role        public.cognitive_rewards_player_role not null
);

create index if not exists cognitive_rewards_order_players_order_id_idx
  on public.cognitive_rewards_order_players (order_id);

alter table public.cognitive_rewards_order_players enable row level security;
-- Intentionally no policies: anon and authenticated have zero access.
