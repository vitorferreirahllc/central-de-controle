"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { importReports, type ImportState } from "./actions";

export function ImportForm() {
  const [state, action, pending] = useActionState<ImportState, FormData>(
    importReports,
    null,
  );

  return (
    <div className="space-y-6">
      <form
        action={action}
        className="rounded-xl border border-dashed border-border bg-card p-6"
      >
        <label className="mb-2 block text-sm font-medium text-foreground">
          Relatório semanal (PDF)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="file"
            accept="application/pdf,.pdf"
            required
            className="block flex-1 min-w-[220px] text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
          />
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {pending ? "Importando..." : "Importar e atualizar"}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Os dados são gravados direto no sistema. Semanas que já existem para o
          cliente não são alteradas.
        </p>
      </form>

      {state?.status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-card p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-foreground">{state.message}</p>
        </div>
      )}

      {state?.status === "done" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {state.imported.length === 0
                ? "Nada novo para lançar"
                : `${state.imported.length} semana(s) lançada(s)`}
            </div>
            <ul className="space-y-1.5 text-sm">
              {state.imported.map((i) => (
                <li key={i.client + i.period} className="flex flex-wrap justify-between gap-2">
                  <span className="text-foreground">
                    {i.client} · {i.period}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Delivery{i.meta ? " + Meta Ads" : ""}
                  </span>
                </li>
              ))}
            </ul>
            {state.imported.some((i) => i.metaMissingResults) && (
              <p className="mt-3 text-xs text-warning">
                O Meta Ads entrou com gasto e retorno, mas sem a linha
                &quot;Meta Ads — compras (quantidade)&quot; — os resultados ficaram em 0.
              </p>
            )}
          </div>

          {state.skipped.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">
                Não lançado ({state.skipped.length})
              </p>
              <ul className="space-y-1.5 text-sm">
                {state.skipped.map((s) => (
                  <li key={s.client + s.period} className="flex flex-wrap justify-between gap-2">
                    <span className="text-muted-foreground">
                      {s.client} · {s.period}
                    </span>
                    <span className="text-xs text-muted-foreground">{s.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {state.warnings.length > 0 && (
            <div className="rounded-xl border border-warning/40 bg-card p-4 text-xs text-muted-foreground">
              {state.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
