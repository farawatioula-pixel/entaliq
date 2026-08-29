-- Run this once in your Supabase project's SQL Editor
-- (Project → SQL Editor → New query → paste this whole file → Run)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  headline text not null default '',
  bio text not null default '',
  location text not null default '',
  contact text not null default '',
  category text not null default 'SELL' check (category in ('SELL', 'CREATE', 'BUILD')),
  avatar_url text not null default '',
  portfolio_images jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- If you already created this table before avatar_url/portfolio_images existed,
-- these add the missing columns without touching your existing data.
alter table public.profiles add column if not exists avatar_url text not null default '';
alter table public.profiles add column if not exists portfolio_images jsonb not null default '[]'::jsonb;

alter table public.profiles enable row level security;

-- Anyone (including logged-out visitors) can read all profiles — this powers the public directory.
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Users can only insert/update/delete their own profile row.
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Automatically create an empty profile row the moment someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
