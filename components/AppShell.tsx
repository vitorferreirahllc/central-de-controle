"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";

export function AppShell({
  userEmail,
  children,
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-out",
          collapsed ? "ml-[72px]" : "ml-[260px]",
        )}
      >
        <AppHeader userEmail={userEmail} />
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
