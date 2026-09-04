import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Bots connus pour explorer le site de façon agressive et/ou ignorer
// robots.txt. Ajoutez ici d'autres user-agents si besoin, en évitant les
// motifs trop génériques comme "bot" qui bloqueraient aussi
// Googlebot/Bingbot (mauvais pour le SEO).
//
// Meta fait tourner plusieurs crawlers sous le préfixe "meta-" (constaté :
// "meta-externalagent", "meta-webindexer" — d'autres variantes peuvent
// apparaître). Ce préfixe est distinct de "facebookexternalhit", qui lui
// reste autorisé : c'est ce dernier qui génère l'aperçu de lien quand un
// utilisateur partage une URL sur Facebook/WhatsApp.
const BLOCKED_USER_AGENT_PATTERN = /meta-\w+/i;

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
