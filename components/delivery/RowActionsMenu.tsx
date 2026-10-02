"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";

export function RowActionsMenu({
  onDelete,
}: {
  onDelete: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mais ações"
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-lg">
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (confirm("Excluir este lançamento?")) {
                  startTransition(() => {
                    onDelete();
                  });
                }
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isPending ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
