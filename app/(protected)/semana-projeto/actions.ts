"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createClientStatus(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("client_status").insert({
    client_name: String(formData.get("client_name")),
    data_entrada: String(formData.get("data_entrada") || "") || null,
    responsavel: String(formData.get("responsavel") || "") || null,
    status: String(formData.get("status")),
    proxima_entrega: String(formData.get("proxima_entrega") || "") || null,
    risco: String(formData.get("risco")),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/semana-projeto");
  revalidatePath("/saude-cliente");
}

export async function updateClientStatus(id: number, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("client_status")
    .update({
      client_name: String(formData.get("client_name")),
      data_entrada: String(formData.get("data_entrada") || "") || null,
      responsavel: String(formData.get("responsavel") || "") || null,
      status: String(formData.get("status")),
      proxima_entrega: String(formData.get("proxima_entrega") || "") || null,
      risco: String(formData.get("risco")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/semana-projeto");
  revalidatePath("/saude-cliente");
  redirect("/semana-projeto");
}

export async function deleteClientStatus(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("client_status")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/semana-projeto");
  revalidatePath("/saude-cliente");
}
