import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/connexion");
  }

  return (
    <div className="mt-6">
      <p className="text-muted-foreground">
        Vous êtes connecté avec{" "}
        <span className="font-medium text-brand">{data.claims.email}</span>.
      </p>
      <form action="/auth/signout" method="post" className="mt-8">
        <Button type="submit" variant="outline" className="h-10">
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}
