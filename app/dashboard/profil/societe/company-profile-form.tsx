"use client";

import { useActionState } from "react";
import { updateCompanyProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/supabase/database.types";

export function CompanyProfileForm({ profile }: { profile: Tables<"profiles"> }) {
  const [state, formAction, pending] = useActionState(updateCompanyProfile, null);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company_name">
          Nom de la société <span className="text-destructive">*</span>
        </Label>
        <Input
          id="company_name"
          name="company_name"
          required
          defaultValue={profile.company_name ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="siret">
            N° SIRET <span className="text-destructive">*</span>
          </Label>
          <Input
            id="siret"
            name="siret"
            required
            placeholder="123 456 789 00012"
            defaultValue={profile.siret ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vat_number">
            N° TVA intracommunautaire <span className="text-destructive">*</span>
          </Label>
          <Input
            id="vat_number"
            name="vat_number"
            required
            placeholder="FR12345678900"
            defaultValue={profile.vat_number ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company_address">
          Adresse <span className="text-destructive">*</span>
        </Label>
        <Input
          id="company_address"
          name="company_address"
          required
          defaultValue={profile.company_address ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company_postal_code">
            Code postal <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company_postal_code"
            name="company_postal_code"
            required
            defaultValue={profile.company_postal_code ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company_city">
            Ville <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company_city"
            name="company_city"
            required
            defaultValue={profile.company_city ?? ""}
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm" aria-live="polite">
          Profil société mis à jour.
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit rounded-full">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
