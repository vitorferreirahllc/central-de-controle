"use client";

import { useMemo, useState } from "react";
import { MiniTrendChart } from "@/components/delivery/MiniTrendChart";
import { formatShortDate } from "@/lib/period";
import { formatCurrency, formatNumber } from "@/lib/calc";
import type { MetaAdsEntry } from "@/lib/types";

type MetricKey = "roas" | "invested" | "revenue" | "results" | "cpr";

const METRICS: { value: MetricKey; label: string }[] = [
  { value: "roas", label: "ROAS" },
  { value: "invested", label: "Investido" },
  { value: "revenue", label: "Receita gerada" },
  { value: "results", label: "Resultados" },
  { value: "cpr", label: "Custo / resultado" },
];

function value(e: MetaAdsEntry, m: MetricKey): number | null {
  switch (m) {
    case "roas": return e.invested > 0 && e.revenue_generated > 0 ? e.revenue_generated / e.invested : null;
    case "invested": return e.invested;
    case "revenue": return e.revenue_generated;
    case "results": return e.results;
    case "cpr": return e.results > 0 ? e.invested / e.results : null;
  }
}

function formatter(m: MetricKey) {
  if (m === "roas") return (v: number) => `${v.toFixed(2)}x`;
  if (m === "results") return formatNumber;
  return formatCurrency;
}

export function MetaEvolution({ rows, clients }: { rows: MetaAdsEntry[]; clients: string[] }) {
  const [metric, setMetric] = useState<MetricKey>("roas");

  const series = useMemo(
    () =>
      clients.map((name) => {
        const data = rows
          .filter((r) => r.clients?.name === name)
          .sort((a, b) => a.start_date.localeCompare(b.start_date))
          .slice(-8)
          .map((r) => ({ label: formatShortDate(r.start_date), value: value(r, metric) }))
          .filter((d): d is { label: string; value: number } => d.value != null);
        return { name, data };
      }),
    [rows, clients, metric],
  );

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Evolução</h2>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricKey)}
          className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {METRICS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {series.map((s) => (
          <MiniTrendChart key={s.name} name={s.name} data={s.data} valueFormatter={formatter(metric)} lowerIsBetter={metric === "cpr"} />
        ))}
      </div>
    </section>
  );
}
