"use client";

import { RowActionsMenu } from "@/components/delivery/RowActionsMenu";
import { formatCurrency, formatNumber, statusRoas } from "@/lib/calc";
import { formatPeriodLabel } from "@/lib/period";
import { formatRoas } from "@/components/meta/metaMetrics";
import type { MetaAdsEntry } from "@/lib/types";

export function MetaHistoryTable({
  rows,
  onDelete,
}: {
  rows: MetaAdsEntry[];
  onDelete: (id: number) => Promise<void>;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Histórico semanal</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Período</th>
              <th className="px-4 py-3 text-right">Investido</th>
              <th className="px-4 py-3 text-right">Resultados</th>
              <th className="px-4 py-3 text-right">Receita gerada</th>
              <th className="px-4 py-3 text-right">ROAS</th>
              <th className="px-4 py-3 text-right">Custo / resultado</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">Nenhum lançamento para esse filtro.</td></tr>
            )}
            {rows.map((e) => {
              const roas = e.invested > 0 ? e.revenue_generated / e.invested : 0;
              return (
                <tr key={e.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 text-foreground">{e.clients?.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatPeriodLabel(e.start_date, e.end_date)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">{formatCurrency(e.invested)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{formatNumber(e.results)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{formatCurrency(e.revenue_generated)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">{formatRoas(roas)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{e.results > 0 ? formatCurrency(e.invested / e.results) : "—"}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{statusRoas(roas)}</td>
                  <td className="px-4 py-3 text-right"><RowActionsMenu onDelete={() => onDelete(e.id)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
