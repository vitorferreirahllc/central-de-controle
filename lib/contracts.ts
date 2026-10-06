const MS_PER_DAY = 86_400_000;

const WARNING_DAYS = 30;
const CRITICAL_DAYS = 14;

function toUtcDay(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Data de hoje (YYYY-MM-DD) no fuso de Brasília, que é a referência do time. */
export function todayInBrasilia(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export type ContractState = "ativo" | "atencao" | "critico" | "encerrado";

export type ContractProgress = {
  /** Operação marcada como Encerrada antes da data final do contrato. */
  early: boolean;
  totalDays: number;
  /** Dias até a data final; negativo quando o contrato já encerrou. */
  remainingDays: number;
  percent: number;
  state: ContractState;
};

export function contractProgress(
  start: string,
  end: string,
  today: string,
  clientEnded = false,
): ContractProgress {
  const totalDays = Math.max(1, (toUtcDay(end) - toUtcDay(start)) / MS_PER_DAY);
  const elapsed = (toUtcDay(today) - toUtcDay(start)) / MS_PER_DAY;
  const remainingDays = (toUtcDay(end) - toUtcDay(today)) / MS_PER_DAY;
  const percent = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  const early = clientEnded && remainingDays >= 0;

  let state: ContractState = "ativo";
  if (remainingDays < 0 || early) state = "encerrado";
  else if (remainingDays <= CRITICAL_DAYS) state = "critico";
  else if (remainingDays <= WARNING_DAYS) state = "atencao";

  return { early, totalDays, remainingDays, percent, state };
}

export function formatDays(days: number): string {
  const n = Math.abs(days);
  return n === 1 ? "1 dia" : `${n} dias`;
}

/**
 * Contrato e status da operação são a mesma informação vista de dois lados:
 * contrato vencido => operação Encerrada; operação Encerrada => contrato
 * Encerrado (antecipadamente, se ainda estava no prazo).
 */
export function effectiveStatus<S extends string>(
  status: S,
  contractEnd: string | null | undefined,
  today: string,
): S | "Encerrado" {
  return contractEnd && contractEnd < today ? "Encerrado" : status;
}

export function contractSituation(
  contractEnd: string,
  status: string,
  today: string,
): "vigente" | "encerrado" {
  return contractEnd < today || status === "Encerrado" ? "encerrado" : "vigente";
}
