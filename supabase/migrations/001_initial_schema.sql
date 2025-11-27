-- NextQuest Initial Schema
-- Run this in Supabase SQL Editor

-- Users table
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  avatar_url text,
  level int not null default 1,
  xp int not null default 0,
  current_streak int not null default 0,
  last_activity_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Programs (learning programs/courses)
create table programs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default false,
  category text,
  ai_generated boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Steps (tasks within a program)
create table steps (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  order_index int not null,
  title text not null,
  content text,
  resource_url text,
  estimated_minutes int,
  created_at timestamptz default now(),
  constraint unique_program_order unique(program_id, order_index)
);

-- Enrollments (user program subscriptions)
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  program_id uuid references programs(id) on delete cascade,
  status text check (status in ('active','completed','dropped')) not null default 'active',
  started_at timestamptz default now(),
  completed_at timestamptz,
  constraint unique_user_program unique(user_id, program_id)
);

-- Progress (step completion tracking)
create table progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references enrollments(id) on delete cascade,
  step_id uuid references steps(id) on delete cascade,
  is_completed boolean not null default false,
  completed_at timestamptz,
  constraint unique_enrollment_step unique(enrollment_id, step_id)
);

-- Badges (achievement definitions)
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  image_url text,
  condition_type text,
  rarity text check (rarity in ('common','rare','epic','legendary')) default 'common',
  created_at timestamptz default now()
);

-- User badges (awarded achievements)
create table user_badges (
  user_id uuid references users(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  awarded_at timestamptz default now(),
  primary key (user_id, badge_id)
);

-- Certificates (paid digital credentials)
create table certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  program_id uuid references programs(id) on delete cascade,
  issued_at timestamptz default now(),
  verification_code text not null unique,
  payment_status text check (payment_status in ('pending','paid','refunded')) default 'pending'
);

-- Indexes for performance
create index idx_programs_creator on programs(creator_id);
create index idx_programs_public on programs(is_public) where is_public = true;
create index idx_steps_program on steps(program_id, order_index);
create index idx_enrollments_user on enrollments(user_id);
create index idx_enrollments_program on enrollments(program_id);
create index idx_progress_enrollment on progress(enrollment_id);
create index idx_user_badges_user on user_badges(user_id);

-- Row Level Security (RLS) Policies
alter table users enable row level security;
alter table programs enable row level security;
alter table steps enable row level security;
alter table enrollments enable row level security;
alter table progress enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table certificates enable row level security;

-- Users: can read own data, insert/update own record
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

-- Programs: public programs readable by all, creators can manage own
create policy "Public programs are viewable by everyone"
  on programs for select
  using (is_public = true or creator_id = auth.uid());

create policy "Users can create programs"
  on programs for insert
  with check (creator_id = auth.uid());

create policy "Users can update own programs"
  on programs for update
  using (creator_id = auth.uid());

-- Steps: readable if program is accessible
create policy "Steps viewable if program is accessible"
  on steps for select
  using (
    exists (
      select 1 from programs
      where programs.id = steps.program_id
      and (programs.is_public = true or programs.creator_id = auth.uid())
    )
  );

-- Enrollments: users manage own enrollments
create policy "Users can view own enrollments"
  on enrollments for select
  using (user_id = auth.uid());

create policy "Users can create enrollments"
  on enrollments for insert
  with check (user_id = auth.uid());

create policy "Users can update own enrollments"
  on enrollments for update
  using (user_id = auth.uid());

-- Progress: users manage own progress
create policy "Users can view own progress"
  on progress for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.id = progress.enrollment_id
      and enrollments.user_id = auth.uid()
    )
  );

create policy "Users can update own progress"
  on progress for insert
  with check (
    exists (
      select 1 from enrollments
      where enrollments.id = progress.enrollment_id
      and enrollments.user_id = auth.uid()
    )
  );

create policy "Users can modify own progress"
  on progress for update
  using (
    exists (
      select 1 from enrollments
      where enrollments.id = progress.enrollment_id
      and enrollments.user_id = auth.uid()
    )
  );

-- Badges: readable by all
create policy "Badges are viewable by everyone"
  on badges for select
  to authenticated
  using (true);

-- User badges: users see own badges
create policy "Users can view own badges"
  on user_badges for select
  using (user_id = auth.uid());

-- Certificates: users see own certificates
create policy "Users can view own certificates"
  on certificates for select
  using (user_id = auth.uid());

-- Updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_programs_updated_at
  before update on programs
  for each row
  execute function update_updated_at_column();
