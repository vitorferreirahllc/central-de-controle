"use client";

import { CalendarDays } from "lucide-react";
import { PERIOD_OPTIONS, type PeriodOption } from "@/lib/period";

const selectClass =
  "rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

export function GlobalFilters({
  period,
  onPeriodChange,
  client,
  onClientChange,
  clients,
  periodLabel,
  compareLabel,
  weeks,
  selectedWeek,
  onWeekChange,
}: {
  period: PeriodOption;
  onPeriodChange: (value: PeriodOption) => void;
  client: string;
  onClientChange: (value: string) => void;
  clients: string[];
  periodLabel?: string;
  compareLabel?: string | null;
  weeks?: { value: string; label: string }[];
  selectedWeek?: string;
  onWeekChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {periodLabel && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <div className="leading-tight">
            <p className="text-sm font-medium tabular-nums text-foreground">
              {periodLabel}
            </p>
            {compareLabel && (
              <p className="text-[11px] tabular-nums text-muted-foreground">
                vs {compareLabel}
              </p>
            )}
          </div>
        </div>
      )}

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

      {period === "semana_especifica" && weeks && onWeekChange && (
        <select
          value={selectedWeek ?? ""}
          onChange={(e) => onWeekChange(e.target.value)}
          aria-label="Escolher semana"
          className={selectClass}
        >
          {weeks.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>
      )}

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
