import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";
import { WaveBackground } from "@/components/WaveBackground";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black lg:flex-row">
      <WaveBackground />

      <div className="relative z-10 flex w-full flex-col justify-between px-8 py-10 md:px-16 md:py-14 lg:w-3/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black">
            <Image src="/logo.png" alt="H Performance LLC" width={40} height={40} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">
              H Performance LLC
            </p>
            <p className="text-xs tracking-[0.2em] text-neutral-400">
              CENTRAL DE RESULTADOS
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Bem-vindo à Central de{" "}
            <span className="text-lime-400">Resultados</span>
          </h1>
          <p className="mt-4 text-lg text-neutral-300">
            Seus clientes começam aqui.
          </p>
          <p className="mt-4 max-w-md text-sm text-neutral-400">
            Acompanhe o faturamento de delivery e o desempenho das campanhas
            de Meta Ads de cada cliente, semana a semana, tudo em um só
            lugar.
          </p>
          <p className="mt-6 text-xs text-neutral-500">
            Tudo em um só lugar.
            <br />
            Rápido. Seguro. Inteligente.
          </p>
        </div>

        <div />
      </div>

      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-6 pb-24 lg:w-2/5 lg:pb-0">
        <LoginForm />
      </div>

      <div className="relative z-10 pb-6 text-center text-xs text-neutral-500 lg:absolute lg:bottom-6 lg:right-16 lg:pb-0 lg:text-right">
        © H Performance LLC. All rights reserved.
      </div>
    </div>
  );
}
