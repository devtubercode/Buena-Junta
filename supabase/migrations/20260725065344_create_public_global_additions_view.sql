alter table public.additions enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'additions'
      and policyname = 'Public can read global additions'
  ) then
    create policy "Public can read global additions"
      on public.additions
      for select
      to anon, authenticated
      using (product_id is null);
  end if;
end
$$;

create or replace view public.public_global_additions as
select
  id,
  product_id,
  name,
  description,
  price,
  image_path,
  created_at,
  updated_at
from public.additions
where product_id is null;

grant select on public.public_global_additions to anon, authenticated;
