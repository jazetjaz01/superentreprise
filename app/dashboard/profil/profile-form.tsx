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
  const isSeller = profile.role !== "acheteur";

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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display_name">Surnom (optionnel)</Label>
        <Input
          id="display_name"
          name="display_name"
          maxLength={40}
          placeholder="Ex : VendeurPro66"
          defaultValue={profile.display_name ?? ""}
        />
        <p className="text-muted-foreground text-xs">
          Affiché à la place de votre nom et prénom auprès des autres
          utilisateurs, si renseigné.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">
          Téléphone {isSeller && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required={isSeller}
          placeholder="06 12 34 56 78"
          defaultValue={profile.phone ?? ""}
        />
        <p className="text-muted-foreground text-xs">
          Obligatoire pour diffuser une annonce.
        </p>
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
