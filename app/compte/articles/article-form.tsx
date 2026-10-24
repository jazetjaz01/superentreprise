"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import type { Category } from "@/lib/articles";
import { slugify } from "@/lib/format";
import { saveArticle } from "./actions";

export type ArticleValues = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_id: number | null;
  cover_image_url: string | null;
  status: "draft" | "published";
};

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export const ArticleForm = ({
  userId,
  categories,
  article,
}: {
  userId: string;
  categories: Category[];
  article?: ArticleValues;
}) => {
  const [state, action, pending] = useActionState(saveArticle, undefined);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  // Le slug suit le titre tant qu'il n'a pas été modifié à la main
  const [slugEdited, setSlugEdited] = useState(Boolean(article));

  return (
    <form action={action} className="mt-10 grid gap-6">
      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="grid gap-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
          minLength={3}
          maxLength={200}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="slug">Adresse de l’article</Label>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="shrink-0">/actualite/</span>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            onBlur={() => setSlug(slugify(slug))}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category_id">Catégorie</Label>
        <select
          id="category_id"
          name="category_id"
          defaultValue={article?.category_id ?? ""}
          className={selectClassName}
        >
          <option value="">Aucune</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <ImageUpload
        bucket="article-covers"
        userId={userId}
        name="cover_image_url"
        defaultValue={article?.cover_image_url}
        label="Image de couverture"
      />

      <div className="grid gap-2">
        <Label htmlFor="excerpt">Résumé (facultatif)</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="content">Contenu</Label>
        <Textarea id="content" name="content" rows={14} defaultValue={article?.content ?? ""} />
        <p className="text-xs text-muted-foreground">
          Séparez les paragraphes par une ligne vide.
        </p>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          name="status"
          value="published"
          disabled={pending}
          className="h-10 bg-brand px-6 text-white hover:bg-brand/90"
        >
          {article?.status === "published" ? "Mettre à jour" : "Publier"}
        </Button>
        <Button
          type="submit"
          name="status"
          value="draft"
          variant="outline"
          disabled={pending}
          className="h-10 px-6"
        >
          {article?.status === "published" ? "Repasser en brouillon" : "Enregistrer le brouillon"}
        </Button>
      </div>
    </form>
  );
};
