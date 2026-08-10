import { redirect } from "next/navigation";
import { createDraftAnnonce } from "./actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function DeposerUneAnnoncePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/deposer-une-annonce");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="font-semibold text-2xl">Déposer une annonce</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Vous allez pouvoir décrire votre commerce ou votre entreprise en
        quelques étapes. Vous pourrez enregistrer votre progression et
        reprendre plus tard.
      </p>
      <form action={createDraftAnnonce} className="mt-8 w-full">
        <Button type="submit" className="h-11 w-full rounded-full">
          Commencer
        </Button>
      </form>
    </div>
  );
}
