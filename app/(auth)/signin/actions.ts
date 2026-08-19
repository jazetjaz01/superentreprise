"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(_prevState: { error: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");
  const intent = String(formData.get("intent") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: role || undefined } },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    if (intent === "pro") {
      await supabase
        .from("profiles")
        .update({ is_professional: true })
        .eq("id", data.session.user.id);
    }
    redirect(intent === "pro" ? "/forfaitspro" : "/dashboard");
  }

  redirect("/login?confirm=1");
}
