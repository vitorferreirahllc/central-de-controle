-- Adiciona o produto/linha de negócio de cada cliente (Food Growth, Scale, Spot)

alter table client_status
  add column if not exists produto text check (produto in ('Food Growth', 'Scale', 'Spot'));
