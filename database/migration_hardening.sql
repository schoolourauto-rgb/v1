
-- PHASE 7: RLS for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
	ON profiles FOR SELECT
	USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
	ON profiles FOR UPDATE
	USING (auth.uid() = id);
-- PHASE 1: Add credit and referral fields to profiles table
alter table profiles add column if not exists referral_code text unique;
alter table profiles add column if not exists referred_by uuid references profiles(id);
alter table profiles add column if not exists future_ad_credits int not null default 0;
alter table profiles add column if not exists hot_deal_credits int not null default 0;
alter table profiles add column if not exists total_listings int not null default 0;

-- PHASE 1: Create referral_rewards table
create table if not exists referral_rewards (
	id uuid default gen_random_uuid() primary key,
	referrer_id uuid references profiles(id) on delete cascade,
	referred_id uuid references profiles(id) on delete cascade,
	created_at timestamp with time zone default now(),
	unique (referrer_id, referred_id)
);
-- Enforce NOT NULL and constraints for cars and dealers
ALTER TABLE cars ALTER COLUMN make SET NOT NULL;
ALTER TABLE cars ALTER COLUMN model SET NOT NULL;
ALTER TABLE cars ALTER COLUMN price SET NOT NULL;
ALTER TABLE cars ALTER COLUMN dealer_id SET NOT NULL;
ALTER TABLE cars ALTER COLUMN city_id SET NOT NULL;
ALTER TABLE cars ALTER COLUMN fuel_type SET NOT NULL;
ALTER TABLE cars ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;
ALTER TABLE cars ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE dealers ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;
ALTER TABLE dealers ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE dealers ALTER COLUMN user_id SET NOT NULL;
