export type ParsedWeek = {
  clientName: string;
  start: string;
  end: string;
  revenue: number;
  orders: number;
  rating: number | null;
  promo: number;
  payout: number | null;
  metaSpend: number | null;
  metaReturn: number | null;
};

export type ParseResult = {
  weeks: ParsedWeek[];
  warnings: string[];
};

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** "2.006,78" ou "375,56" ou "375.56" -> número. */
function toNumber(raw: string): number {
  const s = raw.trim();
  if (s.includes(",")) return Number(s.replace(/\./g, "").replace(",", "."));
  return Number(s);
}

function pick(block: string, re: RegExp): number | null {
  const m = block.match(re);
  if (!m) return null;
  const n = toNumber(m[1]);
  return Number.isFinite(n) ? n : null;
}

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const PERIOD_RE =
  /Per[ií]odo\s+(\d{1,2})\/(\d{1,2})\s+a\s+(\d{1,2})\/(\d{1,2})(?:[^\n]*?enviado em\s+(\d{1,2})\/(\d{1,2})\/(\d{4}))?/i;

/**
 * Lê relatórios semanais no formato padrão ("Período dd/mm a dd/mm — enviado em
 * ...", seguido de linhas "Receita US$ ...", "Pedidos ...", etc.), agrupados por
 * cliente. Só extrai o que está escrito; não infere nada.
 */
export function parseWeeklyReports(
  text: string,
  clientNames: string[],
): ParseResult {
  const warnings: string[] = [];
  const weeks: ParsedWeek[] = [];

  const docYear = Number(text.match(/\b(20\d{2})\b/)?.[1] ?? new Date().getFullYear());
  const clients = clientNames.map((n) => ({ name: n, key: norm(n) }));

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let current: string | null = null;
  const blocks: { client: string; header: string; lines: string[] }[] = [];

  for (const line of lines) {
    if (PERIOD_RE.test(line)) {
      if (current) blocks.push({ client: current, header: line, lines: [] });
      else warnings.push(`Período sem cliente identificado: "${line.slice(0, 60)}"`);
      continue;
    }
    const isHeading = line.length <= 60 && !/\d/.test(line);
    if (isHeading) {
      const k = norm(line);
      const hit = clients.find((c) => k.includes(c.key) || c.key.includes(k));
      if (hit && k.length >= 4) {
        current = hit.name;
        continue;
      }
    }
    const last = blocks[blocks.length - 1];
    if (last && last.client === current) last.lines.push(line);
  }

  for (const b of blocks) {
    const m = b.header.match(PERIOD_RE)!;
    const [sd, sm, ed, em] = [m[1], m[2], m[3], m[4]].map(Number);
    let year = docYear;
    if (m[7]) {
      year = Number(m[7]);
      if (sm > Number(m[6])) year -= 1;
    }
    const endYear = em < sm ? year + 1 : year;
    const start = iso(year, sm, sd);
    const end = iso(endYear, em, ed);

    const body = b.lines.join("\n");
    const revenue = pick(body, /Receita\s+US\$\s*([\d.,]+)/i);
    const orders = pick(body, /Pedidos\s+(\d+)/i);
    if (revenue == null || orders == null) {
      warnings.push(`${b.client} ${sd}/${sm}–${ed}/${em}: sem receita ou pedidos, ignorado.`);
      continue;
    }

    weeks.push({
      clientName: b.client,
      start,
      end,
      revenue,
      orders,
      rating: pick(body, /Nota da loja\s+([\d.,]+)/i),
      promo: pick(body, /Investido em an[uú]ncios(?:\s*\(delivery\))?\s+US\$\s*([\d.,]+)/i) ?? 0,
      payout: pick(body, /Valor l[ií]quido de repasse(?:\s*\(delivery\))?\s+US\$\s*([\d.,]+)/i),
      metaSpend: pick(body, /Meta Ads\s*[—–-]\s*valor gasto\s+US\$\s*([\d.,]+)/i),
      metaReturn: pick(body, /Meta Ads\s*[—–-]\s*resultados[^\n]*?US\$\s*([\d.,]+)/i),
    });
  }

  return { weeks, warnings };
}
