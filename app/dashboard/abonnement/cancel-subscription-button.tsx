"use client";

import { cancelSubscription } from "./actions";
import { Button } from "@/components/ui/button";

export function CancelSubscriptionButton() {
  return (
    <form
      action={cancelSubscription}
      onSubmit={(event) => {
        if (
          !confirm(
            "Résilier votre abonnement ? Votre annonce restera diffusée jusqu'à la fin de la période en cours, puis sera dépubliée.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="outline" className="w-full rounded-full">
        Résilier mon abonnement
      </Button>
    </form>
  );
}
