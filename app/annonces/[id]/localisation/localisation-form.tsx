"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateLocalisation } from "./actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/supabase/database.types";

export function LocalisationForm({
  annonce,
}: {
  annonce: Tables<"annonces">;
}) {
  const [state, formAction, pending] = useActionState(
    updateLocalisation,
    null,
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="annonceId" value={annonce.id} />

      <div>
        <h1 className="font-semibold text-xl">Localisation</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          La ville aide les acheteurs à cibler une zone géographique.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            name="postal_code"
            defaultValue={annonce.postal_code ?? ""}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            defaultValue={annonce.city ?? ""}
            required
          />
        </div>
      </div>

      <Label className="flex items-center gap-2 font-normal">
        <Checkbox
          name="hide_exact_location"
          defaultChecked={annonce.hide_exact_location ?? false}
        />
        Ne pas afficher l&apos;adresse précise (recommandé pour préserver la
        confidentialité)
      </Label>

      {state?.error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <Link
          href={`/annonces/${annonce.id}/finances`}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          Précédent
        </Link>
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? "Enregistrement..." : "Suivant"}
        </Button>
      </div>
    </form>
  );
}
