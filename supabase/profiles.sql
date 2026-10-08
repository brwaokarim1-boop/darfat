-- Derfet: profiles table, auto-create trigger, role protection and RLS.
-- Run this once in Supabase -> SQL Editor. Safe to run again.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  city text,
  age int,
  interests text[],
  skills text[],
  availability text,
  bio text,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_blocked boolean not null default false,
  is_discoverable boolean not null default true,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- If the table already existed, make sure every column is there.
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists age int;
alter table public.profiles add column if not exists interests text[];
alter table public.profiles add column if not exists skills text[];
alter table public.profiles add column if not exists availability text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists is_blocked boolean not null default false;
alter table public.profiles add column if not exists is_discoverable boolean not null default true;
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

-- Is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Create a profile row automatically when someone registers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Non-admins cannot change role or is_blocked on their own profile.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.is_blocked := old.is_blocked;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- Row Level Security
alter table public.profiles enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles: update own or admin" on public.profiles;
create policy "profiles: update own or admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- Backfill profiles for users who registered before this script ran.
insert into public.profiles (id, full_name)
select u.id, u.raw_user_meta_data ->> 'full_name'
from auth.users u
on conflict (id) do nothing;
