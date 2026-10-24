"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { saveAuthor } from "./actions";

type AuthorValues = {
  display_name: string;
  job_title: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export const AuthorForm = ({
  userId,
  author,
}: {
  userId: string;
  author: AuthorValues | null;
}) => {
  const [state, action, pending] = useActionState(saveAuthor, undefined);

  return (
    <form action={action} className="mt-10 grid gap-6">
      <div className="max-w-40">
        {/* Remonté après chaque sauvegarde : la photo enregistrée devient la référence */}
        <ImageUpload
          key={state?.savedAt}
          bucket="avatars"
          userId={userId}
          name="avatar_url"
          defaultValue={state?.savedAt ? state.avatarUrl : author?.avatar_url}
          label="Photo"
          aspect="aspect-square"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="display_name">Nom affiché</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={author?.display_name}
          minLength={2}
          maxLength={100}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="job_title">Fonction (facultatif)</Label>
        <Input
          id="job_title"
          name="job_title"
          defaultValue={author?.job_title ?? ""}
          maxLength={120}
          placeholder="Ex. Associé, Conseil en cession d’entreprise"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bio">Courte présentation (facultatif)</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={author?.bio ?? ""} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.message && (
        <p role="status" className="text-sm text-brand">{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="h-10 w-full sm:w-fit sm:px-8">
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
};
