import type { Metadata } from "next";
import { Suspense } from "react";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "superentreprise | Transmission et succession d’entreprise",
    template: "%s | superentreprise",
  },
  description:
    "superentreprise accompagne les dirigeants dans la transmission et la succession de leur entreprise. Des entrepreneurs qui comprennent les entrepreneurs, à vos côtés à chaque étape.",
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
