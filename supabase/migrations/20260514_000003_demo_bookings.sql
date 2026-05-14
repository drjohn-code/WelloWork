-- demo_bookings: scheduled demo calls coming from the Cal.com booking flow on
-- /book-a-demo, plus rows submitted via the fallback "request a demo time"
-- form when the Cal.com integration is not configured.
--
-- Posture: RLS enabled, NO policies for `anon` or `authenticated`. The Cal.com
-- webhook handler and the fallback Route Handler both run server-side with the
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. Back-office staff query rows
-- via the service role or via a future authenticated admin role; the existing
-- demo_requests table (legacy, kept intact) continues to hold the historical
-- non-scheduled lead-capture flow if it is ever reactivated.

create extension if not exists "pgcrypto";

create type public.demo_booking_source as enum ('calcom', 'fallback_form');
create type public.demo_booking_status as enum ('scheduled', 'rescheduled', 'cancelled', 'completed', 'pending');

create table if not exists public.demo_bookings (
  -- Internal id
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Origin
  source          public.demo_booking_source not null,
  -- Cal.com booking identifier. Cal sends a numeric id and a string uid; we
  -- store the uid (string) for stable upserts because BOOKING_RESCHEDULED can
  -- mint a fresh numeric id while keeping the uid.
  calcom_booking_uid text unique,
  calcom_booking_id  bigint,

  -- Attendee + firmographics (collected as Cal.com booking questions, or as
  -- fields on the fallback form)
  attendee_name    text not null check (char_length(attendee_name) between 1 and 200),
  attendee_email   text not null check (char_length(attendee_email) between 4 and 320),
  company          text,
  company_size     text,
  role             text,
  industry         text,
  notes            text,           -- "what you'd like to see"
  preferred_timeframe text,        -- only used by the fallback form
  consent          boolean not null default false,

  -- Scheduling
  scheduled_start  timestamptz,
  scheduled_end    timestamptz,
  timezone         text,
  status           public.demo_booking_status not null default 'pending',

  -- Diagnostics
  raw_payload      jsonb,
  user_agent       text
);

create index if not exists demo_bookings_created_at_idx
  on public.demo_bookings (created_at desc);

create index if not exists demo_bookings_scheduled_start_idx
  on public.demo_bookings (scheduled_start);

create index if not exists demo_bookings_calcom_uid_idx
  on public.demo_bookings (calcom_booking_uid);

create or replace function public.demo_bookings_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists demo_bookings_set_updated_at on public.demo_bookings;
create trigger demo_bookings_set_updated_at
  before update on public.demo_bookings
  for each row execute function public.demo_bookings_set_updated_at();

alter table public.demo_bookings enable row level security;

-- Intentionally no policies: anon and authenticated have zero access.
-- All reads/writes go through service-role server code.
