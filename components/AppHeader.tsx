"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/delivery-apps": "Delivery Apps",
  "/meta-ads": "Meta Ads",
  "/controle-operacoes": "Controle de Operações",
  "/operation-health-score": "Operation Health Score",
};

export function AppHeader({
  userEmail,
  onMenuClick,
}: {
  userEmail: string | null;
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const title =
    Object.entries(TITLES).find(([href]) => pathname?.startsWith(href))?.[1] ??
    "Central de Resultados";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="-ml-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </h1>
      </div>

      {userEmail && (
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-muted-foreground md:inline">
            {userEmail}
          </span>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-accent sm:h-9 sm:w-9">
            {userEmail.slice(0, 2).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
