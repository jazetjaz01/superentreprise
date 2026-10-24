import type { Metadata } from "next";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous ou créez votre compte superentreprise.",
};

export default function ConnexionPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-brand">
        Votre espace
      </h1>
      <p className="mt-3 text-muted-foreground">
        Connectez-vous ou créez votre compte avec votre adresse email.
      </p>
      <AuthForm />
    </main>
  );
}
