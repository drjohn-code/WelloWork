-- contact_messages: submissions from the /contact page.
-- Same posture as demo_requests: anon may INSERT only.

create extension if not exists "pgcrypto";

create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 2 and 200),
  work_email    text not null check (char_length(work_email) between 4 and 320),
  company       text,
  company_size  text,
  role          text,
  industry      text,
  message       text not null check (char_length(message) between 4 and 4000),
  consent       boolean not null default false,
  source        text,
  user_agent    text
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists "anon insert contact messages" on public.contact_messages;
create policy "anon insert contact messages"
  on public.contact_messages
  for insert
  to anon
  with check (true);
