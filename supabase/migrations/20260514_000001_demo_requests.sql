-- demo_requests: leads from the /book-a-demo page.
-- Anon can INSERT only. No SELECT/UPDATE/DELETE for anon — back-office staff
-- access rows via the service-role key or an authenticated admin role.

create extension if not exists "pgcrypto";

create table if not exists public.demo_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 2 and 200),
  work_email    text not null check (char_length(work_email) between 4 and 320),
  company       text not null check (char_length(company) between 1 and 200),
  company_size  text,
  role          text,
  industry      text,
  message       text,
  consent       boolean not null default false,
  source        text,
  user_agent    text
);

create index if not exists demo_requests_created_at_idx on public.demo_requests (created_at desc);

alter table public.demo_requests enable row level security;

-- Anonymous visitors may submit a demo request but cannot read existing rows.
drop policy if exists "anon insert demo requests" on public.demo_requests;
create policy "anon insert demo requests"
  on public.demo_requests
  for insert
  to anon
  with check (true);

-- Belt and braces: no select policy for anon means anon cannot read rows.
-- Authenticated users (back office) get no implicit access either; access
-- is gated to the service-role key used by the Route Handler, or an explicit
-- staff policy added later.
