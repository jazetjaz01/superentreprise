import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
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
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url, first_name, email, is_admin")
      .eq("id", user.id)
      .single();

    avatarUrl = profile?.avatar_url ?? null;
    label = profile?.first_name || profile?.email || user.email || "Utilisateur";
    isAdmin = profile?.is_admin ?? false;
  }

  return (
    <nav className="bg-background">
      <div className="mx-auto grid h-20 w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden justify-center lg:flex">
          <SearchBar />
        </div>

        <div className="col-start-3 flex items-center gap-3 justify-self-end">
          {user ? (
            <>
              <Button variant="ghost" render={<Link href="/dashboard" />} nativeButton={false}>
                Mon compte
              </Button>
              <UserMenu avatarUrl={avatarUrl} label={label} isAdmin={isAdmin} />
            </>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />} nativeButton={false}>
                Se connecter
              </Button>
              <Button
                className="hidden sm:inline-flex"
                render={<Link href="/signin" />}
                nativeButton={false}
              >
                S&apos;enregistrer
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
