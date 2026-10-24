"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;

const MIN_PASSWORD_LENGTH = 8;

const readCredentials = (formData: FormData) => ({
  email: String(formData.get("email") ?? "").trim(),
  password: String(formData.get("password") ?? ""),
});

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const credentials = readCredentials(formData);
  if (!credentials.email || !credentials.password) {
    return { error: "Veuillez saisir votre email et votre mot de passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Veuillez confirmer votre adresse email avant de vous connecter."
          : "Email ou mot de passe incorrect.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/compte");
}

export async function signup(_state: AuthState, formData: FormData): Promise<AuthState> {
  const credentials = readCredentials(formData);
  if (!credentials.email) {
    return { error: "Veuillez saisir votre email." };
  }
  if (credentials.password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(credentials);

  if (error) {
    return { error: "L’inscription a échoué. Vérifiez votre email et réessayez." };
  }

  // Message identique que l'email soit nouveau ou déjà inscrit (pas d'énumération des comptes)
  return {
    message:
      "Un email de confirmation vous a été envoyé. Cliquez sur le lien qu’il contient pour activer votre compte.",
  };
}
