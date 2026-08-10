import { FinancesForm } from "./finances-form";
import { getOwnedAnnonce } from "@/lib/annonces/get-owned-annonce";

export default async function FinancesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { annonce } = await getOwnedAnnonce(id);

  return <FinancesForm annonce={annonce} />;
}
