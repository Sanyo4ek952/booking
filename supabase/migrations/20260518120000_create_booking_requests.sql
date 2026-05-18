create extension if not exists "pgcrypto";

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new', 'processed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  telegram_sent boolean not null default false,
  telegram_error text,
  room_id text not null check (room_id in ('room-1', 'room-2', 'room-3', 'room-4')),
  room_name text not null,
  guests integer not null check (guests > 0),
  guest_name text not null,
  phone text not null,
  check_in date not null,
  check_out date not null,
  nights integer not null check (nights > 0),
  amount numeric,
  nightly_price numeric,
  comment text,
  source text not null default 'website',
  constraint booking_requests_dates_check check (check_out > check_in)
);

create index if not exists booking_requests_created_at_idx
  on public.booking_requests (created_at desc);

create index if not exists booking_requests_room_dates_idx
  on public.booking_requests (room_id, check_in, check_out);

create or replace function public.set_booking_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists booking_requests_set_updated_at on public.booking_requests;

create trigger booking_requests_set_updated_at
before update on public.booking_requests
for each row
execute function public.set_booking_requests_updated_at();

alter table public.booking_requests enable row level security;

comment on table public.booking_requests is 'Guest booking requests created through the public website and processed via Edge Function.';
