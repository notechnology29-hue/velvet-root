-- 001_security_hardening.sql
-- Safe to run more than once. Run in the Supabase SQL editor AFTER rotating the leaked keys.

-- 1. Anonymous visitors should never be able to select applicant profiles.
revoke select on public.profiles from anon;

-- 2. Signed-in users keep table grants; RLS policies below limit writes to admins
--    (the admin dashboard signs in as an "authenticated" user, so these grants are required).
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.settings to authenticated;

-- 3. Anonymous visitors may read settings only where a policy allows (hero video URL).
grant select on public.settings to anon;

-- 4. Fixed search_path on the trigger function (Supabase linter: function_search_path_mutable).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 5. Make triggers idempotent.
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
before update on public.settings
for each row execute procedure public.set_updated_at();

-- 6. Make policies idempotent (same rules as before).
drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
using (user_id = auth.uid());

drop policy if exists "Admins can manage all settings" on public.settings;
create policy "Admins can manage all settings"
on public.settings for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read hero setting" on public.settings;
create policy "Public can read hero setting"
on public.settings for select
using (key = 'hero_video_url');

-- 7. Optional: know when a partner opened a pitch link (no IP, no personal data).
create table if not exists public.pitch_views (
  id bigint generated always as identity primary key,
  audience text not null check (audience in ('sponsors', 'dispensary')),
  viewed_at timestamptz not null default now()
);
alter table public.pitch_views enable row level security;
revoke all on public.pitch_views from anon, authenticated;
grant all on public.pitch_views to service_role;
drop policy if exists "Admins can read pitch views" on public.pitch_views;
create policy "Admins can read pitch views"
on public.pitch_views for select
using (public.is_admin());
grant select on public.pitch_views to authenticated;
