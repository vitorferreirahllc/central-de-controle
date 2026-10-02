"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { DeltaIndicator } from "@/components/DeltaIndicator";
import {
  formatCurrency,
  formatNumber,
  percentDelta,
  repassePercent,
  promoPercent,
} from "@/lib/calc";
import type { DeliveryAggregate } from "@/lib/period";

export type OperationRow = {
  name: string;
  current: DeliveryAggregate | null;
  previous: DeliveryAggregate | null;
};

type SortKey =
  | "faturamento"
  | "crescimento"
  | "queda"
  | "pedidos"
  | "aov"
  | "repasse_pct"
  | "promo_pct"
  | "avaliacao";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "faturamento", label: "Faturamento" },
  { value: "crescimento", label: "Maior crescimento" },
  { value: "queda", label: "Maior queda" },
  { value: "pedidos", label: "Pedidos" },
  { value: "aov", label: "AOV" },
  { value: "repasse_pct", label: "Repasse %" },
  { value: "promo_pct", label: "Promo %" },
  { value: "avaliacao", label: "Avaliação" },
];

function aov(agg: DeliveryAggregate) {
  return agg.orders > 0 ? agg.revenue / agg.orders : 0;
}

export function OperationsPerformanceTable({
  rows,
  onOpenClient,
}: {
  rows: OperationRow[];
  onOpenClient: (name: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>("faturamento");

  const computed = useMemo(() => {
    return rows.map((r) => {
      const revenue = r.current?.revenue ?? 0;
      const orders = r.current?.orders ?? 0;
      const aovCurrent = r.current ? aov(r.current) : 0;
      const aovPrevious = r.previous ? aov(r.previous) : null;

      const revenueDelta = r.current && r.previous ? percentDelta(r.current.revenue, r.previous.revenue) : null;
      const ordersDelta = r.current && r.previous ? percentDelta(r.current.orders, r.previous.orders) : null;
      const aovDelta = r.current && r.previous ? percentDelta(aovCurrent, aovPrevious) : null;

      const repassePct = r.current ? repassePercent(r.current.payout, r.current.revenue) : null;
      const promoPct = r.current ? promoPercent(r.current.promoInvestment, r.current.revenue) : null;

      return {
        name: r.name,
        hasData: r.current != null,
        revenue,
        revenueDelta,
        orders,
        ordersDelta,
        aov: aovCurrent,
        aovDelta,
        payout: r.current?.payout ?? 0,
        repassePct,
        promoPct,
        rating: r.current?.rating ?? null,
      };
    });
  }, [rows]);

  const sorted = useMemo(() => {
    const list = [...computed];
    switch (sort) {
      case "faturamento":
        return list.sort((a, b) => b.revenue - a.revenue);
      case "crescimento":
        return list.sort((a, b) => (b.revenueDelta ?? -Infinity) - (a.revenueDelta ?? -Infinity));
      case "queda":
        return list.sort((a, b) => (a.revenueDelta ?? Infinity) - (b.revenueDelta ?? Infinity));
      case "pedidos":
        return list.sort((a, b) => b.orders - a.orders);
      case "aov":
        return list.sort((a, b) => b.aov - a.aov);
      case "repasse_pct":
        return list.sort((a, b) => (b.repassePct ?? -1) - (a.repassePct ?? -1));
      case "promo_pct":
        return list.sort((a, b) => (b.promoPct ?? -1) - (a.promoPct ?? -1));
      case "avaliacao":
        return list.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
      default:
        return list;
    }
  }, [computed, sort]);

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Performance por operação
        </h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Ordenar: {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Operação</th>
              <th className="px-4 py-3 text-right">Faturamento</th>
              <th className="px-4 py-3 text-right">Pedidos</th>
              <th className="px-4 py-3 text-right">AOV</th>
              <th className="px-4 py-3 text-right">Repasse</th>
              <th className="px-4 py-3 text-right">Repasse %</th>
              <th className="px-4 py-3 text-right">Promo %</th>
              <th className="px-4 py-3 text-right">Avaliação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((r) => (
              <tr
                key={r.name}
                onClick={() => onOpenClient(r.name)}
                className="cursor-pointer hover:bg-secondary/50"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {r.name}
                </td>
                {!r.hasData ? (
                  <td colSpan={7} className="px-4 py-3 text-muted-foreground">
                    Sem lançamento neste período
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular-nums text-foreground">
                        {formatCurrency(r.revenue)}
                      </div>
                      <DeltaIndicator value={r.revenueDelta} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular-nums text-foreground">
                        {formatNumber(r.orders)}
                      </div>
                      <DeltaIndicator value={r.ordersDelta} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular-nums text-foreground">
                        {formatCurrency(r.aov)}
                      </div>
                      <DeltaIndicator value={r.aovDelta} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {formatCurrency(r.payout)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {r.repassePct != null ? `${r.repassePct.toFixed(1)}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {r.promoPct != null ? `${r.promoPct.toFixed(1)}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.rating != null ? (
                        <span className="inline-flex items-center gap-1 tabular-nums text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {r.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
