import { ProfileForm } from "./profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardProfilePage({
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
    <div className="flex flex-col gap-6">
      <h1 className="font-semibold text-xl">Mon profil</h1>
      {params.billing === "required" && (
        <div className="max-w-md rounded-lg border border-border bg-muted/50 p-4 text-sm">
          Merci de compléter votre téléphone avant de vous abonner : il
          sera utilisé pour vous contacter.
        </div>
      )}
      {profile && <ProfileForm profile={profile} />}
    </div>
  );
}
