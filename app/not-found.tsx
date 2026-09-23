import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        404
      </p>
      <h1 className="text-2xl font-bold text-foreground">
        Página não encontrada
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        O que você procura não existe ou foi removido.
      </p>
      <a
        href="/dashboard"
        className="mt-2 flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
      >
        <Home className="h-4 w-4" />
        Ir para o Dashboard
      </a>
    </div>
  );
}
