-- Rode no SQL Editor do Supabase para adicionar o controle de Semana do Projeto / Saúde do Cliente

create table if not exists client_status (
  id bigint generated always as identity primary key,
  client_name text not null,
  data_entrada date,
  semana_projeto text,
  responsavel text,
  status text not null default 'Operando' check (status in ('Onboarding', 'Operando', 'Pausado', 'Encerrado')),
  proxima_entrega text,
  risco text not null default 'Baixo' check (risco in ('Baixo', 'Médio', 'Alto')),
  updated_at timestamptz not null default now()
);

alter table client_status enable row level security;

create policy "Authenticated users can read client_status"
  on client_status for select to authenticated using (true);
create policy "Authenticated users can insert client_status"
  on client_status for insert to authenticated with check (true);
create policy "Authenticated users can update client_status"
  on client_status for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete client_status"
  on client_status for delete to authenticated using (true);

insert into client_status (client_name, data_entrada, semana_projeto, responsavel, status, proxima_entrega, risco) values
  ('Datoni', '2026-04-08', 'S20', 'Vitor', 'Operando', 'Marcas rodando/Melhorar Vendas/ajustar meta ads', 'Baixo'),
  ('That''s Bananas', '2026-04-08', 'S20', 'Vitor', 'Operando', 'Ajustar Meta ads/ajustar doordash/Melhorar vendas', 'Alto'),
  ('From Brazil', '2026-05-11', 'S15', 'Vitor', 'Operando', 'Ajustar Meta ads/Marcas rodando/Melhorar vendas', 'Médio'),
  ('Bento''s', '2026-05-06', 'S16', 'Vitor', 'Operando', 'Vender meta ads', 'Alto'),
  ('Empório INC', '2026-06-01', 'S12', 'Vitor', 'Operando', 'New Brand, melhorias delivery', 'Baixo'),
  ('Sagrado Café', '2026-06-22', 'S9', 'Enzo Borges', 'Operando', 'Melhorias delivery, subir criativos', 'Baixo'),
  ('Zaatar', '2026-06-29', 'S8', 'Enzo Borges', 'Onboarding', 'Análise meta ads, melhorias delivery', 'Baixo');
