import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user!.id)
    .single();

  const name = profile?.first_name || "et bienvenue";

  return (
    <div className="flex max-w-2xl flex-col gap-2">
      <h1 className="font-semibold text-xl">Bonjour {name}</h1>
      <p className="text-muted-foreground text-sm">
        Retrouvez ici la gestion de vos annonces, de votre abonnement et de
        votre profil. Pour pouvoir diffuser une annonce, il convient de souscrire à un abonnement mensuel à notre plafeforme. Cet abonnement peut être résilé sans préavis et sans justification via notre plateforme.
      </p>
    </div>
  );
}
