import { redirect } from "next/navigation";

import { CompanyForm } from "@/components/company-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewCompanyPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) redirect("/auth/login");

  return <CompanyForm userId={claims.sub} />;
}
