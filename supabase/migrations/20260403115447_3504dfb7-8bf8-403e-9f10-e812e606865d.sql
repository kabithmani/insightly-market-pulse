create table public.coverage_requests (
  id uuid primary key default gen_random_uuid(),
  location_name text not null,
  lat double precision not null,
  lng double precision not null,
  email text,
  created_at timestamptz default now()
);

alter table public.coverage_requests enable row level security;

create policy "Anyone can request coverage"
  on public.coverage_requests
  for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can view requests"
  on public.coverage_requests
  for select
  to authenticated
  using (true);