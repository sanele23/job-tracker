-- ============================================================
-- 002: User profiles + career progress
-- ============================================================

-- 1. Profiles table
create table if not exists public.profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null default '',
  experience_level text not null default 'student',
  "current_role"  text not null default '',
  education_field text not null default 'none',
  interests     text[] not null default '{}',
  weekly_learning_hours integer not null default 5,
  budget_preference text not null default 'free-only',
  has_completed_onboarding boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint profiles_user_id_unique unique (user_id)
);

-- 2. Career progress table
create table if not exists public.user_career_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  target_role_id     text,
  completed_skill_ids text[] not null default '{}',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint career_progress_user_id_unique unique (user_id)
);

-- ────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.user_career_progress enable row level security;

-- Profiles: users can only access their own row
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Career progress: users can only access their own row
create policy "Users can view own career progress"
  on public.user_career_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own career progress"
  on public.user_career_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own career progress"
  on public.user_career_progress for update
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────
-- Auto-update updated_at
-- ────────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger career_progress_updated_at
  before update on public.user_career_progress
  for each row execute function public.handle_updated_at();
