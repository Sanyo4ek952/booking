alter table public.booking_requests
  add column if not exists client_ip text,
  add column if not exists user_agent text;

create index if not exists booking_requests_client_ip_created_at_idx
  on public.booking_requests (client_ip, created_at desc)
  where client_ip is not null;

comment on column public.booking_requests.client_ip is 'Client IP captured by the booking request Edge Function for anti-spam rate limiting.';
comment on column public.booking_requests.user_agent is 'User-Agent captured by the booking request Edge Function for anti-spam diagnostics.';
