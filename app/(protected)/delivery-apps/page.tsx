import { createClient } from "@/lib/supabase/server";
import { DELIVERY_CLIENTS } from "@/lib/clients";
import type { DeliveryEntry } from "@/lib/types";
import { DeliveryPerformanceDashboard } from "@/components/delivery/DeliveryPerformanceDashboard";

export default async function DeliveryAppsPage() {
  const supabase = await createClient();

  const { data: entries, error } = await supabase
    .from("delivery_entries")
    .select(
      "id, client_id, month_ref, week_number, start_date, end_date, revenue, orders, promo_investment, rating, payout, notes, clients(name)",
    )
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (entries ?? []) as unknown as DeliveryEntry[];

  return (
    <DeliveryPerformanceDashboard rows={rows} clients={DELIVERY_CLIENTS} />
  );
}
