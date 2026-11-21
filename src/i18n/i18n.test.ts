import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CATALOGS,
  DEFAULT_LOCALE,
  isLocale,
  isMessageKey,
  LOCALES,
  resolveLocale,
  translate,
} from "./index";
import { es } from "./locales/es";

describe("catálogos", () => {
  const baseKeys = Object.keys(es).sort();

  for (const { code } of LOCALES) {
    it(`${code} tiene exactamente las claves de es`, () => {
      expect(Object.keys(CATALOGS[code]).sort()).toEqual(baseKeys);
    });

    it(`${code} no tiene textos vacíos`, () => {
      for (const value of Object.values(CATALOGS[code])) {
        expect(value.trim()).not.toBe("");
      }
    });
  }

  it("los nombres de idioma son únicos", () => {
    const labels = LOCALES.map((locale) => locale.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe("resolveLocale", () => {
  it("usa el idioma principal, ignorando región y mayúsculas", () => {
    expect(resolveLocale(["ca-ES"])).toBe("ca");
    expect(resolveLocale(["DE-at"])).toBe("de");
    expect(resolveLocale(["it"])).toBe("it");
  });

  it("respeta el orden de preferencia y salta los no soportados", () => {
    expect(resolveLocale(["fr-FR", "ca", "es"])).toBe("ca");
  });

  it("usa el idioma por defecto si ninguno está soportado o la lista está vacía", () => {
    expect(resolveLocale(["fr", "pt-BR"])).toBe(DEFAULT_LOCALE);
    expect(resolveLocale([])).toBe(DEFAULT_LOCALE);
    expect(resolveLocale([""])).toBe(DEFAULT_LOCALE);
  });
});

describe("guards", () => {
  it("isLocale solo acepta códigos soportados", () => {
    expect(isLocale("de")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it("isMessageKey rechaza propiedades heredadas", () => {
    expect(isMessageKey("app.title")).toBe(true);
    expect(isMessageKey("toString")).toBe(false);
    expect(isMessageKey(undefined)).toBe(false);
  });
});

describe("translate", () => {
  it("devuelve el texto del idioma pedido", () => {
    expect(translate("en", "copy.done")).toBe("Copied");
    expect(translate("de", "copy.done")).toBe("Kopiert");
  });
});

describe("index.html", () => {
  const html = readFileSync("index.html", "utf8");
  const keys = [...html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g)].map(
    (match) => match[1],
  );

  it("usa claves de traducción", () => {
    expect(keys.length).toBeGreaterThan(0);
  });

  it("todas las claves data-i18n* existen en el catálogo", () => {
    for (const key of keys) expect(isMessageKey(key)).toBe(true);
  });
});
