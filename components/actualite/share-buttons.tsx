"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

// Logos de marques (absents de Lucide v1)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] fill-current">
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
  </svg>
);

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
