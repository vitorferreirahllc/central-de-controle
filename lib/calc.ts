export function ticketMedio(revenue: number, orders: number): number {
  return orders > 0 ? revenue / orders : 0;
}

export function custoPorResultado(invested: number, results: number): number {
  return results > 0 ? invested / results : 0;
}

export function roas(revenueGenerated: number, invested: number): number {
  return invested > 0 ? revenueGenerated / invested : 0;
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

const MONTH_ORDER: Record<string, number> = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

/**
 * "Agosto/2026" e "Setembro/2026" ordenam certo por acaso em ordem
 * alfabética simples, mas meses em português não seguem ordem alfabética
 * (ex.: "Julho" vem depois de "Agosto" no alfabeto, mas antes no calendário).
 * Essa chave garante ordenação cronológica real.
 */
export function monthRefSortKey(monthRef: string): string {
  const [monthName, year] = monthRef.split("/");
  const monthNumber = MONTH_ORDER[monthName?.trim().toLowerCase() ?? ""] ?? 0;
  return `${(year ?? "0000").trim()}-${String(monthNumber).padStart(2, "0")}`;
}

export function sortMonthRefs(monthRefs: string[]): string[] {
  return [...monthRefs].sort((a, b) =>
    monthRefSortKey(a).localeCompare(monthRefSortKey(b)),
  );
}
