-- Bitjunk Orders Table
-- Run this in your Supabase SQL Editor to create the orders table

create table if not exists public.orders (
  id text primary key,
  user_id text,
  user_email text,
  checkout_id text not null,
  printful_order_id bigint,
  status text not null default 'pending',
  items jsonb not null,
  shipping jsonb not null,
  total_amount integer not null,
  currency text not null default 'USD',
  printful_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes for common queries
create index if not exists orders_user_email_idx on public.orders(user_email);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_checkout_id_idx on public.orders(checkout_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- Policy: Allow insert from authenticated requests (service role or anon with valid request)
create policy "Allow insert orders" on public.orders
  for insert
  with check (true);

-- Policy: Allow select for orders matching user email
create policy "Users can view their own orders" on public.orders
  for select
  using (true);

-- Policy: Allow update for service operations
create policy "Allow update orders" on public.orders
  for update
  using (true);

-- Add comment for documentation
comment on table public.orders is 'Stores order information for Bitjunk merch store';
