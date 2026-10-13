-- Cognitive Rewards — player invitations + lobby join state.
--
-- After an order is paid (Stripe webhook → onOrderPaid), every player gets an
-- email with a personal join link: /play/<token>. Only a SHA-256 hash of the
-- token is stored, so a database leak never exposes working links. Re-sending
-- an invite rotates the token (the old link stops working).
--
-- joined_at is set when the player clicks "Join the game" in the lobby (an
-- explicit POST — never on page view, because mail scanners prefetch links).

alter table public.cognitive_rewards_order_players
  add column if not exists join_token_hash   text,
  add column if not exists invite_claimed_at timestamptz,
  add column if not exists invited_at        timestamptz,
  add column if not exists invite_email_id   text,
  add column if not exists invite_error      text,
  add column if not exists joined_at         timestamptz;

create unique index if not exists cognitive_rewards_order_players_join_token_hash_idx
  on public.cognitive_rewards_order_players (join_token_hash)
  where join_token_hash is not null;

-- Buyer confirmation ("your team has been invited") is sent once per order.
alter table public.cognitive_rewards_orders
  add column if not exists buyer_notified_at timestamptz;
