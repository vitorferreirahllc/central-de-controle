"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/delivery-apps": "Delivery Apps",
  "/meta-ads": "Meta Ads",
  "/semana-projeto": "Semana do Projeto",
  "/saude-cliente": "Saúde do Cliente",
};

export function AppHeader({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const title =
    Object.entries(TITLES).find(([href]) => pathname?.startsWith(href))?.[1] ??
    "Central de Resultados";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      {userEmail && (
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground md:inline">
            {userEmail}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-accent">
            {userEmail.slice(0, 2).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
