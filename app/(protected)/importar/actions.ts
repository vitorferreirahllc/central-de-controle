"use server";

import { revalidatePath } from "next/cache";
import { extractText, getDocumentProxy } from "unpdf";
import { createClient } from "@/lib/supabase/server";
import { parseWeeklyReports } from "@/lib/reportParser";

export type ImportState = {
  status: "done" | "error";
  message?: string;
  imported: { client: string; period: string; delivery: boolean; meta: boolean }[];
  skipped: { client: string; period: string; reason: string }[];
  warnings: string[];
} | null;

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const fail = (message: string): ImportState => ({
  status: "error",
  message,
  imported: [],
  skipped: [],
  warnings: [],
});

const br = (iso: string) => iso.split("-").reverse().slice(0, 2).join("/");

export async function importReports(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return fail("Escolha um arquivo PDF.");
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return fail("O arquivo precisa ser um PDF.");
  }
  if (file.size > 5 * 1024 * 1024) {
    return fail("O PDF passa de 5 MB.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("Sessão expirada. Entre novamente.");

  let text: string;
  try {
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    ({ text } = await extractText(pdf, { mergePages: true }));
  } catch {
    return fail("Não consegui ler esse PDF. Ele pode ser uma imagem escaneada ou estar protegido.");
  }

  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("id, name");
  if (clientsError) return fail(clientsError.message);

  const nameToId = new Map((clients ?? []).map((c) => [c.name as string, c.id as number]));
  const { weeks, warnings } = parseWeeklyReports(text, Array.from(nameToId.keys()));

  if (weeks.length === 0) {
    return {
      status: "error",
      message:
        "Não encontrei nenhum relatório semanal nesse PDF. O formato aceito tem 'Período dd/mm a dd/mm' seguido de Receita, Pedidos, Nota da loja etc.",
      imported: [],
      skipped: [],
      warnings,
    };
  }

  const imported: NonNullable<ImportState>["imported"] = [];
  const skipped: NonNullable<ImportState>["skipped"] = [];

  for (const w of weeks) {
    const clientId = nameToId.get(w.clientName)!;
    const period = `${br(w.start)} a ${br(w.end)}`;
    const monthRef = `${MONTHS[Number(w.start.slice(5, 7)) - 1]}/${w.start.slice(0, 4)}`;

    const { data: existingDelivery } = await supabase
      .from("delivery_entries")
      .select("id")
      .eq("client_id", clientId)
      .eq("start_date", w.start)
      .maybeSingle();

    if (existingDelivery) {
      skipped.push({ client: w.clientName, period, reason: "já lançado — não alterei" });
      continue;
    }

    const { data: sameMonth } = await supabase
      .from("delivery_entries")
      .select("start_date")
      .eq("month_ref", monthRef)
      .lt("start_date", w.start);
    const weekNumber = new Set((sameMonth ?? []).map((r) => r.start_date)).size + 1;

    const { error: deliveryError } = await supabase.from("delivery_entries").insert({
      client_id: clientId,
      month_ref: monthRef,
      week_number: weekNumber,
      start_date: w.start,
      end_date: w.end,
      revenue: w.revenue,
      orders: w.orders,
      promo_investment: w.promo,
      rating: w.rating,
      payout: w.payout,
    });
    if (deliveryError) {
      skipped.push({ client: w.clientName, period, reason: `erro: ${deliveryError.message}` });
      continue;
    }

    let metaSaved = false;
    if (w.metaSpend != null && w.metaReturn != null) {
      const { data: existingMeta } = await supabase
        .from("meta_ads_entries")
        .select("id")
        .eq("client_id", clientId)
        .eq("start_date", w.start)
        .maybeSingle();
      if (!existingMeta) {
        const { error: metaError } = await supabase.from("meta_ads_entries").insert({
          client_id: clientId,
          month_ref: monthRef,
          week_number: weekNumber,
          start_date: w.start,
          end_date: w.end,
          invested: w.metaSpend,
          results: 0,
          revenue_generated: w.metaReturn,
        });
        metaSaved = !metaError;
      }
    }

    imported.push({ client: w.clientName, period, delivery: true, meta: metaSaved });
  }

  revalidatePath("/delivery-apps");
  revalidatePath("/meta-ads");
  revalidatePath("/dashboard");

  return { status: "done", imported, skipped, warnings };
}
