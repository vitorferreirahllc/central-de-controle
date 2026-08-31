import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ticketMedio, formatCurrency, formatNumber } from "@/lib/calc";
import { DELIVERY_CLIENTS } from "@/lib/clients";
import type { DeliveryEntry } from "@/lib/types";
import { deleteDeliveryEntry } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";
import { GrowthChart } from "@/components/GrowthChart";
import { ResultsFilter } from "@/components/ResultsFilter";

export default async function DeliveryAppsPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string; week?: string }>;
}) {
  const { client, week } = await searchParams;
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("delivery_entries")
    .select(
      "id, client_id, month_ref, week_number, start_date, end_date, revenue, orders, promo_investment, rating, payout, notes, clients(name)",
    )
    .order("start_date", { ascending: true });

  const allRows = (entries ?? []) as unknown as DeliveryEntry[];

  const weekOptions = Array.from(
    new Map(
      allRows.map((e) => [
        e.start_date,
        {
          value: e.start_date,
          label: `${e.start_date} — ${e.end_date}`,
        },
      ]),
    ).values(),
  ).sort((a, b) => b.value.localeCompare(a.value));

  const selectedClient = client && client !== "Todos" ? client : "Todos";
  const selectedWeek = week && week !== "Todas" ? week : "Todas";

  const rows = allRows.filter((e) => {
    const matchesClient =
      selectedClient === "Todos" || e.clients?.name === selectedClient;
    const matchesWeek =
      selectedWeek === "Todas" || e.start_date === selectedWeek;
    return matchesClient && matchesWeek;
  });

  const byWeek = new Map<string, { revenue: number; orders: number }>();
  for (const entry of rows) {
    const key = entry.start_date;
    const current = byWeek.get(key) ?? { revenue: 0, orders: 0 };
    current.revenue += entry.revenue;
    current.orders += entry.orders;
    byWeek.set(key, current);
  }
  const chartData = Array.from(byWeek.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      label: new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      revenue: Math.round(v.revenue),
      orders: v.orders,
    }));

  const rowsDesc = [...rows].reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Resultado semanal de cada cliente (DoorDash, Uber Eats, etc.
          consolidados).
        </p>
        <ResultsFilter
          basePath="/delivery-apps"
          clients={DELIVERY_CLIENTS}
          weeks={weekOptions}
          selectedClient={selectedClient}
          selectedWeek={selectedWeek}
        />
      </div>

      <GrowthChart
        title="Crescimento — Faturamento"
        subtitle="Faturamento total (dos clientes filtrados) por semana"
        data={chartData}
        series={[
          {
            key: "revenue",
            label: "Faturamento ($)",
            color: "var(--chart-2)",
          },
        ]}
      />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Mês</th>
              <th className="px-4 py-3">Semana</th>
              <th className="px-4 py-3">Período</th>
              <th className="px-4 py-3 text-right">Faturamento</th>
              <th className="px-4 py-3 text-right">Pedidos</th>
              <th className="px-4 py-3 text-right">AOV (Ticket Médio)</th>
              <th className="px-4 py-3 text-right">Promoção</th>
              <th className="px-4 py-3 text-right">Repasse Líquido</th>
              <th className="px-4 py-3 text-right">Avaliação</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rowsDesc.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhum lançamento para esse filtro.
                </td>
              </tr>
            )}
            {rowsDesc.map((entry) => (
              <tr key={entry.id} className="hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground">
                  {entry.clients?.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.month_ref}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.week_number}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.start_date} — {entry.end_date}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(entry.revenue)}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {formatNumber(entry.orders)}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {formatCurrency(ticketMedio(entry.revenue, entry.orders))}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {formatCurrency(entry.promo_investment)}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {entry.payout != null ? formatCurrency(entry.payout) : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {entry.rating != null ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {entry.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    onDelete={deleteDeliveryEntry.bind(null, entry.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
