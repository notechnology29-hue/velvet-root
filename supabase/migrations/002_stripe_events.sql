-- 002_stripe_events.sql
-- Safe to run more than once.
-- Lets the Stripe webhook handle each event only once, even when Stripe redelivers it.
-- Written and read only by the server (service role); no browser role has access.

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;
revoke all on public.stripe_events from anon, authenticated;
grant all on public.stripe_events to service_role;
