import Link from "next/link";
import { HeartPulse, ShieldAlert, ShieldCheck, ShieldQuestion, Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ClientStatus, Risco } from "@/lib/types";
import { formatProjectWeek } from "@/lib/calc";
import { effectiveStatus, todayInBrasilia } from "@/lib/contracts";
import { KpiCard } from "@/components/KpiCard";
import { DeleteButton } from "@/components/DeleteButton";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { deleteClientStatus } from "../controle-operacoes/actions";

const RISCO_STYLES: Record<Risco, { border: string; badge: string }> = {
  Baixo: {
    border: "border-success/30 hover:border-success/60",
    badge: "bg-success/10 text-success",
  },
  Médio: {
    border: "border-warning/30 hover:border-warning/60",
    badge: "bg-warning/10 text-warning",
  },
  Alto: {
    border: "border-destructive/30 hover:border-destructive/60",
    badge: "bg-destructive/10 text-destructive",
  },
};

const PRODUTO_ORDER = ["Food Growth", "Food Scale", "Food Spot", "Food Foundation", "Sem produto"] as const;

function ClientCard({ c, status }: { c: ClientStatus; status: string }) {
  const style = RISCO_STYLES[c.risco];
  return (
    <div
      className={`rounded-xl border bg-card p-5 transition-colors duration-300 ${style.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{c.client_name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {status} · {formatProjectWeek(c.data_entrada)}
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
        >
          <HeartPulse className="h-3.5 w-3.5" />
          {c.risco}
        </span>
      </div>

      {c.proxima_entrega && (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="text-foreground">Próxima entrega:</span>{" "}
          {c.proxima_entrega}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{c.responsavel ?? "Sem responsável"}</span>
        {c.data_entrada && <span>Desde {c.data_entrada}</span>}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <Link
          href={`/controle-operacoes/${c.id}/editar`}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Link>
        <DeleteButton onDelete={deleteClientStatus.bind(null, c.id)} />
      </div>
    </div>
  );
}

export default async function SaudeClientePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("client_status")
    .select("*")
    .order("risco", { ascending: false })
    .order("client_name");

  const rows = (data ?? []) as ClientStatus[];

  const { data: contractsData } = await supabase
    .from("client_contracts")
    .select("client_status_id, data_fim");
  const endByClient = new Map(
    (contractsData ?? []).map((c) => [c.client_status_id as number, c.data_fim as string]),
  );
  const today = todayInBrasilia();

  const counts = {
    Baixo: rows.filter((r) => r.risco === "Baixo").length,
    Médio: rows.filter((r) => r.risco === "Médio").length,
    Alto: rows.filter((r) => r.risco === "Alto").length,
  };

  const groups = new Map<string, ClientStatus[]>();
  for (const row of rows) {
    const key = row.produto ?? "Sem produto";
    const existing = groups.get(key) ?? [];
    existing.push(row);
    groups.set(key, existing);
  }
  const orderedGroups = PRODUTO_ORDER.filter((p) => p !== "Sem produto" || groups.has(p)).map(
    (produto) => ({ produto, items: groups.get(produto) ?? [] }),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Saúde dos clientes com base no risco de churn/operação (Baixo,
          Médio, Alto), agrupados por produto. Clique em &quot;Editar&quot;
          para atualizar.
        </p>
        <Link
          href="/controle-operacoes"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          Adicionar cliente
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Saudáveis (Baixo risco)" value={String(counts.Baixo)} icon={ShieldCheck} />
        <KpiCard label="Atenção (Médio risco)" value={String(counts.Médio)} icon={ShieldQuestion} />
        <KpiCard label="Em risco (Alto risco)" value={String(counts.Alto)} icon={ShieldAlert} />
      </div>

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum cliente cadastrado ainda.
        </p>
      )}

      <div className="space-y-4">
        {orderedGroups.map(({ produto, items }) => (
          <CollapsibleTable
            key={produto}
            title={`${produto} (${items.length})`}
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma operação neste produto ainda.
                </p>
              )}
              {items.map((c) => (
                <ClientCard
                  key={c.id}
                  c={c}
                  status={effectiveStatus(c.status, endByClient.get(c.id), today)}
                />
              ))}
            </div>
          </CollapsibleTable>
        ))}
      </div>
    </div>
  );
}
