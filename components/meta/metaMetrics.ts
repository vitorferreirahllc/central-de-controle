import type { MetaAggregate } from "@/lib/period";

export function metaRoas(a: MetaAggregate): number {
  return a.invested > 0 ? a.revenue / a.invested : 0;
}
export function metaCpr(a: MetaAggregate): number | null {
  return a.results > 0 ? a.invested / a.results : null;
}
export function metaValuePerResult(a: MetaAggregate): number | null {
  return a.results > 0 ? a.revenue / a.results : null;
}
export function formatRoas(v: number): string {
  return v > 0 ? `${v.toFixed(2)}x` : "—";
}
