"use client";

// new Date() est interdit dans le rendu serveur prérendu (cacheComponents)
export const CurrentYear = () => <>{new Date().getFullYear()}</>;
