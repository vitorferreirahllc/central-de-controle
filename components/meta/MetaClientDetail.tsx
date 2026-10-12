"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeltaIndicator } from "@/components/DeltaIndicator";
import { formatCurrency, formatNumber, percentDelta } from "@/lib/calc";
import { formatPeriodLabel, type MetaAggregate } from "@/lib/period";
import { metaRoas, metaCpr, metaValuePerResult, formatRoas } from "@/components/meta/metaMetrics";
import type { MetaAdsEntry } from "@/lib/types";

export function MetaClientDetail({
  client, onClose, current, previous, currentLabel, previousLabel, history,
}: {
  client: string | null;
  onClose: () => void;
  current: MetaAggregate | null;
  previous: MetaAggregate | null;
  currentLabel: string;
  previousLabel: string | null;
  history: MetaAdsEntry[];
}) {
  const open = client != null;
  const d = (cur: number | null, prev: number | null | undefined) =>
    previous && cur != null ? percentDelta(cur, prev ?? null) : null;

  const metrics = current
    ? [
        { label: "Investido", value: formatCurrency(current.invested), delta: d(current.invested, previous?.invested) },
        { label: "Receita gerada", value: formatCurrency(current.revenue), delta: d(current.revenue, previous?.revenue) },
        { label: "ROAS", value: formatRoas(metaRoas(current)), delta: previous && metaRoas(current) > 0 ? percentDelta(metaRoas(current), metaRoas(previous)) : null },
        { label: "Resultados", value: formatNumber(current.results), delta: d(current.results, previous?.results) },
        { label: "Custo / resultado", value: metaCpr(current) != null ? formatCurrency(metaCpr(current)!) : "—", delta: d(metaCpr(current), previous ? metaCpr(previous) : null), inverse: true },
        { label: "Valor / resultado", value: metaValuePerResult(current) != null ? formatCurrency(metaValuePerResult(current)!) : "—", delta: d(metaValuePerResult(current), previous ? metaValuePerResult(previous) : null) },
      ]
    : [];

  return (
    <>
      <div aria-hidden={!open} onClick={onClose} className={cn("fixed inset-0 z-40 bg-black/60 transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")} />
      <aside aria-label="Detalhamento da operação" className={cn("fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-card p-6 shadow-2xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "translate-x-full")}>
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        {client && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{client}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {currentLabel}{previousLabel && ` · comparado com ${previousLabel}`}
            </p>
            {!current ? (
              <p className="mt-6 text-sm text-muted-foreground">Nenhum lançamento desse cliente nesse período.</p>
            ) : (
              <div className="mt-6 space-y-3">
                {metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-foreground">{m.value}</p>
                      <DeltaIndicator value={m.delta} inverse={m.inverse} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Histórico</h3>
            <div className="space-y-2">
              {history.length === 0 && <p className="text-sm text-muted-foreground">Sem histórico.</p>}
              {history.map((h) => {
                const r = h.invested > 0 ? h.revenue_generated / h.invested : 0;
                return (
                  <div key={h.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">{formatPeriodLabel(h.start_date, h.end_date)}</span>
                    <span className="tabular-nums text-foreground">{formatCurrency(h.invested)} · {formatRoas(r)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
