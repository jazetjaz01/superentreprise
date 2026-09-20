import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
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
  const displayName: string =
    metadata?.full_name ?? metadata?.name ?? claims?.email ?? "";
  const avatarUrl: string | undefined = metadata?.avatar_url ?? metadata?.picture;

  return (
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {claims ? (
            <>
              <UserAvatar name={displayName} avatarUrl={avatarUrl} />
              <LogoutButton variant="outline" />
            </>
          ) : (
            <>
              <Button
                className="hidden sm:inline-flex"
                variant="outline"
                nativeButton={false}
                render={<Link href="/auth/login" />}
              >
                {t("signIn")}
              </Button>
              <Button nativeButton={false} render={<Link href="/auth/sign-up" />}>
                {t("signUp")}
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
