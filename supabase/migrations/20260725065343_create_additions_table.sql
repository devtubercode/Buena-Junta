create table if not exists public.additions (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  price int4,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  product_id uuid,
  image_path text
);

alter table public.additions enable row level security;

create policy "Public can read additions"
  on public.additions
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert additions"
  on public.additions
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update additions"
  on public.additions
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete additions"
  on public.additions
  for delete
  to authenticated
  using (true);
