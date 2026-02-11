
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city);
CREATE INDEX IF NOT EXISTS idx_leads_seller_id ON leads(seller_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Production-grade profiles table
create table profiles (
	id uuid references auth.users on delete cascade primary key,
	role text check (role in ('admin','dealer','user')) default 'user',
	created_at timestamp with time zone default now()
);

-- Dealer table
create table dealers (
	id uuid default gen_random_uuid() primary key,
	user_id uuid references auth.users on delete cascade,
	dealership_name text not null,
	phone text,
	location text,
	verified boolean default false,
	created_at timestamp with time zone default now()
);

-- Cars table
create table cars (
	id uuid default gen_random_uuid() primary key,
	dealer_id uuid references dealers(id) on delete cascade,
	title text not null,
	brand text,
	model text,
	year int,
	price numeric,
	fuel_type text,
	transmission text,
	mileage int,
	images text[],
	created_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table dealers enable row level security;
alter table cars enable row level security;

-- Dealer manages own cars
create policy "Dealer manages own cars"
on cars
for all
using (
	dealer_id in (
		select id from dealers where user_id = auth.uid()
	)
);

-- Public can view cars
create policy "Public can view cars"
on cars
for select
using (true);
