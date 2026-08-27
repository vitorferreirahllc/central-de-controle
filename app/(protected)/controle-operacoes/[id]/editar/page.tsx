import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ClientStatus } from "@/lib/types";
import { formatProjectWeek } from "@/lib/calc";
import { updateClientStatus } from "../../actions";

const inputClass =
  "w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";
const labelClass = "mb-1 block text-xs font-medium text-muted-foreground";

export default async function EditarClientStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("client_status")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!data) {
    notFound();
  }

  const c = data as ClientStatus;
  const updateWithId = updateClientStatus.bind(null, c.id);

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Editando <span className="text-foreground">{c.client_name}</span>
      </p>

      <form
        action={updateWithId}
        className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2"
      >
        <div>
          <label className={labelClass}>Cliente</label>
          <input
            name="client_name"
            required
            defaultValue={c.client_name}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Data Entrada</label>
          <input
            name="data_entrada"
            type="date"
            required
            defaultValue={c.data_entrada ?? ""}
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Semana/mês atual: {formatProjectWeek(c.data_entrada)}
          </p>
        </div>

        <div>
          <label className={labelClass}>Responsável</label>
          <input
            name="responsavel"
            defaultValue={c.responsavel ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            defaultValue={c.status}
            className={inputClass}
          >
            <option value="Onboarding">Onboarding</option>
            <option value="Operando">Operando</option>
            <option value="Pausado">Pausado</option>
            <option value="Encerrado">Encerrado</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Risco</label>
          <select name="risco" defaultValue={c.risco} className={inputClass}>
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Próxima Entrega</label>
          <input
            name="proxima_entrega"
            defaultValue={c.proxima_entrega ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            Salvar alterações
          </button>
          <a
            href="/controle-operacoes"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
