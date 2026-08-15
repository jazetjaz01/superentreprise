"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updateInformations } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transactionTypes } from "@/lib/annonces/options";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

export function InformationsForm({
  annonce,
}: {
  annonce: Tables<"annonces">;
}) {
  const [state, formAction, pending] = useActionState(
    updateInformations,
    null,
  );
  const [transactionType, setTransactionType] = useState(
    annonce.transaction_type ?? "",
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
        <Label>Type de transaction</Label>
        <div className="flex flex-wrap gap-2">
          {transactionTypes.map((item) => {
            const isActive = transactionType === item.value;

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setTransactionType(item.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-input hover:bg-muted",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="transaction_type" value={transactionType} />
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
          href={`/annonces/${annonce.id}/activite`}
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
