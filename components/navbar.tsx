"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";

// Pages dont le contenu commence par une vidéo plein écran
const VIDEO_ROUTES = ["/"];

const Navbar = () => {
  const overVideo = VIDEO_ROUTES.includes(usePathname());

  return (
    <nav
      data-over-video={overVideo || undefined}
      className="h-16  bg-background text-brand over-video:absolute over-video:inset-x-0 over-video:top-0 over-video:z-50 over-video:border-white/20 over-video:bg-black/1 over-video:text-white over-video:backdrop-blur-sm"
    >
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Button className="hidden sm:inline-flex" variant="outline">
            Sign In
          </Button>
          <Button>Get Started</Button>

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
