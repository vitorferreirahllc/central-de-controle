import { percentDelta } from "@/lib/calc";
import type { DeliveryAggregate, MetaAggregate } from "@/lib/period";

export type RadarSeverity = "critico" | "atencao";

export type RadarFinding = {
  client: string;
  severity: RadarSeverity;
  revenueDelta: number | null;
  ordersDelta: number | null;
  aovDelta: number | null;
  ratingDelta: number | null;
  promoPct: number | null;
  reasons: string[];
};

const REVENUE_DROP_ATTENTION = -20;
const REVENUE_DROP_CRITICAL = -35;
const AOV_DROP_ATTENTION = -10;
const RATING_CHANGE_ATTENTION = 0.2;
const PROMO_PRESSURE_THRESHOLD = 40;

const MAX_FINDINGS = 6;

/**
 * Regras matemáticas simples, baseadas só nos deltas já calculados. Nunca
 * monta diagnóstico causal — só reporta a evidência (ex.: "Pedidos ↓24%"),
 * não o motivo ("caiu porque reduziram anúncios").
 */
export function buildRadarFindings(
  clients: {
    name: string;
    current: DeliveryAggregate | null;
    previous: DeliveryAggregate | null;
  }[],
): RadarFinding[] {
  const findings: RadarFinding[] = [];

  for (const c of clients) {
    if (!c.current || !c.previous) continue;

    const revenueDelta = percentDelta(c.current.revenue, c.previous.revenue);
    const ordersDelta = percentDelta(c.current.orders, c.previous.orders);
    const aovCurrent = c.current.orders > 0 ? c.current.revenue / c.current.orders : 0;
    const aovPrevious = c.previous.orders > 0 ? c.previous.revenue / c.previous.orders : 0;
    const aovDelta = percentDelta(aovCurrent, aovPrevious);
    const ratingDelta =
      c.current.rating != null && c.previous.rating != null
        ? c.current.rating - c.previous.rating
        : null;
    const promoPct = c.current.revenue
      ? (c.current.promoInvestment / c.current.revenue) * 100
      : null;

    let severity: RadarSeverity | null = null;
    const reasons: string[] = [];

    if (revenueDelta != null && revenueDelta <= REVENUE_DROP_CRITICAL) {
      severity = "critico";
      reasons.push("Queda crítica de faturamento");
    } else if (revenueDelta != null && revenueDelta <= REVENUE_DROP_ATTENTION) {
      severity = "atencao";
      reasons.push("Queda de faturamento");
    }

    if (aovDelta != null && aovDelta <= AOV_DROP_ATTENTION) {
      severity = severity ?? "atencao";
      reasons.push("Ticket em queda");
    }

    if (ratingDelta != null && Math.abs(ratingDelta) >= RATING_CHANGE_ATTENTION) {
      severity = severity ?? "atencao";
      reasons.push(ratingDelta < 0 ? "Avaliação em queda" : "Avaliação em alta");
    }

    if (promoPct != null && promoPct >= PROMO_PRESSURE_THRESHOLD) {
      severity = severity ?? "atencao";
      reasons.push("Pressão promocional");
    }

    if (!severity) continue;

    findings.push({
      client: c.name,
      severity,
      revenueDelta,
      ordersDelta,
      aovDelta,
      ratingDelta,
      promoPct,
      reasons,
    });
  }

  return findings
    .sort((a, b) => {
      if (a.severity !== b.severity) return a.severity === "critico" ? -1 : 1;
      return (a.revenueDelta ?? 0) - (b.revenueDelta ?? 0);
    })
    .slice(0, MAX_FINDINGS);
}

export type MetaRadarFinding = {
  client: string;
  severity: RadarSeverity;
  roasDelta: number | null;
  resultsDelta: number | null;
  cprDelta: number | null;
  reasons: string[];
};

const ROAS_DROP_ATTENTION = -20;
const ROAS_DROP_CRITICAL = -35;
const RESULTS_DROP_ATTENTION = -20;
const CPR_RISE_ATTENTION = 20;
const ROAS_FLOOR = 2;

function metaRoas(a: MetaAggregate) {
  return a.invested > 0 ? a.revenue / a.invested : null;
}
function metaCpr(a: MetaAggregate) {
  return a.results > 0 ? a.invested / a.results : null;
}

/** Regras só de evidência (sem causa): queda de ROAS, custo por resultado subindo, menos resultados e ROAS baixo. */
export function buildMetaRadarFindings(
  clients: {
    name: string;
    current: MetaAggregate | null;
    previous: MetaAggregate | null;
  }[],
): MetaRadarFinding[] {
  const findings: MetaRadarFinding[] = [];

  for (const c of clients) {
    if (!c.current) continue;
    const roasNow = metaRoas(c.current);
    const roasPrev = c.previous ? metaRoas(c.previous) : null;
    const cprNow = metaCpr(c.current);
    const cprPrev = c.previous ? metaCpr(c.previous) : null;

    const roasDelta = roasNow != null ? percentDelta(roasNow, roasPrev) : null;
    const cprDelta = cprNow != null ? percentDelta(cprNow, cprPrev) : null;
    const resultsDelta = c.previous
      ? percentDelta(c.current.results, c.previous.results)
      : null;

    let severity: RadarSeverity | null = null;
    const reasons: string[] = [];

    if (roasDelta != null && roasDelta <= ROAS_DROP_CRITICAL) {
      severity = "critico";
      reasons.push("Queda crítica de ROAS");
    } else if (roasDelta != null && roasDelta <= ROAS_DROP_ATTENTION) {
      severity = "atencao";
      reasons.push("Queda de ROAS");
    }
    if (cprDelta != null && cprDelta >= CPR_RISE_ATTENTION) {
      severity = severity ?? "atencao";
      reasons.push("Custo por resultado subindo");
    }
    if (resultsDelta != null && resultsDelta <= RESULTS_DROP_ATTENTION) {
      severity = severity ?? "atencao";
      reasons.push("Menos resultados");
    }
    if (c.current.invested > 0 && c.current.revenue === 0) {
      severity = severity ?? "atencao";
      reasons.push("Sem retorno registrado");
    } else if (roasNow != null && roasNow < ROAS_FLOOR) {
      severity = severity ?? "atencao";
      reasons.push("ROAS abaixo de 2x");
    }

    if (!severity) continue;
    findings.push({ client: c.name, severity, roasDelta, resultsDelta, cprDelta, reasons });
  }

  return findings
    .sort((a, b) => {
      if (a.severity !== b.severity) return a.severity === "critico" ? -1 : 1;
      return (a.roasDelta ?? 0) - (b.roasDelta ?? 0);
    })
    .slice(0, MAX_FINDINGS);
}
