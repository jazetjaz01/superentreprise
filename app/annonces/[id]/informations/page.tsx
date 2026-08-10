import { InformationsForm } from "./informations-form";
import { getOwnedAnnonce } from "@/lib/annonces/get-owned-annonce";

export default async function InformationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { annonce } = await getOwnedAnnonce(id);

  return <InformationsForm annonce={annonce} />;
}
