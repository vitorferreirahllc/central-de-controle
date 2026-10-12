import { GlobalFilters } from "@/components/delivery/GlobalFilters";
import type { PeriodOption } from "@/lib/period";

export function PerformanceHeader({
  period,
  onPeriodChange,
  client,
  onClientChange,
  clients,
  title = "Performance Delivery",
  subtitle = "Visão consolidada da performance das operações.",
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
  title?: string;
  subtitle?: string;
  periodLabel?: string;
  compareLabel?: string | null;
  weeks?: { value: string; label: string }[];
  selectedWeek?: string;
  onWeekChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <GlobalFilters
        period={period}
        onPeriodChange={onPeriodChange}
        client={client}
        onClientChange={onClientChange}
        clients={clients}
        periodLabel={periodLabel}
        compareLabel={compareLabel}
        weeks={weeks}
        selectedWeek={selectedWeek}
        onWeekChange={onWeekChange}
      />
    </div>
  );
}
