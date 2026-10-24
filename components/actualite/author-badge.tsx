import Image from "next/image";
import type { Author } from "@/lib/articles";

// Avatar + nom de l'auteur ; initiales si pas de photo
export const AuthorBadge = ({
  author,
  date,
  size = 36,
}: {
  author: Author | null;
  date?: string;
  size?: number;
}) => {
  if (!author) return null;
  const initials = author.display_name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {author.avatar_url ? (
        <Image
          src={author.avatar_url}
          alt=""
          width={size}
          height={size}
          className="shrink-0 rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center rounded-full bg-brand text-xs font-medium text-white"
          style={{ width: size, height: size }}
        >
          {initials}
        </span>
      )}
      <div className="text-sm leading-tight">
        <p className="font-medium text-brand">{author.display_name}</p>
        {date && <p className="text-muted-foreground">{date}</p>}
      </div>
    </div>
  );
};
