grant usage on schema public to anon, authenticated, service_role;

grant all on public.profiles to service_role;
grant all on public.settings to service_role;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.settings to authenticated;

grant select on public.profiles to anon;
grant select on public.settings to anon;
