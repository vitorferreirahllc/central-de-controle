"use client";

import { PERIOD_OPTIONS, type PeriodOption } from "@/lib/period";

const selectClass =
  "rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

export function GlobalFilters({
  period,
  onPeriodChange,
  client,
  onClientChange,
  clients,
}: {
  period: PeriodOption;
  onPeriodChange: (value: PeriodOption) => void;
  client: string;
  onClientChange: (value: string) => void;
  clients: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value as PeriodOption)}
        className={selectClass}
      >
        {PERIOD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={client}
        onChange={(e) => onClientChange(e.target.value)}
        className={selectClass}
      >
        <option value="Todos">Todos os clientes</option>
        {clients.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
