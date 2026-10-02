"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { DeltaIndicator } from "@/components/DeltaIndicator";
import { percentDelta } from "@/lib/calc";

export function MiniTrendChart({
  name,
  data,
  valueFormatter,
}: {
  name: string;
  data: { label: string; value: number }[];
  valueFormatter: (value: number) => string;
}) {
  const first = data.length > 0 ? data[0].value : 0;
  const last = data.length > 0 ? data[data.length - 1].value : 0;
  const delta = data.length >= 2 ? percentDelta(last, first) : null;
  const isDown = delta != null && delta < 0;
  const color = delta == null
    ? "var(--muted-foreground)"
    : isDown
      ? "var(--destructive)"
      : "var(--success)";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <DeltaIndicator value={delta} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {data.length > 0 ? valueFormatter(last) : "Sem dados"}
      </p>

      <div className="mt-2 h-16">
        {data.length < 2 ? (
          <div className="flex h-full items-center justify-center text-[11px] text-muted-foreground">
            Dados insuficientes
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`mini-${name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value) => [valueFormatter(Number(value)), ""]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#mini-${name})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
