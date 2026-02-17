-- Enforce NOT NULL on dealer_id
alter table public.cars alter column dealer_id set not null;

-- Add indexes for performance
create index if not exists idx_cars_dealer_id on public.cars(dealer_id);
create index if not exists idx_cars_updated_at on public.cars(updated_at);

alter table public.cars add column if not exists updated_at timestamptz default now();

-- Add plate fields and unique constraint
alter table public.cars add column if not exists plate_number text;
alter table public.cars add column if not exists plate_verified boolean default false;
alter table public.cars add column if not exists plate_confidence float;
alter table public.cars add column if not exists image_ocr_text text;
alter table public.cars add constraint if not exists unique_plate unique (plate_number);

-- enable row level security
alter table public.cars enable row level security;

-- Example policy: Only allow dealers to insert/update/delete their own cars
create policy "Dealers can manage own cars" on public.cars
  for all
  using (auth.uid() = dealer_id)
  with check (auth.uid() = dealer_id);

-- Example policy: Public can select cars
create policy "Public can view cars" on public.cars
  for select
  using (true);
