"use client";

import { Star } from "lucide-react";
import { RowActionsMenu } from "@/components/delivery/RowActionsMenu";
import { formatCurrency, formatNumber, ticketMedio } from "@/lib/calc";
import { formatPeriodLabel } from "@/lib/period";
import type { DeliveryEntry } from "@/lib/types";

export function WeeklyHistoryTable({
  rows,
  onDelete,
}: {
  rows: DeliveryEntry[];
  onDelete: (id: number) => Promise<void>;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Histórico semanal
      </h2>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Período</th>
              <th className="px-4 py-3 text-right">Faturamento</th>
              <th className="px-4 py-3 text-right">Pedidos</th>
              <th className="px-4 py-3 text-right">AOV</th>
              <th className="px-4 py-3 text-right">Promoções</th>
              <th className="px-4 py-3 text-right">Repasse</th>
              <th className="px-4 py-3 text-right">Avaliação</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhum lançamento para esse filtro.
                </td>
              </tr>
            )}
            {rows.map((entry) => (
              <tr key={entry.id} className="hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground">
                  {entry.clients?.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatPeriodLabel(entry.start_date, entry.end_date)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-foreground">
                  {formatCurrency(entry.revenue)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {formatNumber(entry.orders)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(ticketMedio(entry.revenue, entry.orders))}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(entry.promo_investment)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {entry.payout != null ? formatCurrency(entry.payout) : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {entry.rating != null ? (
                    <span className="inline-flex items-center gap-1 tabular-nums text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {entry.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActionsMenu onDelete={() => onDelete(entry.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
