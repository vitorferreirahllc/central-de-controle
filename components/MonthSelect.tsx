"use client";

import { useRouter } from "next/navigation";

export function MonthSelect({
  months,
  selected,
}: {
  months: string[];
  selected: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selected}
      onChange={(e) => {
        router.push(`/dashboard?month=${encodeURIComponent(e.target.value)}`);
      }}
      className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
    >
      {months.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
