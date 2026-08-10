"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { publishAnnonce } from "./actions";
import { Button } from "@/components/ui/button";

export function PublishButton({ annonceId }: { annonceId: string }) {
  const [state, formAction, pending] = useActionState(publishAnnonce, null);

  if (state?.published) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/50 p-6 text-center">
        <CheckCircle2 className="size-8 text-foreground" />
        <p className="font-medium">Votre annonce est publiée !</p>
        <Button render={<Link href="/" />} nativeButton={false} className="rounded-full">
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="annonceId" value={annonceId} />
      {state?.error && (
        <p className="mb-3 text-destructive text-sm" aria-live="polite">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending ? "Publication..." : "Publier l'annonce"}
      </Button>
    </form>
  );
}
