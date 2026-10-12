"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PerformanceHeader } from "@/components/delivery/PerformanceHeader";
import { MetaKpiGrid, type MetaKpiTotals } from "@/components/meta/MetaKpiGrid";
import { MetaRadar } from "@/components/meta/MetaRadar";
import { MetaOperationsTable, type MetaOperationRow } from "@/components/meta/MetaOperationsTable";
import { MetaHistoryTable } from "@/components/meta/MetaHistoryTable";
import { MetaClientDetail } from "@/components/meta/MetaClientDetail";
import { deleteMetaAdsEntry } from "@/app/(protected)/meta-ads/actions";
import { resolvePeriod, listWeeks, aggregateMeta, type PeriodOption, type MetaAggregate } from "@/lib/period";
import { percentDelta } from "@/lib/calc";
import { buildMetaRadarFindings } from "@/lib/radar";
import type { MetaAdsEntry } from "@/lib/types";

const MetaEvolution = dynamic(
  () => import("@/components/meta/MetaEvolution").then((m) => m.MetaEvolution),
  { loading: () => <div className="h-[280px] animate-pulse rounded-xl border border-border bg-card" /> },
);

function sumAgg(list: (MetaAggregate | null)[]): MetaAggregate | null {
  const present = list.filter((a): a is MetaAggregate => a != null);
  if (present.length === 0) return null;
  return {
    invested: present.reduce((s, a) => s + a.invested, 0),
    results: present.reduce((s, a) => s + a.results, 0),
    revenue: present.reduce((s, a) => s + a.revenue, 0),
  };
}

function derived(a: MetaAggregate | null) {
  if (!a) return null;
  return {
    roas: a.invested > 0 ? a.revenue / a.invested : 0,
    cpr: a.results > 0 ? a.invested / a.results : null,
    vpr: a.results > 0 ? a.revenue / a.results : null,
  };
}

export function MetaPerformanceDashboard({ rows, clients }: { rows: MetaAdsEntry[]; clients: string[] }) {
  const [period, setPeriod] = useState<PeriodOption>("esta_semana");
  const [clientFilter, setClientFilter] = useState("Todos");
  const [openClient, setOpenClient] = useState<string | null>(null);

  const filteredClients = useMemo(() => (clientFilter === "Todos" ? clients : [clientFilter]), [clientFilter, clients]);
  const weeks = useMemo(() => listWeeks(rows), [rows]);
  const [pickedWeek, setPickedWeek] = useState<string | null>(null);
  const selectedWeek = pickedWeek ?? weeks[0]?.value;
  const buckets = useMemo(
    () => resolvePeriod(period, rows, selectedWeek),
    [period, rows, selectedWeek],
  );

  const perClient: MetaOperationRow[] = useMemo(
    () =>
      filteredClients.map((name) => {
        const clientRows = rows.filter((r) => r.clients?.name === name);
        return {
          name,
          current: aggregateMeta(clientRows, buckets.currentStartDates),
          previous: buckets.previousStartDates ? aggregateMeta(clientRows, buckets.previousStartDates) : null,
        };
      }),
    [rows, filteredClients, buckets],
  );

  const totals: MetaKpiTotals = useMemo(() => {
    const cur = sumAgg(perClient.map((c) => c.current));
    const prev = sumAgg(perClient.map((c) => c.previous));
    const dc = derived(cur);
    const dp = derived(prev);
    return {
      invested: cur?.invested ?? 0,
      investedDelta: cur && prev ? percentDelta(cur.invested, prev.invested) : null,
      revenue: cur?.revenue ?? 0,
      revenueDelta: cur && prev ? percentDelta(cur.revenue, prev.revenue) : null,
      roas: dc?.roas ?? 0,
      roasDelta: dc && dp && dc.roas > 0 ? percentDelta(dc.roas, dp.roas) : null,
      results: cur?.results ?? 0,
      resultsDelta: cur && prev ? percentDelta(cur.results, prev.results) : null,
      cpr: dc?.cpr ?? null,
      cprDelta: dc?.cpr != null && dp?.cpr != null ? percentDelta(dc.cpr, dp.cpr) : null,
      vpr: dc?.vpr ?? null,
      vprDelta: dc?.vpr != null && dp?.vpr != null ? percentDelta(dc.vpr, dp.vpr) : null,
    };
  }, [perClient]);

  const findings = useMemo(() => buildMetaRadarFindings(perClient), [perClient]);

  const scopedRows = useMemo(() => rows.filter((r) => filteredClients.includes(r.clients?.name ?? "")), [rows, filteredClients]);
  const historyRows = useMemo(() => [...scopedRows].sort((a, b) => b.start_date.localeCompare(a.start_date)), [scopedRows]);

  const open = perClient.find((c) => c.name === openClient) ?? null;
  const openHistory = openClient
    ? rows.filter((r) => r.clients?.name === openClient).sort((a, b) => b.start_date.localeCompare(a.start_date))
    : [];

  return (
    <div className="space-y-8">
      <PerformanceHeader
        title="Performance Meta Ads"
        subtitle="Retorno, custo e volume de resultados dos anúncios por operação."
        period={period}
        onPeriodChange={setPeriod}
        client={clientFilter}
        onClientChange={setClientFilter}
        clients={clients}
        periodLabel={buckets.currentLabel}
        compareLabel={buckets.previousLabel}
        weeks={weeks}
        selectedWeek={selectedWeek}
        onWeekChange={setPickedWeek}
      />
      <MetaKpiGrid totals={totals} compareLabel={buckets.previousLabel} />
      <MetaRadar findings={findings} />
      <MetaOperationsTable rows={perClient} onOpenClient={setOpenClient} />
      <MetaEvolution rows={scopedRows} clients={filteredClients} />
      <MetaHistoryTable rows={historyRows} onDelete={deleteMetaAdsEntry} />
      <MetaClientDetail
        client={openClient}
        onClose={() => setOpenClient(null)}
        current={open?.current ?? null}
        previous={open?.previous ?? null}
        currentLabel={buckets.currentLabel}
        previousLabel={buckets.previousLabel}
        history={openHistory}
      />
    </div>
  );
}
