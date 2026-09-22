import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { createClient } from "@/lib/supabase/server";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const t = await getTranslations("ProfilePage");
  const tProfile = await getTranslations("Profile");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, headline, about")
    .eq("slug", slug)
    .maybeSingle();

  if (!profile) notFound();

  const name = profile.full_name ?? tProfile("anonymous");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <UserAvatar name={name} avatarUrl={profile.avatar_url} size={96} />
          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            {profile.headline && (
              <p className="mt-1 text-muted-foreground">{profile.headline}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {profile.about && (
        <Card className="mt-4">
          <CardContent>
            <h2 className="text-lg font-semibold">{t("about")}</h2>
            <p className="mt-2 whitespace-pre-wrap text-foreground/80">
              {profile.about}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
