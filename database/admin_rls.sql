-- Add is_suspended to dealers if not exists
alter table dealers add column if not exists is_suspended boolean default false;

-- Block login if suspended (example policy)
create or replace function public.dealer_can_login(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from dealers where user_id = dealer_can_login.user_id and not is_suspended
  );
end;
$$ language plpgsql security definer;

-- Example RLS for dealers table
alter table dealers enable row level security;
create policy "Admins and owner can access" on dealers
  for select using (
    (auth.uid() = user_id) or
    (exists (select 1 from admin_users where user_id = auth.uid()))
  );

-- Admins can update any dealer
create policy "Admins can update" on dealers
  for update using (
    exists (select 1 from admin_users where user_id = auth.uid())
  );

-- Only owner can update their own dealer row
create policy "Owner can update own" on dealers
  for update using (
    auth.uid() = user_id
  );
