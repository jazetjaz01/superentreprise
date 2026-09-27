import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/logout-button";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

const Navbar = async () => {
  const t = await getTranslations("Navbar");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const metadata = claims?.user_metadata;

  const { data: profile } = claims
    ? await supabase
        .from("profiles")
        .select("full_name, avatar_url, slug")
        .eq("id", claims.sub)
        .maybeSingle()
    : { data: null };

  const displayName: string =
    profile?.full_name ?? metadata?.full_name ?? metadata?.name ?? claims?.email ?? "";
  const avatarUrl: string | null | undefined =
    profile?.avatar_url ?? metadata?.avatar_url ?? metadata?.picture;

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between gap-4 px-4 py-[9.2px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Logo />

          <label className="hidden items-center gap-2 border-b border-border py-1 text-sm text-muted-foreground focus-within:border-ring md:flex">
            <Search className="size-4 shrink-0" strokeWidth={1.5} />
            <input
              type="search"
              placeholder={t("search")}
              className="w-32 bg-transparent outline-none placeholder:text-muted-foreground lg:w-48"
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Menu */}
          <NavMenu className="hidden md:flex" />

          <LanguageSwitcher />
          {claims ? (
            <>
              {profile?.slug ? (
                <Link
                  href={`/profile/${profile.slug}`}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="rounded-full border border-primary p-0.5">
                    <UserAvatar name={displayName} avatarUrl={avatarUrl} size={20} />
                  </span>
                  <span className="hidden text-xs text-ink-800 md:inline">{t("me")}</span>
                </Link>
              ) : (
                <UserAvatar name={displayName} avatarUrl={avatarUrl} />
              )}
              <LogoutButton variant="outline" />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-sm font-normal hover:underline sm:inline"
              >
                {t("signIn")}
              </Link>
              <Button
                nativeButton={false}
                render={<Link href="/auth/sign-up" />}
              >
                {t("signUp")}
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet isAuthenticated={!!claims} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
