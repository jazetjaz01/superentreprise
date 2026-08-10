import { ProfileForm } from "./profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardProfilePage() {
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
      {profile && <ProfileForm profile={profile} />}
    </div>
  );
}
