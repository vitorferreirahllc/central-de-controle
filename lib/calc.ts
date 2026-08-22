export function ticketMedio(revenue: number, orders: number): number {
  return orders > 0 ? revenue / orders : 0;
}

export function custoPorResultado(invested: number, results: number): number {
  return results > 0 ? invested / results : 0;
}

export function roas(revenueGenerated: number, invested: number): number {
  return invested > 0 ? revenueGenerated / invested : 0;
}

export function cac(invested: number, results: number): number {
  return results > 0 ? invested / results : 0;
}

export function statusRoas(roasValue: number): string {
  if (roasValue <= 0) return "-";
  if (roasValue >= 8) return "Excelente";
  if (roasValue >= 4) return "Bom";
  if (roasValue >= 2) return "Regular";
  return "Ruim";
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function projectWeekAndMonth(
  dataEntrada: string | null,
  now: Date = new Date(),
): { semana: number; mes: number } | null {
  if (!dataEntrada) return null;

  const entrada = new Date(dataEntrada + "T00:00:00");
  const diffDays = Math.floor(
    (now.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) return { semana: 1, mes: 1 };

  const semana = Math.floor(diffDays / 7) + 1;
  const mes = Math.floor(diffDays / 30) + 1;
  return { semana, mes };
}

export function formatProjectWeek(dataEntrada: string | null): string {
  const result = projectWeekAndMonth(dataEntrada);
  if (!result) return "-";
  return `S${result.semana} · Mês ${result.mes}`;
}
