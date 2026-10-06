-- Adiciona o produto/linha de negócio de cada cliente (Food Growth, Food Scale, Food Spot, Food Foundation)

alter table client_status
  add column if not exists produto text check (produto in ('Food Growth', 'Food Scale', 'Food Spot', 'Food Foundation'));
