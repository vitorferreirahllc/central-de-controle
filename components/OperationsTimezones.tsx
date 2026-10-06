"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HQ_TIMEZONE,
  OPERATIONS_TIMEZONES,
  getUtcOffsetMinutes,
  formatLocalTime,
  formatUtcLabel,
  formatDiffLabel,
  formatDiffBadge,
} from "@/lib/timezones";

type SortMode = "none" | "closest" | "farthest";

export function OperationsTimezones() {
  const [now, setNow] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("Todos");
  const [sort, setSort] = useState<SortMode>("none");
  const [unitByOp, setUnitByOp] = useState<Record<string, number>>({});

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const hqOffset = now ? getUtcOffsetMinutes(HQ_TIMEZONE, now) : 0;
  const hqTime = now ? formatLocalTime(HQ_TIMEZONE, now) : "--:--";

  const operations = useMemo(() => {
    if (!now) return [];
    return OPERATIONS_TIMEZONES.map((op) => {
      const offset = getUtcOffsetMinutes(op.timezone, now);
      const diff = offset - hqOffset;
      return {
        ...op,
        localTime: formatLocalTime(op.timezone, now),
        offset,
        diff,
        utcLabel: formatUtcLabel(offset),
        diffLabel: formatDiffLabel(diff),
        diffBadge: formatDiffBadge(diff),
      };
    });
  }, [now, hqOffset]);

  const groups = useMemo(() => {
    const map = new Map<
      string,
      { utcLabel: string; diff: number; timezone: string; count: number }
    >();
    for (const op of operations) {
      const existing = map.get(op.utcLabel);
      if (existing) {
        existing.count += op.units?.length ?? 1;
      } else {
        map.set(op.utcLabel, {
          utcLabel: op.utcLabel,
          diff: op.diff,
          timezone: op.timezone,
          count: op.units?.length ?? 1,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.diff - a.diff);
  }, [operations]);

  const filtered = useMemo(() => {
    let list = operations;

    if (filter !== "Todos") {
      list = list.filter((op) => op.utcLabel === filter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (op) =>
          op.name.toLowerCase().includes(q) ||
          op.city.toLowerCase().includes(q) ||
          (op.units ?? []).some(
            (u) =>
              u.label.toLowerCase().includes(q) ||
              u.city.toLowerCase().includes(q),
          ),
      );
    }

    if (sort === "closest") {
      list = [...list].sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
    } else if (sort === "farthest") {
      list = [...list].sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    }

    return list;
  }, [operations, filter, search, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Fusos Horários das Operações
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Horário de cada operação comparado em tempo real com a sede em
          Brasília.
        </p>
      </div>

      {/* Barra de referência da sede */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/40 bg-accent/10 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Sede • Brasília
            </p>
            <p className="text-sm text-muted-foreground">
              🇧🇷 Brasília, Brasil · {HQ_TIMEZONE}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {hqTime}
          </p>
          <p className="text-xs text-muted-foreground">Horário de referência</p>
        </div>
      </div>

      {/* Resumo por fuso */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g) => (
          <div
            key={g.utcLabel}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {g.utcLabel}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {g.count === 1 ? "1 operação" : `${g.count} operações`}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
              {formatLocalTime(g.timezone, now ?? new Date())}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDiffLabel(g.diff)}
            </p>
          </div>
        ))}
      </div>

      {/* Busca e filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar operação ou cidade…"
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("Todos")}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium transition",
              filter === "Todos"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            Todos
          </button>
          {groups.map((g) => (
            <button
              key={g.utcLabel}
              onClick={() => setFilter(g.utcLabel)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition",
                filter === g.utcLabel
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {g.utcLabel}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="none">Ordenar por…</option>
          <option value="closest">Mais próximo de Brasília</option>
          <option value="farthest">Mais distante de Brasília</option>
        </select>
      </div>

      {/* Cards das operações */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma operação encontrada.
          </p>
        )}
        {filtered.map((op) => (
          <div
            key={op.name}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{op.name}</h3>
                {op.units ? (
                  <div className="mt-1.5">
                    <select
                      value={unitByOp[op.name] ?? 0}
                      onChange={(e) =>
                        setUnitByOp((prev) => ({
                          ...prev,
                          [op.name]: Number(e.target.value),
                        }))
                      }
                      aria-label={`Unidade de ${op.name}`}
                      className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                      {op.units.map((u, i) => (
                        <option key={u.label} value={i}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {op.flag} {op.units[unitByOp[op.name] ?? 0].city},{" "}
                      {op.units[unitByOp[op.name] ?? 0].region}
                    </p>
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {op.flag} {op.city}, {op.region}
                  </p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {op.utcLabel}
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold tabular-nums text-foreground">
              {op.localTime}
            </p>
            <p className="text-[11px] text-muted-foreground">Horário local</p>

            <div
              className={cn(
                "mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                op.diff === 0
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning",
              )}
              title={op.diffLabel}
            >
              {op.diffBadge}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
