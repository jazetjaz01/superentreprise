"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateActivity } from "./actions";
import { ActivityPicker } from "@/components/activity-picker";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";

export function ActivityForm({ annonce }: { annonce: Tables<"annonces"> }) {
  const [state, formAction, pending] = useActionState(updateActivity, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <input type="hidden" name="annonceId" value={annonce.id} />

      <div>
        <h1 className="font-semibold text-xl">Quelle est votre activité ?</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Choisissez l&apos;activité la plus proche, ou décrivez-la si elle ne
          figure pas dans la liste.
        </p>
      </div>

      <ActivityPicker defaultActivity={annonce.activity} />

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
