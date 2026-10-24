import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Lien invalide" };

export default function AuthErrorPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-brand">
        Lien invalide ou expiré
      </h1>
      <p className="mt-3 text-muted-foreground">
        Le lien de confirmation n’est plus valide. Il a peut-être déjà été
        utilisé ou a expiré. Essayez de vous connecter, ou inscrivez-vous à
        nouveau pour recevoir un nouveau lien.
      </p>
      <Link href="/connexion" className="mt-8 inline-block text-brand underline underline-offset-4">
        Retour à la connexion
      </Link>
    </main>
  );
}
