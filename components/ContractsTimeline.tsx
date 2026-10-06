import { cn } from "@/lib/utils";
import {
  contractProgress,
  formatDateBR,
  formatDays,
  type ContractState,
} from "@/lib/contracts";
import type { ClientContract } from "@/lib/types";

const STATE_STYLES: Record<
  ContractState,
  { badge: string; badgeLabel: string; bar: string; days: string }
> = {
  ativo: {
    badge: "bg-success/10 text-success",
    badgeLabel: "Em andamento",
    bar: "bg-accent",
    days: "text-foreground",
  },
  atencao: {
    badge: "bg-warning/10 text-warning",
    badgeLabel: "Vence em 30 dias",
    bar: "bg-warning",
    days: "text-warning",
  },
  critico: {
    badge: "bg-destructive/10 text-destructive",
    badgeLabel: "Vence em 14 dias",
    bar: "bg-destructive",
    days: "text-destructive",
  },
  encerrado: {
    badge: "bg-secondary text-muted-foreground",
    badgeLabel: "Encerrado",
    bar: "bg-muted-foreground/40",
    days: "text-muted-foreground",
  },
};

export function ContractsTimeline({
  contracts,
  today,
}: {
  contracts: ClientContract[];
  today: string;
}) {
  const items = contracts
    .map((c) => ({
      id: c.id,
      name: (c.client_status?.client_name ?? "Cliente").trim(),
      produto: c.produto,
      inicio: c.data_inicio,
      fim: c.data_fim,
      resumo: c.resumo,
      ...contractProgress(c.data_inicio, c.data_fim, today),
    }))
    .sort((a, b) => {
      const aEnded = a.state === "encerrado";
      const bEnded = b.state === "encerrado";
      if (aEnded !== bEnded) return aEnded ? 1 : -1;
      return aEnded ? b.fim.localeCompare(a.fim) : a.remainingDays - b.remainingDays;
    });

  const active = items.filter((i) => i.state !== "encerrado").length;
  const expiring = items.filter(
    (i) => i.state === "atencao" || i.state === "critico",
  ).length;
  const ended = items.length - active;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Contratos e prazos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tempo restante e data final de cada contrato, do mais próximo de
          vencer ao mais distante.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <SummaryChip label="Em andamento" value={active} />
        <SummaryChip
          label="Vencem em 30 dias"
          value={expiring}
          tone={expiring > 0 ? "warning" : undefined}
        />
        <SummaryChip label="Encerrados" value={ended} />
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum contrato cadastrado ainda.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const style = STATE_STYLES[item.state];
          const isEnded = item.state === "encerrado";
          const daysLabel = isEnded
            ? "Encerrado há"
            : item.remainingDays === 0
              ? "Termina"
              : "Faltam";
          const daysValue =
            !isEnded && item.remainingDays === 0
              ? "Hoje"
              : formatDays(item.remainingDays);

          return (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {item.produto}
                  </span>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    style.badge,
                  )}
                >
                  {style.badgeLabel}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    {daysLabel}
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold tabular-nums tracking-tight",
                      style.days,
                    )}
                  >
                    {daysValue}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Data final
                  </p>
                  <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                    {formatDateBR(item.fim)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full transition-all", style.bar)}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-muted-foreground">
                  <span>Início {formatDateBR(item.inicio)}</span>
                  <span>{Math.round(item.percent)}% concluído</span>
                </div>
              </div>

              {item.resumo && (
                <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                  {item.resumo}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "warning";
}) {
  return (
    <div className="flex items-baseline gap-2 rounded-lg border border-border bg-card px-4 py-2">
      <span
        className={cn(
          "text-xl font-bold tabular-nums",
          tone === "warning" ? "text-warning" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
