"use client";

import { useRouter } from "next/navigation";

export function ResultsFilter({
  basePath,
  clients,
  weeks,
  selectedClient,
  selectedWeek,
}: {
  basePath: string;
  clients: string[];
  weeks: { value: string; label: string }[];
  selectedClient: string;
  selectedWeek: string;
}) {
  const router = useRouter();

  function updateParam(key: "client" | "week", value: string) {
    const params = new URLSearchParams();
    params.set("client", key === "client" ? value : selectedClient);
    params.set("week", key === "week" ? value : selectedWeek);
    router.push(`${basePath}?${params.toString()}`);
  }

  const selectClass =
    "rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={selectedClient}
        onChange={(e) => updateParam("client", e.target.value)}
        className={selectClass}
      >
        <option value="Todos">Todos os clientes</option>
        {clients.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={selectedWeek}
        onChange={(e) => updateParam("week", e.target.value)}
        className={selectClass}
      >
        <option value="Todas">Todas as semanas</option>
        {weeks.map((w) => (
          <option key={w.value} value={w.value}>
            {w.label}
          </option>
        ))}
      </select>
    </div>
  );
}
