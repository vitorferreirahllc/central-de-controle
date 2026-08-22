"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      // localStorage indisponível (modo privado, etc.) — o toggle ainda funciona na sessão atual
    }
  }

  const Icon = light ? Moon : Sun;

  return (
    <button
      onClick={toggle}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span
        className={cn(
          "whitespace-nowrap transition-all duration-300",
          collapsed ? "w-0 overflow-hidden opacity-0" : "opacity-100",
        )}
      >
        {light ? "Modo escuro" : "Modo claro"}
      </span>
    </button>
  );
}
