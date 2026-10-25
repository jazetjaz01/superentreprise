// Copie le worker de MapLibre dans public/ : Turbopack ne le publie pas à côté
// du bundle, MapLibre le charge donc depuis /maplibre/ (voir setWorkerUrl).
// Lancé automatiquement après chaque `npm install` (script postinstall).
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/maplibre", { recursive: true });
copyFileSync(
  "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
  "public/maplibre/maplibre-gl-worker.mjs"
);
