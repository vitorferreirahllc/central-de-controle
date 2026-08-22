import { createClient } from "@/lib/supabase/server";
import { custoPorResultado, roas, statusRoas, formatCurrency, formatNumber } from "@/lib/calc";
import type { MetaAdsEntry } from "@/lib/types";
import { deleteMetaAdsEntry } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";
import { GrowthChart } from "@/components/GrowthChart";

function statusColor(status: string) {
  if (status === "Excelente") return "text-success";
  if (status === "Bom") return "text-accent";
  if (status === "Regular") return "text-warning";
  if (status === "Ruim") return "text-destructive";
  return "text-muted-foreground";
}

export default async function MetaAdsPage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("meta_ads_entries")
    .select(
      "id, client_id, month_ref, week_number, start_date, end_date, invested, results, revenue_generated, notes, clients(name)",
    )
    .order("start_date", { ascending: true });

  const rows = (entries ?? []) as unknown as MetaAdsEntry[];

  const byWeek = new Map<string, { invested: number; revenueGenerated: number }>();
  for (const entry of rows) {
    const key = entry.start_date;
    const current = byWeek.get(key) ?? { invested: 0, revenueGenerated: 0 };
    current.invested += entry.invested;
    current.revenueGenerated += entry.revenue_generated;
    byWeek.set(key, current);
  }
  const chartData = Array.from(byWeek.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      label: new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      invested: Math.round(v.invested),
      revenueGenerated: Math.round(v.revenueGenerated),
    }));

  const rowsDesc = [...rows].reverse();

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Resultado semanal de cada campanha por cliente.
      </p>

      <GrowthChart
        title="Crescimento — Investido x Receita Gerada"
        subtitle="Totais (todos os clientes) por semana"
        data={chartData}
        series={[
          {
            key: "invested",
            label: "Investido ($)",
            color: "var(--chart-1)",
          },
          {
            key: "revenueGenerated",
            label: "Receita Gerada ($)",
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
              <th className="px-4 py-3 text-right">Investido</th>
              <th className="px-4 py-3 text-right">Resultados</th>
              <th className="px-4 py-3 text-right">Custo/Resultado</th>
              <th className="px-4 py-3 text-right">Receita Gerada</th>
              <th className="px-4 py-3 text-right">ROAS</th>
              <th className="px-4 py-3 text-right">CAC</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rowsDesc.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhum lançamento ainda.
                </td>
              </tr>
            )}
            {rowsDesc.map((entry) => {
              const roasValue = roas(entry.revenue_generated, entry.invested);
              const status = statusRoas(roasValue);
              return (
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
                    {formatCurrency(entry.invested)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatNumber(entry.results)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(
                      custoPorResultado(entry.invested, entry.results),
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(entry.revenue_generated)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {roasValue.toFixed(2)}x
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(
                      custoPorResultado(entry.invested, entry.results),
                    )}
                  </td>
                  <td className={`px-4 py-3 font-medium ${statusColor(status)}`}>
                    {status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      onDelete={deleteMetaAdsEntry.bind(null, entry.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
