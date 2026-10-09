"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateBR, type Opportunity, type OpportunityKind } from "@/lib/contracts";

const KIND_STYLES: Record<OpportunityKind, { dot: string; badge: string; label: string }> = {
  vencido: {
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
    label: "Vencido",
  },
  antecipado: {
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
    label: "Saída antecipada",
  },
  renovar_agora: {
    dot: "bg-warning",
    badge: "bg-warning/10 text-warning",
    label: "Renovar agora",
  },
  preparar: {
    dot: "bg-accent",
    badge: "bg-accent/10 text-accent",
    label: "Preparar",
  },
};

export function OpportunityAlerts({
  opportunities,
}: {
  opportunities: Opportunity[];
}) {
  const [open, setOpen] = useState(false);
  const count = opportunities.length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors",
          count > 0
            ? "border-accent/50 bg-accent/10 hover:bg-accent/15"
            : "border-border bg-card hover:bg-secondary",
        )}
      >
        <Sparkles
          className={cn("h-4 w-4", count > 0 ? "text-accent" : "text-muted-foreground")}
        />
        <span
          className={cn(
            "text-xl font-bold tabular-nums",
            count > 0 ? "text-accent" : "text-foreground",
          )}
        >
          {count}
        </span>
        <span className="text-xs text-muted-foreground">Oportunidades</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-40 mt-2 w-[min(92vw,520px)] rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Oportunidades de renovação
              </h3>
              <p className="text-xs text-muted-foreground">
                Contratos que pedem ação comercial, do mais urgente ao menos.
              </p>
            </div>

            {count === 0 ? (
              <p className="rounded-lg bg-secondary px-3 py-4 text-center text-xs text-muted-foreground">
                Nenhuma oportunidade agora — todos os contratos estão com prazo
                confortável.
              </p>
            ) : (
              <ul className="max-h-[60vh] space-y-2 overflow-y-auto">
                {opportunities.map((o) => {
                  const s = KIND_STYLES[o.kind];
                  return (
                    <li
                      key={o.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
                    >
                      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", s.dot)} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {o.name}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-medium",
                              s.badge,
                            )}
                          >
                            {s.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {o.title} · {formatDateBR(o.endDate)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-foreground">
                          → {o.action}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
