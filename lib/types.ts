export type Client = {
  id: number;
  name: string;
};

export type DeliveryEntry = {
  id: number;
  client_id: number;
  month_ref: string;
  week_number: number;
  start_date: string;
  end_date: string;
  revenue: number;
  orders: number;
  promo_investment: number;
  rating: number | null;
  payout: number | null;
  notes: string | null;
  clients: { name: string } | null;
};

export type MetaAdsEntry = {
  id: number;
  client_id: number;
  month_ref: string;
  week_number: number;
  start_date: string;
  end_date: string;
  invested: number;
  results: number;
  revenue_generated: number;
  notes: string | null;
  clients: { name: string } | null;
};

export type Status = "Onboarding" | "Operando" | "Pausado" | "Encerrado";
export type Risco = "Baixo" | "Médio" | "Alto";

export type ClientStatus = {
  id: number;
  client_name: string;
  data_entrada: string | null;
  semana_projeto: string | null;
  responsavel: string | null;
  status: Status;
  proxima_entrega: string | null;
  risco: Risco;
  updated_at: string;
};
