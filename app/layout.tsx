import type { Metadata } from "next";
import { Suspense } from "react";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Cabinet de conseil en cession, acquisition et transmission d’entreprise. superentreprise accompagne dirigeants et repreneurs de PME, de l’évaluation à la signature, à Perpignan, en Île-de-France et à Lyon.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cession et transmission d’entreprise | superentreprise",
    template: "%s | superentreprise",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    // Sans titre ni description ici : chaque page garde les siens
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* usePathname suspend sur les routes dont le paramètre est inconnu au build */}
        <Suspense fallback={<div className="h-16 border-b" />}>
          <Navbar />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
