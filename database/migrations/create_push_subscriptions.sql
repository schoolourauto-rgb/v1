-- Migration: Create push_subscriptions table
CREATE TABLE push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  dealer_id uuid references dealers(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamp default now()
);
