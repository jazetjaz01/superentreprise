"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/supabase/database.types";

export function ProfileForm({ profile }: { profile: Tables<"profiles"> }) {
  const [state, formAction, pending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
          <AvatarFallback>
            {(profile.first_name ?? profile.email).slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-sm">{profile.email}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            name="first_name"
            defaultValue={profile.first_name ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            name="last_name"
            defaultValue={profile.last_name ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-border border-t pt-5">
        <div>
          <h2 className="font-medium text-sm">Informations de facturation</h2>
          <p className="text-muted-foreground text-xs">
            Nécessaires pour émettre les factures d&apos;abonnement au nom de
            votre société.
          </p>
        </div>

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
            <Label htmlFor="siren">
              N° SIREN <span className="text-destructive">*</span>
            </Label>
            <Input
              id="siren"
              name="siren"
              required
              placeholder="123 456 789"
              defaultValue={profile.siren ?? ""}
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
      </div>

      {state?.error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm" aria-live="polite">
          Profil mis à jour.
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full"
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
