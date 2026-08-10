"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateFinances } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/supabase/database.types";

export function FinancesForm({ annonce }: { annonce: Tables<"annonces"> }) {
  const [state, formAction, pending] = useActionState(updateFinances, null);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="annonceId" value={annonce.id} />

      <div>
        <h1 className="font-semibold text-xl">Activité & finances</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Ces chiffres permettent aux acheteurs d&apos;évaluer rapidement
          l&apos;opportunité.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">Prix de vente (€)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min={0}
          step="1"
          defaultValue={annonce.price ?? ""}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="revenue">Chiffre d&apos;affaires (€)</Label>
          <Input
            id="revenue"
            name="revenue"
            type="number"
            min={0}
            step="1"
            defaultValue={annonce.revenue ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ebitda">EBITDA (€)</Label>
          <Input
            id="ebitda"
            name="ebitda"
            type="number"
            step="1"
            defaultValue={annonce.ebitda ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rent">Loyer mensuel (€)</Label>
          <Input
            id="rent"
            name="rent"
            type="number"
            min={0}
            step="1"
            defaultValue={annonce.rent ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employees_count">Nombre de salariés</Label>
          <Input
            id="employees_count"
            name="employees_count"
            type="number"
            min={0}
            step="1"
            defaultValue={annonce.employees_count ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description_long">Description détaillée</Label>
        <textarea
          id="description_long"
          name="description_long"
          defaultValue={annonce.description_long ?? ""}
          placeholder="Historique, clientèle, équipements, raison de la cession..."
          rows={6}
          className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      {state?.error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <Link
          href={`/annonces/${annonce.id}/informations`}
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
