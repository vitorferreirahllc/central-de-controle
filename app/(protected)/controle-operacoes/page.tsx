import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ClientStatus } from "@/lib/types";
import { formatProjectWeek } from "@/lib/calc";
import { createClientStatus, deleteClientStatus } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";

const inputClass =
  "w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";
const labelClass = "mb-1 block text-xs font-medium text-muted-foreground";

function riscoColor(risco: string) {
  if (risco === "Baixo") return "text-success";
  if (risco === "Médio") return "text-warning";
  return "text-destructive";
}

export default async function SemanaProjetoPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("client_status")
    .select("*")
    .order("client_name");

  const rows = (data ?? []) as ClientStatus[];

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Em que semana/mês do projeto cada cliente está, responsável e
        próximas entregas.
      </p>

      <form
        action={createClientStatus}
        className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <label className={labelClass}>Cliente</label>
          <input name="client_name" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Data Entrada</label>
          <input name="data_entrada" type="date" required className={inputClass} />
          <p className="mt-1 text-[11px] text-muted-foreground">
            A semana/mês do projeto é calculada automaticamente a partir
            desta data.
          </p>
        </div>

        <div>
          <label className={labelClass}>Responsável</label>
          <input name="responsavel" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue="Operando" className={inputClass}>
            <option value="Onboarding">Onboarding</option>
            <option value="Operando">Operando</option>
            <option value="Pausado">Pausado</option>
            <option value="Encerrado">Encerrado</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Risco</label>
          <select name="risco" defaultValue="Baixo" className={inputClass}>
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label className={labelClass}>Próxima Entrega</label>
          <input name="proxima_entrega" className={inputClass} />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            Adicionar cliente
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Data Entrada</th>
              <th className="px-4 py-3">Semana Projeto</th>
              <th className="px-4 py-3">Responsável</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risco</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground">{c.client_name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.data_entrada ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatProjectWeek(c.data_entrada)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.responsavel ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.status}
                </td>
                <td className={`px-4 py-3 font-medium ${riscoColor(c.risco)}`}>
                  {c.risco}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/controle-operacoes/${c.id}/editar`}
                      className="text-xs font-medium text-accent hover:text-accent/80"
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      onDelete={deleteClientStatus.bind(null, c.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
