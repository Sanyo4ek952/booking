create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  room_id text not null check (room_id in ('room-1', 'room-2', 'room-3', 'room-4')),
  guest_name text not null,
  phone text not null,
  check_in date not null,
  check_out date not null,
  amount numeric not null default 0,
  status text not null check (status in ('reserved', 'paid', 'living', 'checked_out')),
  comment text,
  created_at timestamptz not null default now(),
  constraint bookings_dates_check check (check_out > check_in)
);

create index if not exists bookings_room_dates_idx
  on public.bookings (room_id, check_in, check_out);

alter table public.bookings enable row level security;

create policy "Public can read bookings"
  on public.bookings
  for select
  using (true);

-- Для мини-приложения без авторизации админ-зона использует anon key.
-- В production замените эти политики на authenticated/admin-only доступ.
create policy "Anon can insert bookings"
  on public.bookings
  for insert
  with check (true);

create policy "Anon can update bookings"
  on public.bookings
  for update
  using (true)
  with check (true);

create policy "Anon can delete bookings"
  on public.bookings
  for delete
  using (true);

alter publication supabase_realtime add table public.bookings;
