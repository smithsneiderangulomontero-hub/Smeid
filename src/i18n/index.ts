import { ca } from "./locales/ca";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { it } from "./locales/it";
import type { MessageKey, Messages } from "./types";

export type { MessageKey, Messages } from "./types";

/** Idiomas disponibles. `label` es el nombre en el propio idioma. */
export const LOCALES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
  { code: "ca", label: "Català" },
  { code: "de", label: "Deutsch" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

/** Idioma cuando no hay preferencia guardada ni uno compatible en el navegador. */
export const DEFAULT_LOCALE: Locale = "en";

export const CATALOGS: Record<Locale, Messages> = { es, en, it, ca, de };

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale.code === value);
}

export function isMessageKey(value: unknown): value is MessageKey {
  return typeof value === "string" && Object.hasOwn(es, value);
}

/**
 * Elige el primer idioma soportado de una lista de preferencias, p. ej.
 * `navigator.languages` (`["ca-ES", "es"]` -> `"ca"`).
 */
export function resolveLocale(candidates: readonly string[]): Locale {
  for (const candidate of candidates) {
    const primary = candidate.toLowerCase().split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

export function translate(locale: Locale, key: MessageKey): string {
  return CATALOGS[locale][key];
}
