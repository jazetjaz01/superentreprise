"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function setRole(formData: FormData) {
  const role = String(formData.get("role") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (role !== "vendeur" && role !== "acheteur") {
    redirect("/onboarding/role");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("profiles").update({ role }).eq("id", user.id);

  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
}
