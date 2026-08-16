export function getDisplayName(profile: {
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
} | null | undefined, fallback = "Utilisateur") {
  if (!profile) return fallback;

  if (profile.display_name) return profile.display_name;

  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ");

  return fullName || fallback;
}
