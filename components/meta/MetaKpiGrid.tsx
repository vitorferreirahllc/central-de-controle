import { DollarSign, Megaphone, TrendingUp, Target, Coins, Receipt } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { formatCurrency, formatNumber } from "@/lib/calc";
import { formatRoas } from "@/components/meta/metaMetrics";

export type MetaKpiTotals = {
  invested: number;
  investedDelta: number | null;
  revenue: number;
  revenueDelta: number | null;
  roas: number;
  roasDelta: number | null;
  results: number;
  resultsDelta: number | null;
  cpr: number | null;
  cprDelta: number | null;
  vpr: number | null;
  vprDelta: number | null;
};

export function MetaKpiGrid({
  totals,
  compareLabel,
}: {
  totals: MetaKpiTotals;
  compareLabel: string | null;
}) {
  const vs = compareLabel ? `vs ${compareLabel}` : undefined;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Investido" value={formatCurrency(totals.invested)} icon={Megaphone} delta={totals.investedDelta} compareLabel={vs} />
      <KpiCard label="Receita gerada" value={formatCurrency(totals.revenue)} icon={DollarSign} delta={totals.revenueDelta} compareLabel={vs} />
      <KpiCard label="ROAS" value={formatRoas(totals.roas)} icon={TrendingUp} delta={totals.roasDelta} compareLabel={vs} />
      <KpiCard label="Resultados" value={formatNumber(totals.results)} icon={Target} delta={totals.resultsDelta} compareLabel={vs} />
      <KpiCard label="Custo / resultado" value={totals.cpr != null ? formatCurrency(totals.cpr) : "—"} icon={Coins} delta={totals.cprDelta} deltaInverse compareLabel={vs} />
      <KpiCard label="Valor / resultado" value={totals.vpr != null ? formatCurrency(totals.vpr) : "—"} icon={Receipt} delta={totals.vprDelta} compareLabel={vs} />
    </div>
  );
}
