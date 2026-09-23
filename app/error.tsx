"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Algo deu errado
      </p>
      <h1 className="text-2xl font-bold text-foreground">
        Não foi possível completar essa ação
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Tente novamente. Se o problema continuar, verifique sua conexão ou
        volte para o Dashboard.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar de novo
        </button>
        <a
          href="/dashboard"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Ir para o Dashboard
        </a>
      </div>
    </div>
  );
}
