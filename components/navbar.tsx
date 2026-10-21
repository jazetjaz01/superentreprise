"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";

// Pages dont le contenu commence par une vidéo plein écran
const VIDEO_ROUTES = ["/"];

const Navbar = () => {
  const isVideoRoute = VIDEO_ROUTES.includes(usePathname());
  const [pastVideo, setPastVideo] = useState(false);

  useEffect(() => {
    if (!isVideoRoute) return;
    const onScroll = () => {
      // Les pages quittées restent masquées dans le DOM (<Activity>) :
      // on ne garde que la section vidéo réellement visible.
      const hero = Array.from(
        document.querySelectorAll<HTMLElement>("[data-hero]")
      ).find((el) => el.checkVisibility());
      setPastVideo(!!hero && hero.getBoundingClientRect().bottom <= 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isVideoRoute]);

  const overVideo = isVideoRoute && !pastVideo;
  // Sombre : posée sur la vidéo et défile avec elle.
  // Blanche : fixée en haut une fois la vidéo passée.
  const position = !isVideoRoute
    ? ""
    : pastVideo
      ? "fixed inset-x-0 top-0 z-50 animate-in slide-in-from-top duration-300"
      : "absolute inset-x-0 top-0 z-50";

  return (
    <nav
      data-over-video={overVideo || undefined}
      className={`h-16 border-b bg-background text-brand over-video:border-transparent over-video:bg-black/30 over-video:text-white over-video:backdrop-blur-sm ${position}`}
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
