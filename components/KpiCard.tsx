import type { LucideIcon } from "lucide-react";
import { DeltaIndicator, type DeltaUnit } from "@/components/DeltaIndicator";

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaUnit = "percent",
  compareLabel,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Quando omitido, nenhuma linha de variação é renderizada (comportamento original). */
  delta?: number | null;
  deltaUnit?: DeltaUnit;
  compareLabel?: string;
}) {
  const showDelta = delta !== undefined;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/50">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary transition-colors duration-300 group-hover:bg-accent/10">
            <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
          </div>
        </div>

        <span className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {value}
        </span>

        {showDelta && (
          <div className="mt-2 flex items-center gap-2">
            <DeltaIndicator value={delta ?? null} unit={deltaUnit} />
            {compareLabel && (
              <span className="text-[11px] text-muted-foreground">
                {compareLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
