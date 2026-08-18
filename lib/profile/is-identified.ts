export function isProfileIdentified(profile: {
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
} | null | undefined) {
  if (!profile) return false;
  return !!(profile.display_name || (profile.first_name && profile.last_name));
}
