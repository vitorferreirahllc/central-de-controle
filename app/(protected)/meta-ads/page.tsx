import { createClient } from "@/lib/supabase/server";
import { META_ADS_CLIENTS } from "@/lib/clients";
import type { MetaAdsEntry } from "@/lib/types";
import { MetaPerformanceDashboard } from "@/components/meta/MetaPerformanceDashboard";

export default async function MetaAdsPage() {
  const supabase = await createClient();

  const { data: entries, error } = await supabase
    .from("meta_ads_entries")
    .select(
      "id, client_id, month_ref, week_number, start_date, end_date, invested, results, revenue_generated, notes, clients(name)",
    )
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (entries ?? []) as unknown as MetaAdsEntry[];

  return <MetaPerformanceDashboard rows={rows} clients={META_ADS_CLIENTS} />;
}
