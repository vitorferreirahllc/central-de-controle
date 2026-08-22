"use client";

import { useTransition } from "react";

export function DeleteButton({
  onDelete,
}: {
  onDelete: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Excluir este lançamento?")) {
          startTransition(() => {
            onDelete();
          });
        }
      }}
      disabled={isPending}
      className="text-xs font-medium text-destructive hover:text-destructive/80 disabled:opacity-50"
    >
      {isPending ? "..." : "Excluir"}
    </button>
  );
}
