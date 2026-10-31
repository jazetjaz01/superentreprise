import { ImageResponse } from "next/og";

// Aperçu de partage par défaut (LinkedIn, WhatsApp, X…)
export const alt = "superentreprise, conseil en cession et transmission d’entreprise";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#143156",
          color: "white",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 16 16" fill="white">
          <path
            d="M4 16H0V6h4V0h6v4h6v12H4zM6 2v12h8v-1h-2v-2h2v-1h-2V8h2V6H8V2H6zM2 8v6h2V8H2z"
            fillRule="evenodd"
          />
        </svg>
        <div style={{ fontSize: 80, fontWeight: 600 }}>superentreprise</div>
        <div style={{ fontSize: 38, opacity: 0.85 }}>
          Conseil en cession et transmission d’entreprise
        </div>
      </div>
    ),
    size
  );
}
