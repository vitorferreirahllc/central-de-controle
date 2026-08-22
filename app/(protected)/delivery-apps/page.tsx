import { createClient } from "@/lib/supabase/server";
import { ticketMedio, formatCurrency, formatNumber } from "@/lib/calc";
import type { DeliveryEntry } from "@/lib/types";
import { deleteDeliveryEntry } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";
import { GrowthChart } from "@/components/GrowthChart";

export default async function DeliveryAppsPage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("delivery_entries")
    .select(
      "id, client_id, month_ref, week_number, start_date, end_date, revenue, orders, promo_investment, new_customers, notes, clients(name)",
    )
    .order("start_date", { ascending: true });

  const rows = (entries ?? []) as unknown as DeliveryEntry[];

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
      <p className="text-sm text-muted-foreground">
        Resultado semanal de cada cliente (DoorDash, Uber Eats, etc.
        consolidados).
      </p>

      <GrowthChart
        title="Crescimento — Faturamento"
        subtitle="Faturamento total (todos os clientes) por semana"
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
              <th className="px-4 py-3 text-right">Ticket Médio</th>
              <th className="px-4 py-3 text-right">Promoção</th>
              <th className="px-4 py-3 text-right">Novos Clientes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rowsDesc.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhum lançamento ainda.
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
                  {formatNumber(entry.new_customers)}
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
