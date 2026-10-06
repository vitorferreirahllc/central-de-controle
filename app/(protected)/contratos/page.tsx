import { createClient } from "@/lib/supabase/server";
import { todayInBrasilia } from "@/lib/contracts";
import { ContractsTimeline } from "@/components/ContractsTimeline";
import type { ClientContract } from "@/lib/types";

export default async function ContratosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("client_contracts")
    .select(
      "id, client_status_id, produto, data_inicio, data_fim, resumo, client_status(client_name, status)",
    );

  const contracts = (data ?? []) as unknown as ClientContract[];

  return <ContractsTimeline contracts={contracts} today={todayInBrasilia()} />;
}
