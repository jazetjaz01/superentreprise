import { CompanyProfileForm } from "./company-profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function CompanyProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div>
        <h1 className="font-semibold text-xl">Profil société</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Ces informations sont utilisées pour émettre les factures
          d&apos;abonnement au nom de votre société.
        </p>
      </div>
      {params.billing === "required" && (
        <div className="max-w-md rounded-lg border border-border bg-muted/50 p-4 text-sm">
          Merci de compléter ces informations avant de vous abonner :
          elles seront utilisées pour émettre la facture au nom de votre
          société.
        </div>
      )}
      {profile && <CompanyProfileForm profile={profile} />}
    </div>
  );
}
