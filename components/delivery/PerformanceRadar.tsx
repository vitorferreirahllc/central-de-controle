import { Radar } from "lucide-react";
import { DeltaIndicator } from "@/components/DeltaIndicator";
import type { RadarFinding } from "@/lib/radar";

export function PerformanceRadar({ findings }: { findings: RadarFinding[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Radar className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Radar
        </h2>
      </div>

      {findings.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Nenhuma mudança relevante no período selecionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {findings.map((f) => (
            <div
              key={f.client}
              className={
                "rounded-xl border bg-card p-4 " +
                (f.severity === "critico"
                  ? "border-destructive/40"
                  : "border-warning/40")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {f.client}
                </h3>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] font-medium " +
                    (f.severity === "critico"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning")
                  }
                >
                  {f.severity === "critico" ? "Crítico" : "Atenção"}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                {f.revenueDelta != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Faturamento</span>
                    <DeltaIndicator value={f.revenueDelta} />
                  </div>
                )}
                {f.ordersDelta != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Pedidos</span>
                    <DeltaIndicator value={f.ordersDelta} />
                  </div>
                )}
                {f.aovDelta != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">AOV</span>
                    <DeltaIndicator value={f.aovDelta} />
                  </div>
                )}
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">
                {f.reasons.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
