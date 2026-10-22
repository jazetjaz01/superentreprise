import { cacheLife } from "next/cache";

// Avec cacheComponents, new Date() n'est autorisé que dans un composant mis en cache
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
