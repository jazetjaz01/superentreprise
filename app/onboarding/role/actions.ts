"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function setRole(formData: FormData) {
  const selection = String(formData.get("role") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (selection !== "vendeur" && selection !== "acheteur" && selection !== "professionnel") {
    redirect("/onboarding/role");
  }

  const role = selection === "acheteur" ? "acheteur" : "vendeur";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("profiles").update({ role }).eq("id", user.id);

  if (selection === "professionnel") {
    redirect("/forfaitspro");
  }

  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
}
