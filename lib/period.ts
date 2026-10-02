import { sortMonthRefs } from "@/lib/calc";

export type PeriodOption =
  | "esta_semana"
  | "semana_anterior"
  | "ultimas_4_semanas"
  | "este_mes"
  | "mes_anterior";

export const PERIOD_OPTIONS: { value: PeriodOption; label: string }[] = [
  { value: "esta_semana", label: "Esta semana" },
  { value: "semana_anterior", label: "Semana anterior" },
  { value: "ultimas_4_semanas", label: "Últimas 4 semanas" },
  { value: "este_mes", label: "Este mês" },
  { value: "mes_anterior", label: "Mês anterior" },
];

const MONTH_ABBR = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function formatShortDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${MONTH_ABBR[d.getMonth()]}`;
}

export function formatPeriodLabel(startDate: string, endDate: string): string {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = sameMonth
    ? String(start.getDate())
    : `${start.getDate()} ${MONTH_ABBR[start.getMonth()]}`;
  return `${startLabel}–${end.getDate()} ${MONTH_ABBR[end.getMonth()]} ${end.getFullYear()}`;
}

type WeekRow = { start_date: string; end_date: string; month_ref: string };

function distinctWeeks(rows: WeekRow[]): { start_date: string; end_date: string }[] {
  const map = new Map<string, string>();
  for (const r of rows) map.set(r.start_date, r.end_date);
  return Array.from(map.entries())
    .map(([start_date, end_date]) => ({ start_date, end_date }))
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}

export type PeriodBuckets = {
  /** start_date das semanas que compõem o período atual. */
  currentStartDates: Set<string>;
  /** start_date das semanas do período de comparação, ou null se não houver. */
  previousStartDates: Set<string> | null;
  currentLabel: string;
  previousLabel: string | null;
};

const EMPTY_BUCKETS: PeriodBuckets = {
  currentStartDates: new Set(),
  previousStartDates: null,
  currentLabel: "Sem dados",
  previousLabel: null,
};

export function resolvePeriod(
  option: PeriodOption,
  rows: WeekRow[],
): PeriodBuckets {
  const weeks = distinctWeeks(rows);

  if (option === "esta_semana" || option === "semana_anterior") {
    const offset = option === "esta_semana" ? 1 : 2;
    if (weeks.length < offset) return EMPTY_BUCKETS;
    const cur = weeks[weeks.length - offset];
    const prev = weeks.length >= offset + 1 ? weeks[weeks.length - offset - 1] : null;
    return {
      currentStartDates: new Set([cur.start_date]),
      previousStartDates: prev ? new Set([prev.start_date]) : null,
      currentLabel: formatPeriodLabel(cur.start_date, cur.end_date),
      previousLabel: prev ? formatPeriodLabel(prev.start_date, prev.end_date) : null,
    };
  }

  if (option === "ultimas_4_semanas") {
    if (weeks.length === 0) return EMPTY_BUCKETS;
    const curWeeks = weeks.slice(-4);
    const prevWeeks = weeks.slice(
      Math.max(0, weeks.length - 8),
      weeks.length - curWeeks.length,
    );
    return {
      currentStartDates: new Set(curWeeks.map((w) => w.start_date)),
      previousStartDates: prevWeeks.length
        ? new Set(prevWeeks.map((w) => w.start_date))
        : null,
      currentLabel: `${formatShortDate(curWeeks[0].start_date)} – ${formatShortDate(curWeeks[curWeeks.length - 1].end_date)}`,
      previousLabel: prevWeeks.length
        ? `${formatShortDate(prevWeeks[0].start_date)} – ${formatShortDate(prevWeeks[prevWeeks.length - 1].end_date)}`
        : null,
    };
  }

  // "este_mes" | "mes_anterior"
  const months = sortMonthRefs(Array.from(new Set(rows.map((r) => r.month_ref))));
  const offset = option === "este_mes" ? 1 : 2;
  const idx = months.length - offset;
  if (idx < 0) return EMPTY_BUCKETS;

  const curMonth = months[idx];
  const prevMonth = idx - 1 >= 0 ? months[idx - 1] : null;
  const curStartDates = new Set(
    rows.filter((r) => r.month_ref === curMonth).map((r) => r.start_date),
  );
  const prevStartDates = prevMonth
    ? new Set(rows.filter((r) => r.month_ref === prevMonth).map((r) => r.start_date))
    : null;

  return {
    currentStartDates: curStartDates,
    previousStartDates: prevStartDates && prevStartDates.size ? prevStartDates : null,
    currentLabel: curMonth,
    previousLabel: prevMonth,
  };
}

export type DeliveryAggregate = {
  revenue: number;
  orders: number;
  promoInvestment: number;
  payout: number;
  rating: number | null;
};

/** Agrega os lançamentos de um cliente dentro de um conjunto de semanas (start_date). Retorna null se o cliente não tiver nenhum lançamento nesse conjunto (em vez de zeros enganosos). */
export function aggregateDelivery<
  T extends {
    start_date: string;
    revenue: number;
    orders: number;
    promo_investment: number;
    payout: number | null;
    rating: number | null;
  },
>(rows: T[], startDates: Set<string>): DeliveryAggregate | null {
  const matched = rows.filter((r) => startDates.has(r.start_date));
  if (matched.length === 0) return null;

  const ratings = matched.map((r) => r.rating).filter((v): v is number => v != null);

  return {
    revenue: matched.reduce((sum, r) => sum + r.revenue, 0),
    orders: matched.reduce((sum, r) => sum + r.orders, 0),
    promoInvestment: matched.reduce((sum, r) => sum + r.promo_investment, 0),
    payout: matched.reduce((sum, r) => sum + (r.payout ?? 0), 0),
    rating: ratings.length ? ratings.reduce((s, v) => s + v, 0) / ratings.length : null,
  };
}
