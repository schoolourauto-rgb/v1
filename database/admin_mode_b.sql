-- STEP 1: ADMIN DATABASE LAYER

-- 1️⃣ Create admin_users
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('super_admin', 'support_admin')),
  created_at timestamp default now()
);

-- 2️⃣ Create activity_logs
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid references dealers(id) on delete cascade,
  user_id uuid,
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  ip_hash text,
  created_at timestamp default now()
);

-- Indexes
create index if not exists idx_activity_dealer on activity_logs(dealer_id);
create index if not exists idx_activity_created on activity_logs(created_at desc);

-- Add is_suspended to dealers
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='dealers' and column_name='is_suspended') then
    alter table dealers add column is_suspended boolean default false;
  end if;
end$$;
