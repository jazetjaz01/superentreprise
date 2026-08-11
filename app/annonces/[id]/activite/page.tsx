import { ActivityForm } from "./activity-form";
import { getOwnedAnnonce } from "@/lib/annonces/get-owned-annonce";

export default async function ActivitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { annonce } = await getOwnedAnnonce(id);

  return <ActivityForm annonce={annonce} />;
}
