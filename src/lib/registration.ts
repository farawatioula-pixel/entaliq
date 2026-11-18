/** Remembers on this device that the visitor registered for the closing ceremony. */
const KEY = "mountaliq_ceremony_registration";

export type SavedRegistration = { name: string; shareToken: string | null };

export function saveRegistration(reg: SavedRegistration) {
  try {
    localStorage.setItem(KEY, JSON.stringify(reg));
  } catch {
    /* storage unavailable */
  }
}

export function loadRegistration(): SavedRegistration | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedRegistration) : null;
  } catch {
    return null;
  }
}
