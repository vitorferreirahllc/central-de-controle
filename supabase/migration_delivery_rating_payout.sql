-- Adiciona avaliação média e repasse líquido aos lançamentos de Delivery Apps

alter table delivery_entries
  add column if not exists rating numeric(2, 1),
  add column if not exists payout numeric(12, 2);
