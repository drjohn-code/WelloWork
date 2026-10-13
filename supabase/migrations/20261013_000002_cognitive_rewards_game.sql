-- Cognitive Rewards — the game itself, scoring and payouts.
--
-- One `cognitive_rewards_games` row per paid order, created when the lobby is
-- first opened. All tables are server-only (RLS enabled, no policies): every
-- read/write goes through API routes keyed by a player's personal join token.
-- Intake answers, challenge text and Game Master content are private to the
-- team; the company only ever receives scores (see docs/cognitive-rewards-game-design.md).

create type public.cognitive_rewards_game_phase as enum (
  'lobby', 'intake', 'generating', 'briefing', 'round', 'challenge', 'judging', 'key', 'scorecard', 'done'
);

create type public.cognitive_rewards_payout_status as enum ('awaiting_details', 'ready', 'paid');

create table if not exists public.cognitive_rewards_games (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null unique references public.cognitive_rewards_orders(id) on delete cascade,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  phase              public.cognitive_rewards_game_phase not null default 'lobby',
  phase_started_at   timestamptz not null default now(),
  -- Team's shared content language (set by the host in the lobby, locked at start).
  language           text not null default 'en',
  host_player_id     uuid references public.cognitive_rewards_order_players(id) on delete set null,
  team_size          int not null,
  -- Round plan: [{ index, template, solverPlayerId }], fixed at start.
  schedule           jsonb not null default '[]'::jsonb,
  current_round      int not null default 0,
  -- Validated Game Master content (briefing, per-round flavour + reactions, challenge, key lines).
  content            jsonb,
  content_source     text,                  -- 'model' | 'fallback'
  challenge_text     text,
  challenge_verdict  jsonb,                 -- { verdict, scores: {...}, total }
  key_facts          jsonb,                 -- [{ label, value }] shown as blanks in the ceremony
  key_hash           text,
  key_attempts       int not null default 0,
  key_revealed       int not null default 0,
  started_at         timestamptz,
  ended_at           timestamptz,
  result_emails_sent_at timestamptz
);

create table if not exists public.cognitive_rewards_game_intake (
  id            uuid primary key default gen_random_uuid(),
  game_id       uuid not null references public.cognitive_rewards_games(id) on delete cascade,
  player_id     uuid not null references public.cognitive_rewards_order_players(id) on delete cascade,
  question_key  text not null,
  answer        text not null check (char_length(answer) <= 200),
  created_at    timestamptz not null default now(),
  unique (game_id, player_id, question_key)
);

create table if not exists public.cognitive_rewards_game_rounds (
  id               uuid primary key default gen_random_uuid(),
  game_id          uuid not null references public.cognitive_rewards_games(id) on delete cascade,
  round_index      int not null,
  template         text not null,
  solver_player_id uuid not null references public.cognitive_rewards_order_players(id) on delete cascade,
  params           jsonb not null,          -- generator parameters incl. the facts this round produces
  pieces           jsonb not null,          -- { [playerId]: piece } — served only to that player
  public_prompt    jsonb not null,          -- what everyone sees
  answer_hash      text not null,
  status           text not null default 'pending',   -- pending | active | solved | failed
  started_at       timestamptz,
  ended_at         timestamptz,
  attempts         int not null default 0,
  wrong_attempts   int not null default 0,
  hint_used        boolean not null default false,
  stuck_at         timestamptz,
  acknowledged     jsonb not null default '[]'::jsonb, -- player ids who re-shared after a stuck request
  solved_by_reveal boolean not null default false,
  unique (game_id, round_index)
);

create table if not exists public.cognitive_rewards_game_events (
  id           bigserial primary key,
  game_id      uuid not null references public.cognitive_rewards_games(id) on delete cascade,
  round_index  int,
  player_id    uuid references public.cognitive_rewards_order_players(id) on delete set null,
  type         text not null,
  payload      jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists cognitive_rewards_game_events_game_idx on public.cognitive_rewards_game_events (game_id);

-- Credit ledger: who enabled which solve.
create table if not exists public.cognitive_rewards_game_contributions (
  id               bigserial primary key,
  game_id          uuid not null references public.cognitive_rewards_games(id) on delete cascade,
  round_index      int not null,
  player_id        uuid not null references public.cognitive_rewards_order_players(id) on delete cascade,
  solver_player_id uuid not null references public.cognitive_rewards_order_players(id) on delete cascade,
  kind             text not null,           -- assist | rescue | callback_source | detail
  created_at       timestamptz not null default now()
);
create index if not exists cognitive_rewards_game_contributions_game_idx on public.cognitive_rewards_game_contributions (game_id);

create table if not exists public.cognitive_rewards_game_scores (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid not null references public.cognitive_rewards_games(id) on delete cascade,
  player_id   uuid not null references public.cognitive_rewards_order_players(id) on delete cascade,
  components  jsonb not null,               -- { dataTransfer, teamwork, problemSolving, focus, memory }
  total       numeric(6,2) not null,
  share_eur   int not null,
  rank        int not null,
  highlights  jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  unique (game_id, player_id)
);

-- Bank-transfer payouts. IBANs are encrypted at rest (AES-256-GCM, server key)
-- and wiped 30 days after the payout is marked paid; amount + reference stay.
create table if not exists public.cognitive_rewards_payouts (
  id                 uuid primary key default gen_random_uuid(),
  game_id            uuid not null references public.cognitive_rewards_games(id) on delete cascade,
  player_id          uuid not null references public.cognitive_rewards_order_players(id) on delete cascade,
  amount_eur         int not null check (amount_eur >= 0),
  status             public.cognitive_rewards_payout_status not null default 'awaiting_details',
  holder_name        text,
  iban_encrypted     text,
  iban_last4         text,
  country            text,
  details_at         timestamptz,
  paid_at            timestamptz,
  payment_reference  text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (game_id, player_id)
);

-- Presence for disconnect handling, plus an encrypted copy of the join token so
-- the result email can carry the player's personal link (the hash alone can't).
alter table public.cognitive_rewards_order_players
  add column if not exists last_seen_at timestamptz,
  add column if not exists join_token_encrypted text;

create or replace function public.cognitive_rewards_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cognitive_rewards_games_touch on public.cognitive_rewards_games;
create trigger cognitive_rewards_games_touch before update on public.cognitive_rewards_games
  for each row execute function public.cognitive_rewards_touch_updated_at();
drop trigger if exists cognitive_rewards_payouts_touch on public.cognitive_rewards_payouts;
create trigger cognitive_rewards_payouts_touch before update on public.cognitive_rewards_payouts
  for each row execute function public.cognitive_rewards_touch_updated_at();

alter table public.cognitive_rewards_games enable row level security;
alter table public.cognitive_rewards_game_intake enable row level security;
alter table public.cognitive_rewards_game_rounds enable row level security;
alter table public.cognitive_rewards_game_events enable row level security;
alter table public.cognitive_rewards_game_contributions enable row level security;
alter table public.cognitive_rewards_game_scores enable row level security;
alter table public.cognitive_rewards_payouts enable row level security;
-- Intentionally no policies: anon and authenticated have zero access.
