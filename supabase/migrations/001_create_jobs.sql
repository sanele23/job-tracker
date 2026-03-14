-- ============================================================
-- Job Tracker – Supabase schema
-- Run this in the Supabase SQL Editor once you connect the app.
-- ============================================================

create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  company     text not null,
  role        text not null,
  salary_min  integer,
  salary_max  integer,
  status      text not null default 'wishlist'
                check (status in ('wishlist','applied','interview','offer','rejected')),
  date_applied date,
  notes       text,
  contact_name  text,
  contact_email text,
  url         text,
  tags        text[] default '{}',
  position    integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Row-level security: every user sees only their own data
alter table public.jobs enable row level security;

create policy "Users can view own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_jobs_update
  before update on public.jobs
  for each row execute function public.handle_updated_at();
