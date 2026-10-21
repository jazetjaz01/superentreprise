"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";

// Pages dont le contenu commence par une vidéo plein écran
const VIDEO_ROUTES = ["/"];
// Défilement (en px) au-delà duquel la navbar repasse sur fond blanc
const SCROLL_THRESHOLD = 64;

const Navbar = () => {
  const isVideoRoute = VIDEO_ROUTES.includes(usePathname());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isVideoRoute) return;
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isVideoRoute]);

  const overVideo = isVideoRoute && !scrolled;

  return (
    <nav
      data-over-video={overVideo || undefined}
      className={`h-16 border-b bg-background text-brand transition-colors duration-300 over-video:border-white/20 over-video:bg-black/10 over-video:text-white over-video:backdrop-blur-sm ${isVideoRoute ? "fixed inset-x-0 top-0 z-50" : ""}`}
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
