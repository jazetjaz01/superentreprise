import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Mon compte" };

export default function ComptePage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-brand">
        Mon compte
      </h1>
      {/* La session est lue à la requête : elle doit être derrière un Suspense (cacheComponents) */}
      <Suspense fallback={<p className="mt-6 text-muted-foreground">Chargement…</p>}>
        <AccountDetails />
      </Suspense>
    </main>
  );
}

async function AccountDetails() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/connexion");
  }

  return (
    <div className="mt-6">
      <p className="text-muted-foreground">
        Vous êtes connecté avec{" "}
        <span className="font-medium text-brand">{user.email}</span>.
      </p>
      {user.role === "writer" && (
        <nav className="mt-8 grid gap-3 border-y py-6">
          <p className="text-xs font-medium uppercase tracking-wide text-brand/60">Espace auteur</p>
          <Link href="/compte/articles" className="text-brand underline underline-offset-4">
            Mes articles
          </Link>
          <Link href="/compte/auteur" className="text-brand underline underline-offset-4">
            Ma fiche auteur
          </Link>
        </nav>
      )}
      <form action="/auth/signout" method="post" className="mt-8">
        <Button type="submit" variant="outline" className="h-10">
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}
