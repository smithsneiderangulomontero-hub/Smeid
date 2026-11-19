import { STORAGE_KEYS } from "./config";
import { safeStorage } from "./storage";

export type Theme = "light" | "dark";

/** Tema guardado por el usuario; si no hay, respeta la preferencia del sistema. */
export function loadInitialTheme(): Theme {
  const saved = safeStorage.get(STORAGE_KEYS.theme);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function saveTheme(theme: Theme): void {
  safeStorage.set(STORAGE_KEYS.theme, theme);
}

export function applyThemeToDocument(theme: Theme): void {
  document.body.classList.toggle("oscuro", theme === "dark");
}
