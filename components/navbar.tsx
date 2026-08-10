import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { SearchBar } from "@/components/searchbar";
import { UserMenu } from "@/components/user-menu";
import { createClient } from "@/lib/supabase/server";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let avatarUrl: string | null = null;
  let label = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url, first_name, email")
      .eq("id", user.id)
      .single();

    avatarUrl = profile?.avatar_url ?? null;
    label = profile?.first_name || profile?.email || user.email || "Utilisateur";
  }

  return (
    <nav className="bg-background">
      <div className="mx-auto flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />

          <div className="hidden lg:block">
            <SearchBar />
          </div>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu avatarUrl={avatarUrl} label={label} />
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />} nativeButton={false}>
                Se connecter
              </Button>
              <Button render={<Link href="/signin" />} nativeButton={false}>
                S&apos;enregistrer
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
