-- ============================================================
-- Roommate Matcher — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── profiles ──────────────────────────────────────────────────────────────────
-- One row per student. Created automatically when they sign up via Supabase Auth.
-- Admin flag is set manually by the hostel admin account.

create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null,
  matric_number   text unique not null,
  gender          text not null check (gender in ('male', 'female')),
  is_admin        boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Automatically create a profile row when a new user signs up.
-- The app passes full_name, matric_number, gender as user_metadata on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, matric_number, gender)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'matric_number',
    new.raw_user_meta_data->>'gender'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── allocation_settings ────────────────────────────────────────────────────────
-- Single-row table the admin uses to open/close the intake window and set
-- room capacity. Use a check constraint to keep it to one row.

create table public.allocation_settings (
  id              int primary key default 1 check (id = 1),
  intake_open     boolean not null default false,
  room_capacity   int not null default 4 check (room_capacity between 2 and 6),
  academic_year   text not null default '',   -- e.g. '2024/2025'
  updated_at      timestamptz not null default now()
);

-- Seed the single settings row
insert into public.allocation_settings (id, intake_open, room_capacity, academic_year)
values (1, false, 4, '2024/2025');


-- ── preference_responses ───────────────────────────────────────────────────────
-- One row per student per intake round. Stores all 22 question answers and
-- 9 importance ratings as JSONB for flexibility.
-- dealbreakers is an array of at most 2 dealbreaker IDs (e.g. ['D1', 'D3']).

create table public.preference_responses (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  academic_year   text not null,
  answers         jsonb not null default '{}',   -- { sleep_1: 2, noise_2: 0, ... }
  importance      jsonb not null default '{}',   -- { imp_sleep: 2, imp_noise: 3, ... }
  dealbreakers    text[] not null default '{}' check (array_length(dealbreakers, 1) <= 2),
  submitted_at    timestamptz not null default now(),
  unique (user_id, academic_year)
);


-- ── room_groups ────────────────────────────────────────────────────────────────
-- Each row is a matched room. avg_compatibility is stored after the algorithm
-- runs so the admin can review scores without recomputing.

create table public.room_groups (
  id                  uuid primary key default uuid_generate_v4(),
  academic_year       text not null,
  room_label          text,                        -- e.g. 'Block A / Room 12'
  avg_compatibility   numeric(5,2),                -- 0.00 – 100.00
  matched_via_fallback boolean not null default false,
  created_at          timestamptz not null default now()
);


-- ── room_group_members ─────────────────────────────────────────────────────────
-- Junction table linking students to their assigned room.

create table public.room_group_members (
  id          uuid primary key default uuid_generate_v4(),
  room_id     uuid not null references public.room_groups(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  unique (user_id, room_id)
);


-- ── Row Level Security ─────────────────────────────────────────────────────────

alter table public.profiles              enable row level security;
alter table public.allocation_settings   enable row level security;
alter table public.preference_responses  enable row level security;
alter table public.room_groups           enable row level security;
alter table public.room_group_members    enable row level security;


-- profiles
-- Students can read and update only their own profile.
-- Admins can read all profiles.

create policy "student: read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "student: update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "admin: read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- allocation_settings
-- Everyone can read (so the intake form can show open/closed state).
-- Only admins can update.

create policy "anyone: read settings"
  on public.allocation_settings for select
  using (true);

create policy "admin: update settings"
  on public.allocation_settings for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- preference_responses
-- Students can insert and read only their own response.
-- Admins can read all responses (needed for the matching engine).

create policy "student: insert own response"
  on public.preference_responses for insert
  with check (auth.uid() = user_id);

create policy "student: read own response"
  on public.preference_responses for select
  using (auth.uid() = user_id);

create policy "student: update own response"
  on public.preference_responses for update
  using (auth.uid() = user_id);

create policy "admin: read all responses"
  on public.preference_responses for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- room_groups
-- Students can read their own room group (via room_group_members join).
-- Admins can do everything.

create policy "student: read own room group"
  on public.room_groups for select
  using (
    exists (
      select 1 from public.room_group_members m
      where m.room_id = id and m.user_id = auth.uid()
    )
  );

create policy "admin: all on room_groups"
  on public.room_groups for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- room_group_members
-- Students can read only the membership rows for their own room.
-- Admins can do everything.

create policy "student: read own membership"
  on public.room_group_members for select
  using (auth.uid() = user_id);

create policy "admin: all on room_group_members"
  on public.room_group_members for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );
