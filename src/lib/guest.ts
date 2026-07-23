const STORAGE_KEY = "guestId";

// A random per-browser identifier — not tied to any real identity — that lets
// a guest's reaction be recognized as "mine" on return visits and toggled off.
export function getGuestId(): string {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, id);
  return id;
}
