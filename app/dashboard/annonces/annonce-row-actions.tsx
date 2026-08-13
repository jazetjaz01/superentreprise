"use client";

import { deleteAnnonce, toggleArchiveAnnonce } from "./actions";
import { Button } from "@/components/ui/button";

export function AnnonceRowActions({
  annonceId,
  status,
}: {
  annonceId: string;
  status: string;
}) {
  return (
    <>
      {status !== "brouillon" && (
        <form action={toggleArchiveAnnonce}>
          <input type="hidden" name="annonceId" value={annonceId} />
          <Button type="submit" variant="outline" size="sm" className="rounded-full">
            {status === "archivee" ? "Réactiver" : "Désactiver"}
          </Button>
        </form>
      )}
      <form
        action={deleteAnnonce}
        onSubmit={(event) => {
          if (!confirm("Supprimer définitivement cette annonce ?")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="annonceId" value={annonceId} />
        <Button
          type="submit"
          variant="destructive"
          size="sm"
          className="rounded-full"
        >
          Supprimer
        </Button>
      </form>
    </>
  );
}
