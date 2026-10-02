"use client";

import { useMemo, useState } from "react";
import { MiniTrendChart } from "@/components/delivery/MiniTrendChart";
import { formatShortDate } from "@/lib/period";
import { formatCurrency, formatNumber } from "@/lib/calc";
import type { DeliveryEntry } from "@/lib/types";

type MetricKey = "revenue" | "orders" | "aov" | "payout" | "promo" | "rating";

const METRIC_OPTIONS: { value: MetricKey; label: string }[] = [
  { value: "revenue", label: "Faturamento" },
  { value: "orders", label: "Pedidos" },
  { value: "aov", label: "AOV" },
  { value: "payout", label: "Repasse" },
  { value: "promo", label: "Promoções" },
  { value: "rating", label: "Avaliação" },
];

const WEEKS_WINDOW = 8;

function metricValue(entry: DeliveryEntry, metric: MetricKey): number | null {
  switch (metric) {
    case "revenue":
      return entry.revenue;
    case "orders":
      return entry.orders;
    case "aov":
      return entry.orders > 0 ? entry.revenue / entry.orders : 0;
    case "payout":
      return entry.payout ?? null;
    case "promo":
      return entry.promo_investment;
    case "rating":
      return entry.rating;
  }
}

function metricFormatter(metric: MetricKey) {
  if (metric === "orders") return formatNumber;
  if (metric === "rating") return (v: number) => v.toFixed(1);
  return formatCurrency;
}

export function EvolutionSection({
  rows,
  clients,
}: {
  rows: DeliveryEntry[];
  clients: string[];
}) {
  const [metric, setMetric] = useState<MetricKey>("revenue");

  const series = useMemo(() => {
    return clients.map((name) => {
      const clientRows = rows
        .filter((r) => r.clients?.name === name)
        .sort((a, b) => a.start_date.localeCompare(b.start_date))
        .slice(-WEEKS_WINDOW);

      const data = clientRows
        .map((r) => ({
          label: formatShortDate(r.start_date),
          value: metricValue(r, metric),
        }))
        .filter((d): d is { label: string; value: number } => d.value != null);

      return { name, data };
    });
  }, [rows, clients, metric]);

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Evolução
        </h2>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricKey)}
          className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {METRIC_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {series.map((s) => (
          <MiniTrendChart
            key={s.name}
            name={s.name}
            data={s.data}
            valueFormatter={metricFormatter(metric)}
          />
        ))}
      </div>
    </section>
  );
}
