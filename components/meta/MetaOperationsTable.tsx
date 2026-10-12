"use client";

import { useMemo, useState } from "react";
import { DeltaIndicator } from "@/components/DeltaIndicator";
import { formatCurrency, formatNumber, percentDelta, statusRoas } from "@/lib/calc";
import type { MetaAggregate } from "@/lib/period";
import { metaRoas, metaCpr, formatRoas } from "@/components/meta/metaMetrics";

export type MetaOperationRow = {
  name: string;
  current: MetaAggregate | null;
  previous: MetaAggregate | null;
};

type SortKey = "roas" | "investido" | "receita" | "resultados" | "cpr" | "crescimento" | "queda";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "roas", label: "ROAS" },
  { value: "investido", label: "Investido" },
  { value: "receita", label: "Receita gerada" },
  { value: "resultados", label: "Resultados" },
  { value: "cpr", label: "Menor custo / resultado" },
  { value: "crescimento", label: "Maior alta de ROAS" },
  { value: "queda", label: "Maior queda de ROAS" },
];

function statusColor(status: string) {
  if (status === "Excelente") return "text-success";
  if (status === "Bom") return "text-accent";
  if (status === "Regular") return "text-warning";
  if (status === "Ruim") return "text-destructive";
  return "text-muted-foreground";
}

export function MetaOperationsTable({
  rows,
  onOpenClient,
}: {
  rows: MetaOperationRow[];
  onOpenClient: (name: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>("roas");

  const computed = useMemo(
    () =>
      rows.map((r) => {
        const roas = r.current ? metaRoas(r.current) : 0;
        const roasPrev = r.previous ? metaRoas(r.previous) : null;
        const cpr = r.current ? metaCpr(r.current) : null;
        const cprPrev = r.previous ? metaCpr(r.previous) : null;
        const both = r.current && r.previous;
        return {
          name: r.name,
          hasData: r.current != null,
          invested: r.current?.invested ?? 0,
          revenue: r.current?.revenue ?? 0,
          results: r.current?.results ?? 0,
          roas,
          roasDelta: both && roas > 0 ? percentDelta(roas, roasPrev) : null,
          resultsDelta: both ? percentDelta(r.current!.results, r.previous!.results) : null,
          investedDelta: both ? percentDelta(r.current!.invested, r.previous!.invested) : null,
          cpr,
          cprDelta: both && cpr != null ? percentDelta(cpr, cprPrev) : null,
          status: statusRoas(roas),
        };
      }),
    [rows],
  );

  const sorted = useMemo(() => {
    const l = [...computed];
    switch (sort) {
      case "roas": return l.sort((a, b) => b.roas - a.roas);
      case "investido": return l.sort((a, b) => b.invested - a.invested);
      case "receita": return l.sort((a, b) => b.revenue - a.revenue);
      case "resultados": return l.sort((a, b) => b.results - a.results);
      case "cpr": return l.sort((a, b) => (a.cpr ?? Infinity) - (b.cpr ?? Infinity));
      case "crescimento": return l.sort((a, b) => (b.roasDelta ?? -Infinity) - (a.roasDelta ?? -Infinity));
      case "queda": return l.sort((a, b) => (a.roasDelta ?? Infinity) - (b.roasDelta ?? Infinity));
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
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>Ordenar: {o.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Operação</th>
              <th className="px-4 py-3 text-right">Investido</th>
              <th className="px-4 py-3 text-right">Receita gerada</th>
              <th className="px-4 py-3 text-right">ROAS</th>
              <th className="px-4 py-3 text-right">Resultados</th>
              <th className="px-4 py-3 text-right">Custo / resultado</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((r) => (
              <tr key={r.name} onClick={() => onOpenClient(r.name)} className="cursor-pointer hover:bg-secondary/50">
                <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                {!r.hasData ? (
                  <td colSpan={6} className="px-4 py-3 text-muted-foreground">Sem lançamento neste período</td>
                ) : (
                  <>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular-nums text-foreground">{formatCurrency(r.invested)}</div>
                      <DeltaIndicator value={r.investedDelta} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">{formatCurrency(r.revenue)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular-nums font-semibold text-foreground">{formatRoas(r.roas)}</div>
                      <DeltaIndicator value={r.roasDelta} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular-nums text-foreground">{formatNumber(r.results)}</div>
                      <DeltaIndicator value={r.resultsDelta} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular-nums text-foreground">{r.cpr != null ? formatCurrency(r.cpr) : "—"}</div>
                      <DeltaIndicator value={r.cprDelta} inverse />
                    </td>
                    <td className={"px-4 py-3 text-right text-xs font-medium " + statusColor(r.status)}>{r.status}</td>
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
