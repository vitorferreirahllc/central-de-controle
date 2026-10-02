import { DollarSign, ShoppingBag, Receipt, Wallet, Megaphone, Star } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { formatCurrency, formatNumber } from "@/lib/calc";

export type KpiTotals = {
  revenue: number;
  revenueDelta: number | null;
  orders: number;
  ordersDelta: number | null;
  aov: number;
  aovDelta: number | null;
  payout: number;
  payoutDelta: number | null;
  promo: number;
  promoDelta: number | null;
  rating: number | null;
  ratingDelta: number | null;
};

export function KpiGrid({
  totals,
  compareLabel,
}: {
  totals: KpiTotals;
  compareLabel: string | null;
}) {
  const vs = compareLabel ? `vs ${compareLabel}` : undefined;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        label="Faturamento"
        value={formatCurrency(totals.revenue)}
        icon={DollarSign}
        delta={totals.revenueDelta}
        compareLabel={vs}
      />
      <KpiCard
        label="Pedidos"
        value={formatNumber(totals.orders)}
        icon={ShoppingBag}
        delta={totals.ordersDelta}
        compareLabel={vs}
      />
      <KpiCard
        label="Ticket Médio"
        value={formatCurrency(totals.aov)}
        icon={Receipt}
        delta={totals.aovDelta}
        compareLabel={vs}
      />
      <KpiCard
        label="Repasse Líquido"
        value={formatCurrency(totals.payout)}
        icon={Wallet}
        delta={totals.payoutDelta}
        compareLabel={vs}
      />
      <KpiCard
        label="Promoções"
        value={formatCurrency(totals.promo)}
        icon={Megaphone}
        delta={totals.promoDelta}
        compareLabel={vs}
      />
      <KpiCard
        label="Avaliação"
        value={totals.rating != null ? `${totals.rating.toFixed(1)} ★` : "—"}
        icon={Star}
        delta={totals.ratingDelta}
        deltaUnit="absolute"
        compareLabel={vs}
      />
    </div>
  );
}
