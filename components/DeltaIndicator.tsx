import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type DeltaUnit = "percent" | "points" | "absolute";

export function DeltaIndicator({
  value,
  unit = "percent",
  size = "sm",
  inverse = false,
}: {
  value: number | null;
  unit?: DeltaUnit;
  size?: "sm" | "md";
  /** Quando menor é melhor (ex.: custo por resultado): inverte verde/vermelho. */
  inverse?: boolean;
}) {
  if (value == null) {
    return (
      <span className="text-xs text-muted-foreground">Sem comparação</span>
    );
  }

  const isFlat = Math.abs(value) < 0.05;
  const isUp = value > 0;
  const good = inverse ? !isUp : isUp;
  const color = isFlat
    ? "text-muted-foreground"
    : good
      ? "text-success"
      : "text-destructive";
  const Icon = isFlat ? Minus : isUp ? ArrowUp : ArrowDown;

  const formatted =
    unit === "percent"
      ? `${Math.abs(value).toFixed(1)}%`
      : unit === "points"
        ? `${Math.abs(value).toFixed(1)} p.p.`
        : Math.abs(value).toFixed(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        size === "sm" ? "text-xs" : "text-sm",
        color,
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {formatted}
    </span>
  );
}
