-- Helper function to check if current user is an admin without triggering RLS recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

-- Drop recursive policies
drop policy if exists "Admins can manage all profiles" on public.profiles;
drop policy if exists "Admins can manage all settings" on public.settings;

-- Re-create policies using the security definer function
create policy "Admins can manage all profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage all settings"
on public.settings for all
using (public.is_admin())
with check (public.is_admin());
