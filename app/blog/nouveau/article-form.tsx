"use client";

import { useActionState } from "react";
import { createArticle } from "./actions";
import { BlogCoverUploader } from "@/components/blog-cover-uploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/supabase/database.types";

const textareaClassName =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function ArticleForm({
  categories,
}: {
  categories: Tables<"blog_categories">[];
}) {
  const [state, formAction, pending] = useActionState(createArticle, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="font-semibold text-2xl">Nouvel article</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Réservé aux administrateurs.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category_id">Catégorie</Label>
        <select id="category_id" name="category_id" className={selectClassName}>
          <option value="">Sans catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Résumé</Label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          placeholder="Un court résumé affiché sur la liste des articles"
          className={textareaClassName}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Contenu</Label>
        <textarea
          id="content"
          name="content"
          rows={12}
          className={textareaClassName}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Image de couverture</Label>
        <BlogCoverUploader />
      </div>

      <Label className="flex items-center gap-2 font-normal">
        <Checkbox name="publish_now" />
        Publier immédiatement (sinon enregistré comme brouillon)
      </Label>

      {state?.error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit rounded-full">
        {pending ? "Enregistrement..." : "Enregistrer l'article"}
      </Button>
    </form>
  );
}
