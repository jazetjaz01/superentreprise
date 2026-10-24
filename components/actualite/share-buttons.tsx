"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { LinkedInIcon, XIcon } from "@/components/brand-icons";

const buttonClassName =
  "flex size-10 items-center justify-center text-brand transition-colors hover:bg-brand/5";

// Partage de l'article en cours (adresse lue dans le navigateur au clic)
export const ShareButtons = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);

  const share = (buildUrl: (url: string, text: string) => string) => {
    const url = encodeURIComponent(window.location.href);
    window.open(buildUrl(url, encodeURIComponent(title)), "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="-ms-2.5 flex items-center gap-1">
      <button
        type="button"
        aria-label="Partager sur LinkedIn"
        className={buttonClassName}
        onClick={() =>
          share((url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`)
        }
      >
        <LinkedInIcon />
      </button>
      <button
        type="button"
        aria-label="Partager sur X"
        className={buttonClassName}
        onClick={() =>
          share((url, text) => `https://x.com/intent/post?url=${url}&text=${text}`)
        }
      >
        <XIcon />
      </button>
      <button
        type="button"
        aria-label="Partager par email"
        className={buttonClassName}
        onClick={() => {
          const url = encodeURIComponent(window.location.href);
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${url}`;
        }}
      >
        <Mail className="size-5" />
      </button>
      <button
        type="button"
        aria-label={copied ? "Lien copié" : "Copier le lien"}
        title={copied ? "Lien copié" : "Copier le lien"}
        className={buttonClassName}
        onClick={copyLink}
      >
        {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Lien copié dans le presse-papiers" : ""}
      </span>
    </div>
  );
};
