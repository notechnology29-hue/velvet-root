-- 003_pitch_content.sql
-- Safe to run more than once.
-- Holds the copy for the link-only pitch pages so it never has to live in the code repository.
-- Read and written only by the server (service role); no browser role has access.

create table if not exists public.pitch_content (
  audience text primary key check (audience in ('sponsors', 'dispensary')),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.pitch_content enable row level security;
revoke all on public.pitch_content from anon, authenticated;
grant all on public.pitch_content to service_role;

drop trigger if exists set_pitch_content_updated_at on public.pitch_content;
create trigger set_pitch_content_updated_at
before update on public.pitch_content
for each row execute procedure public.set_updated_at();
