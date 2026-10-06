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
export type Produto = "Food Growth" | "Scale" | "Spot";

export type ClientContract = {
  id: number;
  client_status_id: number;
  produto: string;
  data_inicio: string;
  data_fim: string;
  resumo: string | null;
  client_status: { client_name: string } | null;
};

export type ClientStatus = {
  id: number;
  client_name: string;
  data_entrada: string | null;
  responsavel: string | null;
  status: Status;
  proxima_entrega: string | null;
  risco: Risco;
  produto: Produto | null;
  updated_at: string;
};
