import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ActualitePost = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  author: string;
  authorImage: string | null;
  date: string;
  image: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatActualiteDate(value: string) {
  return dateFormatter.format(new Date(value));
}

const Actualite = ({ posts }: { posts: ActualitePost[] }) => {
  return (
    <div className="mx-auto max-w-(--breakpoint-xl) px-6 py-16 xl:px-0">
      <div className="flex items-end justify-between">
        <h2 className="font-medium text-[1.5rem] tracking-tight">
          Nos derniers articles
        </h2>
        <Select defaultValue="recommended">
          <SelectTrigger className="w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommandés</SelectItem>
            <SelectItem value="latest">Récents</SelectItem>
            <SelectItem value="popular">Populaires</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-muted-foreground text-sm">
          Aucun article publié pour le moment.
        </p>
      ) : (
        <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/actualite/${post.slug}`} key={post.id}>
            <Card className="gap-3 bg-muted/30 py-0 shadow-none transition-shadow hover:shadow-sm">
              <CardHeader className="p-1.5 pb-0">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  {post.image ? (
                    <Image
                      alt={post.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={post.image}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <FileText className="size-6" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0 pb-5">
                {post.category && (
                  <Badge variant="secondary">{post.category}</Badge>
                )}

                <h3 className="mt-4 font-medium text-[1.4rem] text-xl tracking-[-0.02em]">
                  {post.title}
                </h3>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {post.authorImage ? (
                      <Image
                        alt={post.author}
                        className="size-8 rounded-full object-cover"
                        height={32}
                        src={post.authorImage}
                        width={32}
                      />
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">
                        {post.author.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-muted-foreground">
                      {post.author}
                    </span>
                  </div>

                  <span className="text-muted-foreground text-sm">
                    {post.date}
                  </span>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Actualite;
