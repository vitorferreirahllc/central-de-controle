import { GlobalFilters } from "@/components/delivery/GlobalFilters";
import type { PeriodOption } from "@/lib/period";

export function PerformanceHeader({
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
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Performance Delivery
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão consolidada da performance das operações.
        </p>
      </div>
      <GlobalFilters
        period={period}
        onPeriodChange={onPeriodChange}
        client={client}
        onClientChange={onClientChange}
        clients={clients}
      />
    </div>
  );
}
