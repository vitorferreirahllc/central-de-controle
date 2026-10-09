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

export type OpportunityKind =
  | "vencido"
  | "renovar_agora"
  | "antecipado"
  | "preparar";

export type Opportunity = {
  id: number;
  name: string;
  produto: string;
  kind: OpportunityKind;
  /** Quanto menor, mais urgente. */
  priority: number;
  title: string;
  action: string;
  endDate: string;
};

const PREPARE_DAYS = 60;
const COLD_AFTER_DAYS = 90;

/**
 * Transforma o estado dos contratos em oportunidades comerciais, só com o que
 * pede ação: vencidos recentes, vencendo em até 60 dias e encerramentos
 * antecipados. Contratos vencidos há mais de 90 dias esfriam e saem da lista.
 */
export function buildOpportunities(
  items: {
    id: number;
    name: string;
    produto: string;
    fim: string;
    remainingDays: number;
    state: ContractState;
    early: boolean;
  }[],
): Opportunity[] {
  const out: Opportunity[] = [];
  for (const i of items) {
    const base = { id: i.id, name: i.name, produto: i.produto, endDate: i.fim };
    if (i.early) {
      out.push({
        ...base,
        kind: "antecipado",
        priority: 2,
        title: `Encerrado antes do prazo (faltavam ${formatDays(i.remainingDays)})`,
        action: "Entender o motivo e tentar reter",
      });
    } else if (i.state === "encerrado") {
      const since = -i.remainingDays;
      if (since > COLD_AFTER_DAYS) continue;
      out.push({
        ...base,
        kind: "vencido",
        priority: since <= 30 ? 0 : 3,
        title: `Contrato vencido há ${formatDays(since)}`,
        action: "Propor renovação ou upsell",
      });
    } else if (i.remainingDays <= 30) {
      out.push({
        ...base,
        kind: "renovar_agora",
        priority: 1,
        title: `Vence em ${formatDays(i.remainingDays)}`,
        action: "Fechar a renovação agora",
      });
    } else if (i.remainingDays <= PREPARE_DAYS) {
      out.push({
        ...base,
        kind: "preparar",
        priority: 4,
        title: `Vence em ${formatDays(i.remainingDays)}`,
        action: "Montar a proposta de renovação",
      });
    }
  }
  return out.sort(
    (a, b) => a.priority - b.priority || a.endDate.localeCompare(b.endDate),
  );
}
