import Image from "next/image";
import { Mail } from "lucide-react";
import { LinkedInIcon, XIcon } from "@/components/brand-icons";
import type { Author } from "@/lib/articles";
import { ShareButtons } from "@/components/actualite/share-buttons";

// Même style que la colonne « Derniers articles » : petit trait + titre,
// contenu encadré de traits fins
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-4 text-sm font-medium uppercase tracking-wide text-brand">
    <span className="h-px w-8 bg-brand" />
    {children}
  </h2>
);

// Colonne gauche de l'article : « Rédigé par » et « Partager l'article »
export const ArticleAuthorAside = ({
  author,
  title,
}: {
  author: Author | null;
  title: string;
}) => (
  <aside className="space-y-12 lg:sticky lg:top-8">
    {author && (
      <section>
        <SectionTitle>Rédigé par</SectionTitle>
        <div className="mt-6 flex items-start gap-4 border-y py-5">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt=""
              width={64}
              height={64}
              className="size-16 shrink-0 object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center bg-brand text-lg font-medium text-white"
            >
              {author.display_name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-brand">{author.display_name}</p>
            {author.job_title && (
              <p className="mt-1 leading-snug text-muted-foreground">{author.job_title}</p>
            )}
            {(author.linkedin_url || author.x_url || author.contact_email) && (
              <div className="-ms-1.5 mt-3 flex items-center gap-1 text-brand">
                {author.linkedin_url && (
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${author.display_name} sur LinkedIn`}
                    className="flex size-8 items-center justify-center hover:bg-brand/5"
                  >
                    <LinkedInIcon className="size-4" />
                  </a>
                )}
                {author.x_url && (
                  <a
                    href={author.x_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${author.display_name} sur X`}
                    className="flex size-8 items-center justify-center hover:bg-brand/5"
                  >
                    <XIcon className="size-3.5" />
                  </a>
                )}
                {author.contact_email && (
                  <a
                    href={`mailto:${author.contact_email}`}
                    aria-label={`Écrire à ${author.display_name}`}
                    title={author.contact_email}
                    className="flex size-8 items-center justify-center hover:bg-brand/5"
                  >
                    <Mail className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    )}

    <section>
      <SectionTitle>Partager l’article</SectionTitle>
      <div className="mt-6 border-y py-4">
        <ShareButtons title={title} />
      </div>
    </section>
  </aside>
);
