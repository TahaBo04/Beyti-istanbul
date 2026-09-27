-- Run once in the SQL editor of a NEW project dedicated to this site.
-- Auth > Providers: disable public self-signup; create/invite only three users.
create table if not exists public.team_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  person text not null check (person in ('nouhayla','kaoutar','abderahim')),
  unique (person)
);
alter table public.team_profiles enable row level security;
revoke all on public.team_profiles from anon;
grant select on public.team_profiles to authenticated;
create policy "Team members can read only their own profile"
  on public.team_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

-- After creating the three Auth users, add their real IDs below, one at a time:
-- insert into public.team_profiles(user_id, person) values ('UUID_OF_NOUHAYLA', 'nouhayla');
-- insert into public.team_profiles(user_id, person) values ('UUID_OF_KAOUTAR', 'kaoutar');
-- insert into public.team_profiles(user_id, person) values ('UUID_OF_ABDERAHIM', 'abderahim');
