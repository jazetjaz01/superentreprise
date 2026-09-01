import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Bots connus pour explorer le site de façon agressive et/ou ignorer
// robots.txt. Ajoutez ici d'autres user-agents si besoin (un par ligne
// de l'alternative regex), en évitant les motifs trop génériques comme
// "bot" qui bloqueraient aussi Googlebot/Bingbot (mauvais pour le SEO).
//
// "meta-externalagent" (Facebook) est distinct de "facebookexternalhit",
// qui lui reste autorisé : c'est ce dernier qui génère l'aperçu de lien
// quand un utilisateur partage une URL sur Facebook/WhatsApp.
const BLOCKED_USER_AGENT_PATTERN = /meta-externalagent/i;

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (BLOCKED_USER_AGENT_PATTERN.test(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
