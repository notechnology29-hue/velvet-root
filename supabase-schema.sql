create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  phone text,
  social_handle text,
  vetting_answers jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'active')),
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_status_idx on public.profiles(status);
create index if not exists profiles_email_idx on public.profiles(email);
create unique index if not exists profiles_user_id_unique_idx
  on public.profiles(user_id)
  where user_id is not null;

alter table public.profiles enable row level security;
alter table public.settings enable row level security;

create policy "Admins can manage all profiles"
on public.profiles for all
using (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

create policy "Users can view own profile"
on public.profiles for select
using (user_id = auth.uid());

create policy "Admins can manage all settings"
on public.settings for all
using (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

create policy "Public can read hero setting"
on public.settings for select
using (key = 'hero_video_url');

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

create trigger set_settings_updated_at
before update on public.settings
for each row
execute procedure public.set_updated_at();

insert into public.profiles (
  name,
  email,
  phone,
  social_handle,
  vetting_answers,
  status,
  role
)
values (
  'Velvet Root Admin',
  'admin@thevelvetroot.co',
  null,
  '@thevelvetroot',
  jsonb_build_object('seeded', true, 'source', 'schema'),
  'active',
  'admin'
)
on conflict (email) do update
set
  name = excluded.name,
  status = excluded.status,
  role = excluded.role,
  social_handle = excluded.social_handle;
