"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PerformanceHeader } from "@/components/delivery/PerformanceHeader";
import { KpiGrid, type KpiTotals } from "@/components/delivery/KpiGrid";
import { PerformanceRadar } from "@/components/delivery/PerformanceRadar";
import {
  OperationsPerformanceTable,
  type OperationRow,
} from "@/components/delivery/OperationsPerformanceTable";
import { WeeklyHistoryTable } from "@/components/delivery/WeeklyHistoryTable";
import { ClientPerformanceDetail } from "@/components/delivery/ClientPerformanceDetail";
import { deleteDeliveryEntry } from "@/app/(protected)/delivery-apps/actions";
import {
  resolvePeriod,
  aggregateDelivery,
  type PeriodOption,
} from "@/lib/period";
import { percentDelta } from "@/lib/calc";
import { buildRadarFindings } from "@/lib/radar";
import type { DeliveryEntry } from "@/lib/types";

const EvolutionSection = dynamic(
  () =>
    import("@/components/delivery/EvolutionSection").then(
      (m) => m.EvolutionSection,
    ),
  {
    loading: () => (
      <div className="h-[280px] animate-pulse rounded-xl border border-border bg-card" />
    ),
  },
);

export function DeliveryPerformanceDashboard({
  rows,
  clients,
}: {
  rows: DeliveryEntry[];
  clients: string[];
}) {
  const [period, setPeriod] = useState<PeriodOption>("esta_semana");
  const [clientFilter, setClientFilter] = useState("Todos");
  const [openClient, setOpenClient] = useState<string | null>(null);

  const filteredClients = useMemo(
    () => (clientFilter === "Todos" ? clients : [clientFilter]),
    [clientFilter, clients],
  );

  const buckets = useMemo(() => resolvePeriod(period, rows), [period, rows]);

  const perClient = useMemo(() => {
    return filteredClients.map((name) => {
      const clientRows = rows.filter((r) => r.clients?.name === name);
      return {
        name,
        current: aggregateDelivery(clientRows, buckets.currentStartDates),
        previous: buckets.previousStartDates
          ? aggregateDelivery(clientRows, buckets.previousStartDates)
          : null,
      };
    });
  }, [rows, filteredClients, buckets]);

  const totals: KpiTotals = useMemo(() => {
    const withCurrent = perClient.filter((c) => c.current);
    const withPrevious = perClient.filter((c) => c.previous);

    const sum = (list: typeof perClient, pick: "current" | "previous", field: "revenue" | "orders" | "promoInvestment" | "payout") =>
      list.reduce((acc, c) => acc + (c[pick]?.[field] ?? 0), 0);

    const revenue = sum(withCurrent, "current", "revenue");
    const prevRevenue = withPrevious.length ? sum(withPrevious, "previous", "revenue") : null;
    const orders = sum(withCurrent, "current", "orders");
    const prevOrders = withPrevious.length ? sum(withPrevious, "previous", "orders") : null;
    const promo = sum(withCurrent, "current", "promoInvestment");
    const prevPromo = withPrevious.length ? sum(withPrevious, "previous", "promoInvestment") : null;
    const payout = sum(withCurrent, "current", "payout");
    const prevPayout = withPrevious.length ? sum(withPrevious, "previous", "payout") : null;

    const aov = orders > 0 ? revenue / orders : 0;
    const prevAov = prevOrders ? (prevRevenue ?? 0) / prevOrders : null;

    const ratings = withCurrent.map((c) => c.current!.rating).filter((v): v is number => v != null);
    const rating = ratings.length ? ratings.reduce((s, v) => s + v, 0) / ratings.length : null;
    const prevRatings = withPrevious.map((c) => c.previous!.rating).filter((v): v is number => v != null);
    const prevRating = prevRatings.length ? prevRatings.reduce((s, v) => s + v, 0) / prevRatings.length : null;

    return {
      revenue,
      revenueDelta: percentDelta(revenue, prevRevenue),
      orders,
      ordersDelta: percentDelta(orders, prevOrders),
      aov,
      aovDelta: percentDelta(aov, prevAov),
      payout,
      payoutDelta: percentDelta(payout, prevPayout),
      promo,
      promoDelta: percentDelta(promo, prevPromo),
      rating,
      ratingDelta: rating != null && prevRating != null ? rating - prevRating : null,
    };
  }, [perClient]);

  const radarFindings = useMemo(() => buildRadarFindings(perClient), [perClient]);

  const historyRows = useMemo(() => {
    return rows
      .filter((r) => filteredClients.includes(r.clients?.name ?? ""))
      .sort((a, b) => b.start_date.localeCompare(a.start_date));
  }, [rows, filteredClients]);

  const operationRows: OperationRow[] = perClient;

  const openClientData = perClient.find((c) => c.name === openClient) ?? null;
  const openClientHistory = openClient
    ? rows
        .filter((r) => r.clients?.name === openClient)
        .sort((a, b) => b.start_date.localeCompare(a.start_date))
    : [];

  return (
    <div className="space-y-8">
      <PerformanceHeader
        period={period}
        onPeriodChange={setPeriod}
        client={clientFilter}
        onClientChange={setClientFilter}
        clients={clients}
      />

      <KpiGrid totals={totals} compareLabel={buckets.previousLabel} />

      <PerformanceRadar findings={radarFindings} />

      <OperationsPerformanceTable
        rows={operationRows}
        onOpenClient={setOpenClient}
      />

      <EvolutionSection rows={rows.filter((r) => filteredClients.includes(r.clients?.name ?? ""))} clients={filteredClients} />

      <WeeklyHistoryTable rows={historyRows} onDelete={deleteDeliveryEntry} />

      <ClientPerformanceDetail
        client={openClient}
        onClose={() => setOpenClient(null)}
        current={openClientData?.current ?? null}
        previous={openClientData?.previous ?? null}
        currentLabel={buckets.currentLabel}
        previousLabel={buckets.previousLabel}
        history={openClientHistory}
      />
    </div>
  );
}
