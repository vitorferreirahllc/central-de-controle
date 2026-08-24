import { DollarSign, ShoppingBag, Megaphone, TrendingUp, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DELIVERY_CLIENTS, META_ADS_CLIENTS } from "@/lib/clients";
import {
  ticketMedio,
  roas,
  custoPorResultado,
  statusRoas,
  formatCurrency,
  formatNumber,
} from "@/lib/calc";
import type { DeliveryEntry, MetaAdsEntry } from "@/lib/types";
import { MonthSelect } from "@/components/MonthSelect";
import { KpiCard } from "@/components/KpiCard";

function statusColor(status: string) {
  if (status === "Excelente") return "text-success";
  if (status === "Bom") return "text-accent";
  if (status === "Regular") return "text-warning";
  if (status === "Ruim") return "text-destructive";
  return "text-muted-foreground";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const supabase = await createClient();

  const [{ data: deliveryData }, { data: metaData }] =
    await Promise.all([
      supabase
        .from("delivery_entries")
        .select(
          "id, client_id, month_ref, week_number, start_date, end_date, revenue, orders, promo_investment, rating, payout, notes, clients(name)",
        ),
      supabase
        .from("meta_ads_entries")
        .select(
          "id, client_id, month_ref, week_number, start_date, end_date, invested, results, revenue_generated, notes, clients(name)",
        ),
    ]);

  const deliveryEntries = (deliveryData ?? []) as unknown as DeliveryEntry[];
  const metaEntries = (metaData ?? []) as unknown as MetaAdsEntry[];

  const months = Array.from(
    new Set([
      ...deliveryEntries.map((e) => e.month_ref),
      ...metaEntries.map((e) => e.month_ref),
    ]),
  ).sort();

  const selectedMonth = month && months.includes(month)
    ? month
    : months[months.length - 1] ?? "Agosto/2026";

  const monthOptions = months.length ? months : [selectedMonth];

  const deliveryByMonth = deliveryEntries.filter(
    (e) => e.month_ref === selectedMonth,
  );
  const metaByMonth = metaEntries.filter((e) => e.month_ref === selectedMonth);

  const deliveryRows = DELIVERY_CLIENTS.map((name) => {
    const rows = deliveryByMonth.filter((e) => e.clients?.name === name);
    const revenue = rows.reduce((sum, r) => sum + r.revenue, 0);
    const orders = rows.reduce((sum, r) => sum + r.orders, 0);
    const payout = rows.reduce((sum, r) => sum + (r.payout ?? 0), 0);
    const ratings = rows
      .map((r) => r.rating)
      .filter((v): v is number => v != null);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, v) => sum + v, 0) / ratings.length
        : null;
    return {
      name,
      revenue,
      orders,
      ticket: ticketMedio(revenue, orders),
      payout,
      avgRating,
    };
  });

  const deliveryTotal = deliveryRows.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.revenue,
      orders: acc.orders + r.orders,
      payout: acc.payout + r.payout,
    }),
    { revenue: 0, orders: 0, payout: 0 },
  );

  const metaRows = META_ADS_CLIENTS.map((name) => {
    const rows = metaByMonth.filter((e) => e.clients?.name === name);
    const invested = rows.reduce((sum, r) => sum + r.invested, 0);
    const revenueGenerated = rows.reduce(
      (sum, r) => sum + r.revenue_generated,
      0,
    );
    const results = rows.reduce((sum, r) => sum + r.results, 0);
    const roasValue = roas(revenueGenerated, invested);
    return {
      name,
      invested,
      revenueGenerated,
      roas: roasValue,
      cac: custoPorResultado(invested, results),
      status: statusRoas(roasValue),
    };
  });

  const metaTotal = metaRows.reduce(
    (acc, r) => ({
      invested: acc.invested + r.invested,
      revenueGenerated: acc.revenueGenerated + r.revenueGenerated,
    }),
    { invested: 0, revenueGenerated: 0 },
  );
  const metaTotalRoas = roas(metaTotal.revenueGenerated, metaTotal.invested);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mt-1 text-sm text-muted-foreground">
            Consolidado do mês selecionado, por cliente.
          </p>
        </div>
        <MonthSelect months={monthOptions} selected={selectedMonth} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Faturamento Delivery"
          value={formatCurrency(deliveryTotal.revenue)}
          icon={DollarSign}
        />
        <KpiCard
          label="Pedidos Delivery"
          value={formatNumber(deliveryTotal.orders)}
          icon={ShoppingBag}
        />
        <KpiCard
          label="Investido em Ads"
          value={formatCurrency(metaTotal.invested)}
          icon={Megaphone}
        />
        <KpiCard
          label="ROAS Médio"
          value={`${metaTotalRoas.toFixed(2)}x`}
          icon={TrendingUp}
        />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Delivery Apps — consolidado do mês
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3 text-right">Faturamento ($)</th>
                <th className="px-4 py-3 text-right">Pedidos (qtd)</th>
                <th className="px-4 py-3 text-right">Ticket Médio ($)</th>
                <th className="px-4 py-3 text-right">Repasse Líquido ($)</th>
                <th className="px-4 py-3 text-right">Avaliação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deliveryRows.map((r) => (
                <tr key={r.name} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatNumber(r.orders)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(r.ticket)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(r.payout)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.avgRating != null ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        {r.avgRating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-secondary/50 font-semibold">
                <td className="px-4 py-3 text-foreground">TOTAL</td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(deliveryTotal.revenue)}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatNumber(deliveryTotal.orders)}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(
                    ticketMedio(deliveryTotal.revenue, deliveryTotal.orders),
                  )}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(deliveryTotal.payout)}
                </td>
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Meta Ads — consolidado do mês
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3 text-right">Investido ($)</th>
                <th className="px-4 py-3 text-right">Receita Gerada ($)</th>
                <th className="px-4 py-3 text-right">ROAS</th>
                <th className="px-4 py-3 text-right">CAC ($)</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {metaRows.map((r) => (
                <tr key={r.name} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(r.invested)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(r.revenueGenerated)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {r.roas.toFixed(2)}x
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(r.cac)}
                  </td>
                  <td className={`px-4 py-3 font-medium ${statusColor(r.status)}`}>
                    {r.status}
                  </td>
                </tr>
              ))}
              <tr className="bg-secondary/50 font-semibold">
                <td className="px-4 py-3 text-foreground">TOTAL</td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(metaTotal.invested)}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(metaTotal.revenueGenerated)}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {metaTotalRoas.toFixed(2)}x
                </td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Fonte: lançamentos das páginas Delivery Apps e Meta Ads. Os totais
        somam automaticamente todas as semanas lançadas no mês selecionado.
      </p>
    </div>
  );
}
