import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { requireWriter } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AuthorForm } from "./author-form";

export const metadata: Metadata = { title: "Ma fiche auteur" };

async function AuthorEditor() {
  const user = await requireWriter();
  const supabase = await createClient();
  const { data: author } = await supabase
    .from("authors")
    .select("display_name, bio, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return <AuthorForm userId={user.id} author={author} />;
}

export default function AuthorPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 sm:px-6">
      <Link href="/compte" className="text-sm text-brand hover:underline hover:underline-offset-4">
        ← Mon compte
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-brand">
        Ma fiche auteur
      </h1>
      <p className="mt-3 text-muted-foreground">
        Votre nom et votre photo apparaissent sur les articles que vous publiez.
      </p>
      <Suspense fallback={<p className="mt-10 text-muted-foreground">Chargement…</p>}>
        <AuthorEditor />
      </Suspense>
    </main>
  );
}
