import { redirect } from "next/navigation";
import { setRole } from "./actions";
import { createClient } from "@/lib/supabase/server";

const roles = [
  {
    value: "vendeur",
    title: "Je vends une entreprise",
    description: "Déposez votre annonce et diffusez-la auprès d'acheteurs.",
  },
  {
    value: "acheteur",
    title: "Je recherche une entreprise",
    description: "Parcourez les annonces et contactez les vendeurs.",
  },
] as const;

export default async function OnboardingRolePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role) {
    redirect(params.next ?? "/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
        <h1 className="font-semibold text-2xl">Vous êtes...</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Ça nous permet d&apos;adapter votre espace personnel.
        </p>

        <form action={setRole} className="mt-8 flex w-full flex-col gap-3">
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          {roles.map((item) => (
            <button
              key={item.value}
              type="submit"
              name="role"
              value={item.value}
              className="flex flex-col gap-1 rounded-lg border border-input px-4 py-3 text-left transition-colors hover:border-foreground hover:bg-muted"
            >
              <span className="font-medium">{item.title}</span>
              <span className="text-muted-foreground text-sm">
                {item.description}
              </span>
            </button>
          ))}
        </form>
      </div>
    </div>
  );
}
