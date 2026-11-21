import { STORAGE_KEYS } from "../config";
import { safeStorage } from "../storage";
import {
  DEFAULT_LOCALE,
  isLocale,
  isMessageKey,
  type Locale,
  type MessageKey,
  resolveLocale,
  translate,
} from "./index";

/** Atributos HTML que se traducen: `data-i18n-<nombre>` -> atributo destino. */
const ATTRIBUTE_BINDINGS = [
  ["data-i18n-title", "title"],
  ["data-i18n-aria-label", "aria-label"],
  ["data-i18n-placeholder", "placeholder"],
] as const;

let current: Locale = DEFAULT_LOCALE;
const listeners = new Set<(locale: Locale) => void>();

export const getLocale = (): Locale => current;

export const t = (key: MessageKey): string => translate(current, key);

/** Idioma guardado por el usuario; si no hay, el del navegador. */
export function detectInitialLocale(): Locale {
  const saved = safeStorage.get(STORAGE_KEYS.locale);
  if (isLocale(saved)) return saved;
  return resolveLocale(
    navigator.languages.length > 0 ? navigator.languages : [navigator.language],
  );
}

/** Traduce los elementos marcados con `data-i18n*` dentro de `root`. */
export function applyTranslations(root: ParentNode = document): void {
  for (const element of root.querySelectorAll("[data-i18n]")) {
    const key = element.getAttribute("data-i18n");
    if (isMessageKey(key)) element.textContent = t(key);
  }

  for (const [source, target] of ATTRIBUTE_BINDINGS) {
    for (const element of root.querySelectorAll(`[${source}]`)) {
      const key = element.getAttribute(source);
      if (isMessageKey(key)) element.setAttribute(target, t(key));
    }
  }
}

export function setLocale(locale: Locale, persist = true): void {
  current = locale;
  document.documentElement.lang = locale;
  document.title = t("app.title");
  applyTranslations();

  if (persist) safeStorage.set(STORAGE_KEYS.locale, locale);
  for (const listener of listeners) listener(locale);
}

/** Registra un callback para refrescar textos que se generan desde el código. */
export function onLocaleChange(listener: (locale: Locale) => void): void {
  listeners.add(listener);
}
