"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteDeliveryEntry(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("delivery_entries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/delivery-apps");
  revalidatePath("/dashboard");
}
