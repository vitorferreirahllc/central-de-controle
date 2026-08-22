"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NexoBackground } from "@/components/NexoBackground";

export default function LoginPage() {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-black">
      <NexoBackground />

      <header className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8 lg:left-12 lg:top-10">
        <img src="/logo-h.png" alt="Logo H Performance" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
      </header>

      <main className="relative z-10 flex flex-col items-start justify-start sm:justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-12 max-w-6xl pt-4 sm:-mt-12 lg:-mt-24 pl-6 sm:pl-12 lg:pl-20">
        <h1 className="text-white text-4xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 text-balance">
          Conecte clientes.
          Controle resultados.
        </h1>

        <button
          onClick={() => setLoginOpen(true)}
          aria-expanded={loginOpen}
          aria-controls="login-panel"
          className="group relative bg-gradient-to-r from-[#A9BD55] to-[#A9BD55] hover:from-[#A9BD55] hover:to-[#A9BD55] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base md:text-xs lg:text-lg font-semibold flex items-center gap-2 backdrop-blur-sm border border-[#A9BD55]/30 shadow-lg shadow-[#A9BD55]/25 hover:shadow-xl hover:shadow-[#A9BD55]/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
        >
          acessar Nexo
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-rotate-12 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </main>

      <div
        aria-hidden={!loginOpen}
        onClick={() => setLoginOpen(false)}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${loginOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        id="login-panel"
        aria-label="Acesso Central de Resultados"
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col justify-center border-l border-white/15 bg-[#111311]/95 px-8 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-out sm:px-12 ${loginOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          type="button"
          aria-label="Fechar acesso"
          onClick={() => setLoginOpen(false)}
          className="absolute right-6 top-6 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-8">
          <img src="/logo-h.png" alt="Logo H Performance" className="mb-6 h-12 w-12 object-contain" />
          <h2 className="text-3xl font-semibold text-white">Acessar Central de Resultados</h2>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-white/75">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#A9BD55] focus:ring-2 focus:ring-[#A9BD55]/25"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/75">
            Senha
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#A9BD55] focus:ring-2 focus:ring-[#A9BD55]/25"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-[#A9BD55] px-4 py-3 text-sm font-semibold text-[#111311] transition hover:bg-[#B8CC67] disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </aside>
    </div>
  );
}
