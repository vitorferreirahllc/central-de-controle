-- Rode este script no SQL Editor do seu projeto Supabase (https://app.supabase.com)

create table if not exists clients (
  id bigint generated always as identity primary key,
  name text not null unique
);

insert into clients (name) values
  ('From Brazil'),
  ('Zaatar'),
  ('H SPOT | Picollo Pizza'),
  ('Sagrado Café'),
  ('K''Delícia'),
  ('DaToni Pronto'),
  ('Empório Brazilian Grill'),
  ('That''s Bananas')
on conflict (name) do nothing;

create table if not exists delivery_entries (
  id bigint generated always as identity primary key,
  client_id bigint not null references clients (id) on delete cascade,
  month_ref text not null,
  week_number smallint not null check (week_number between 1 and 5),
  start_date date not null,
  end_date date not null,
  revenue numeric(12, 2) not null default 0,
  orders integer not null default 0,
  promo_investment numeric(12, 2) not null default 0,
  new_customers integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists meta_ads_entries (
  id bigint generated always as identity primary key,
  client_id bigint not null references clients (id) on delete cascade,
  month_ref text not null,
  week_number smallint not null check (week_number between 1 and 5),
  start_date date not null,
  end_date date not null,
  invested numeric(12, 2) not null default 0,
  results integer not null default 0,
  revenue_generated numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

alter table clients enable row level security;
alter table delivery_entries enable row level security;
alter table meta_ads_entries enable row level security;

create policy "Authenticated users can read clients"
  on clients for select to authenticated using (true);

create policy "Authenticated users can read delivery_entries"
  on delivery_entries for select to authenticated using (true);
create policy "Authenticated users can insert delivery_entries"
  on delivery_entries for insert to authenticated with check (true);
create policy "Authenticated users can delete delivery_entries"
  on delivery_entries for delete to authenticated using (true);

create policy "Authenticated users can read meta_ads_entries"
  on meta_ads_entries for select to authenticated using (true);
create policy "Authenticated users can insert meta_ads_entries"
  on meta_ads_entries for insert to authenticated with check (true);
create policy "Authenticated users can delete meta_ads_entries"
  on meta_ads_entries for delete to authenticated using (true);
