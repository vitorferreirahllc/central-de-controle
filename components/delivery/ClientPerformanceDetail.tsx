"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatNumber,
  percentDelta,
  repassePercent,
  promoPercent,
} from "@/lib/calc";
import { formatPeriodLabel } from "@/lib/period";
import { DeltaIndicator } from "@/components/DeltaIndicator";
import type { DeliveryAggregate } from "@/lib/period";
import type { DeliveryEntry } from "@/lib/types";

function aov(agg: DeliveryAggregate) {
  return agg.orders > 0 ? agg.revenue / agg.orders : 0;
}

export function ClientPerformanceDetail({
  client,
  onClose,
  current,
  previous,
  currentLabel,
  previousLabel,
  history,
}: {
  client: string | null;
  onClose: () => void;
  current: DeliveryAggregate | null;
  previous: DeliveryAggregate | null;
  currentLabel: string;
  previousLabel: string | null;
  history: DeliveryEntry[];
}) {
  const open = client != null;

  const aovCurrent = current ? aov(current) : 0;
  const aovPrevious = previous ? aov(previous) : null;

  const metrics = current
    ? [
        {
          label: "Faturamento",
          value: formatCurrency(current.revenue),
          delta: previous ? percentDelta(current.revenue, previous.revenue) : null,
        },
        {
          label: "Pedidos",
          value: formatNumber(current.orders),
          delta: previous ? percentDelta(current.orders, previous.orders) : null,
        },
        {
          label: "Ticket Médio",
          value: formatCurrency(aovCurrent),
          delta: previous ? percentDelta(aovCurrent, aovPrevious) : null,
        },
        {
          label: "Repasse",
          value: formatCurrency(current.payout),
          delta: previous ? percentDelta(current.payout, previous.payout) : null,
        },
        {
          label: "Promoções",
          value: formatCurrency(current.promoInvestment),
          delta: previous ? percentDelta(current.promoInvestment, previous.promoInvestment) : null,
        },
        {
          label: "Avaliação",
          value: current.rating != null ? current.rating.toFixed(1) : "—",
          delta:
            current.rating != null && previous?.rating != null
              ? current.rating - previous.rating
              : null,
          unit: "absolute" as const,
        },
      ]
    : [];

  const repassePct = current ? repassePercent(current.payout, current.revenue) : null;
  const promoPct = current ? promoPercent(current.promoInvestment, current.revenue) : null;

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label="Detalhamento da operação"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-card p-6 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {client && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{client}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {currentLabel}
              {previousLabel && ` · comparado com ${previousLabel}`}
            </p>

            {!current ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Nenhum lançamento desse cliente nesse período.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">
                      {m.label}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-foreground">
                        {m.value}
                      </p>
                      <DeltaIndicator value={m.delta} unit={m.unit ?? "percent"} />
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Repasse %</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {repassePct != null ? `${repassePct.toFixed(1)}%` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Promo %</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {promoPct != null ? `${promoPct.toFixed(1)}% da receita` : "—"}
                  </span>
                </div>
              </div>
            )}

            <h3 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico
            </h3>
            <div className="space-y-2">
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground">Sem histórico.</p>
              )}
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">
                    {formatPeriodLabel(h.start_date, h.end_date)}
                  </span>
                  <span className="tabular-nums text-foreground">
                    {formatCurrency(h.revenue)} · {formatNumber(h.orders)} pedidos
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
