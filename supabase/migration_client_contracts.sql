-- Contratos por cliente: produto contratado, início e término (para acompanhar prazo restante)

create table if not exists client_contracts (
  id bigint generated always as identity primary key,
  client_status_id bigint not null unique references client_status(id) on delete cascade,
  produto text not null,
  data_inicio date not null,
  data_fim date not null,
  resumo text,
  created_at timestamptz not null default now(),
  check (data_fim >= data_inicio)
);

alter table client_contracts enable row level security;

create policy "Authenticated users can read client_contracts"
  on client_contracts for select to authenticated using (true);
create policy "Authenticated users can insert client_contracts"
  on client_contracts for insert to authenticated with check (true);
create policy "Authenticated users can update client_contracts"
  on client_contracts for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete client_contracts"
  on client_contracts for delete to authenticated using (true);
