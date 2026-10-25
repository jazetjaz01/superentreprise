"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Phone } from "lucide-react";
import type { Office } from "@/lib/offices";
import { cn } from "@/lib/utils";

// Fond de carte gris clair, gratuit et sans clé (OpenFreeMap)
const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

const MARKER_SVG = `
<svg width="32" height="42" viewBox="0 0 32 42" aria-hidden="true">
  <path d="M16 0C7.16 0 0 7.16 0 16c0 11.2 16 26 16 26s16-14.8 16-26C32 7.16 24.84 0 16 0z" fill="#143156"/>
  <circle cx="16" cy="16" r="6" fill="#fff"/>
</svg>`;

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+33")}`;

// Contenu de la popup construit en texte (aucune interprétation HTML)
function popupContent(office: Office) {
  const root = document.createElement("div");
  root.className = "text-sm text-brand";
  const city = document.createElement("p");
  city.className = "font-semibold";
  city.textContent = office.city;
  const address = document.createElement("p");
  address.className = "mt-1 text-muted-foreground";
  address.textContent = `${office.address_line}, ${office.postal_code} ${office.city}`;
  root.append(city, address);
  return root;
}

export const OfficesMap = ({ offices }: { offices: Office[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef(new Map<number, Marker>());
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    let map: MapLibreMap | undefined;
    let cancelled = false;
    const markers = markersRef.current;

    // MapLibre utilise window : chargé uniquement dans le navigateur
    import("maplibre-gl").then((maplibregl) => {
      if (cancelled || !containerRef.current) return;

      const bounds = new maplibregl.LngLatBounds();
      offices.forEach((o) => bounds.extend([o.longitude, o.latitude]));

      const instance = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        bounds,
        fitBoundsOptions: { padding: 80, maxZoom: 12 },
        cooperativeGestures: true, // Ctrl / ⌘ + molette pour zoomer
        attributionControl: { compact: true },
        locale: {
          "NavigationControl.ZoomIn": "Zoomer",
          "NavigationControl.ZoomOut": "Dézoomer",
          "CooperativeGesturesHandler.WindowsHelpText": "Utilisez Ctrl + molette pour zoomer",
          "CooperativeGesturesHandler.MacHelpText": "Utilisez ⌘ + molette pour zoomer",
          "CooperativeGesturesHandler.MobileHelpText": "Utilisez deux doigts pour déplacer la carte",
        },
      });
      instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

      offices.forEach((office) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "cursor-pointer";
        element.setAttribute("aria-label", `Agence de ${office.city}`);
        element.innerHTML = MARKER_SVG;
        element.addEventListener("click", () => setActiveId(office.id));

        const marker = new maplibregl.Marker({ element, anchor: "bottom" })
          .setLngLat([office.longitude, office.latitude])
          .setPopup(
            new maplibregl.Popup({ offset: 36, closeButton: false }).setDOMContent(
              popupContent(office)
            )
          )
          .addTo(instance);
        markers.set(office.id, marker);
      });

      map = instance;
      mapRef.current = instance;
    });

    return () => {
      cancelled = true;
      markers.clear();
      map?.remove();
      mapRef.current = null;
    };
  }, [offices]);

  // Clic sur une agence de la liste : centre la carte et ouvre sa popup
  const focusOffice = (office: Office) => {
    setActiveId(office.id);
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: [office.longitude, office.latitude], zoom: 13, duration: 1200 });
    markersRef.current.forEach((marker, id) => {
      const isOpen = marker.getPopup()?.isOpen();
      if (id === office.id ? !isOpen : isOpen) marker.togglePopup();
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
      <ul className="divide-y border-y lg:order-first">
        {offices.map((office) => (
          <li key={office.id}>
            <div
              className={cn(
                "py-6 transition-colors",
                activeId === office.id && "bg-brand/5 lg:-mx-4 lg:px-4"
              )}
            >
              <button
                type="button"
                onClick={() => focusOffice(office)}
                className="text-left text-xl font-semibold tracking-tight text-brand hover:underline hover:underline-offset-4"
              >
                {office.city}
              </button>
              <p className="mt-3 flex gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  {office.address_line}
                  <br />
                  {office.postal_code} {office.city}
                </span>
              </p>
              {office.phone && (
                <a
                  href={telHref(office.phone)}
                  className="mt-2 flex items-center gap-2 text-brand hover:underline hover:underline-offset-4"
                >
                  <Phone className="size-4 shrink-0" />
                  {office.phone}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div
        ref={containerRef}
        role="region"
        aria-label="Carte des agences"
        className="h-[420px] w-full overflow-hidden bg-stone-200 lg:h-[560px]"
      />
    </div>
  );
};
