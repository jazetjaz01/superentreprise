"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateInformations } from "./actions";
import { SectorSelect } from "@/components/sector-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transactionTypes } from "@/lib/annonces/options";
import type { Tables } from "@/lib/supabase/database.types";

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function InformationsForm({
  annonce,
}: {
  annonce: Tables<"annonces">;
}) {
  const [state, formAction, pending] = useActionState(
    updateInformations,
    null,
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="annonceId" value={annonce.id} />

      <div>
        <h1 className="font-semibold text-xl">Informations générales</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Le titre et le type de transaction aideront les acheteurs à trouver
          votre annonce.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Titre de l&apos;annonce</Label>
        <Input
          id="title"
          name="title"
          defaultValue={annonce.title === "Nouvelle annonce" ? "" : annonce.title}
          placeholder="Ex : Restaurant traditionnel centre-ville"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transaction_type">Type de transaction</Label>
        <select
          id="transaction_type"
          name="transaction_type"
          defaultValue={annonce.transaction_type ?? ""}
          className={selectClassName}
          required
        >
          <option value="" disabled>
            Sélectionner...
          </option>
          {transactionTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-medium text-sm">Secteur d&apos;activité</span>
        <SectorSelect
          defaultUniverse={annonce.sector}
          defaultActivity={annonce.activity}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description_short">Résumé court</Label>
        <textarea
          id="description_short"
          name="description_short"
          defaultValue={annonce.description_short ?? ""}
          placeholder="Une ou deux phrases qui donnent envie d'en savoir plus"
          rows={3}
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
          href="/deposer-une-annonce"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          Annuler
        </Link>
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? "Enregistrement..." : "Suivant"}
        </Button>
      </div>
    </form>
  );
}
