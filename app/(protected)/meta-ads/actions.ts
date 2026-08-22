"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteMetaAdsEntry(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("meta_ads_entries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/meta-ads");
  revalidatePath("/dashboard");
}
