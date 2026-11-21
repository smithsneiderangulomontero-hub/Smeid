import { describe, expect, it } from "vitest";
import { LOCALES } from "./i18n";
import {
  detectTemplate,
  getTemplate,
  isPlantillaId,
  type PlantillaId,
} from "./templates";

const IDS: readonly PlantillaId[] = ["roadmap", "arquitectura"];

describe("isPlantillaId", () => {
  it("acepta ids existentes", () => {
    for (const id of IDS) expect(isPlantillaId(id)).toBe(true);
  });

  it("rechaza valores desconocidos o propiedades heredadas", () => {
    expect(isPlantillaId("nope")).toBe(false);
    expect(isPlantillaId("toString")).toBe(false);
    expect(isPlantillaId(undefined)).toBe(false);
  });
});

describe("getTemplate", () => {
  for (const { code } of LOCALES) {
    for (const id of IDS) {
      it(`${id} (${code}) es un flowchart con comillas balanceadas`, () => {
        const template = getTemplate(id, code);
        expect(template.startsWith("flowchart TB\n")).toBe(true);
        expect(template.split('"').length % 2).toBe(1);
        expect(template).not.toContain("undefined");
      });
    }
  }

  it("cada idioma produce un texto distinto", () => {
    for (const id of IDS) {
      const texts = LOCALES.map(({ code }) => getTemplate(id, code));
      expect(new Set(texts).size).toBe(LOCALES.length);
    }
  });

  it("detectTemplate reconoce una plantilla sin editar en su idioma", () => {
    expect(detectTemplate(getTemplate("roadmap", "de"), "de")).toBe("roadmap");
    expect(detectTemplate(getTemplate("arquitectura", "ca"), "ca")).toBe(
      "arquitectura",
    );
  });

  it("detectTemplate ignora plantillas editadas o de otro idioma", () => {
    const edited = `${getTemplate("roadmap", "es")}\n    X --> Y`;
    expect(detectTemplate(edited, "es")).toBeUndefined();
    expect(detectTemplate(getTemplate("roadmap", "es"), "en")).toBeUndefined();
    expect(detectTemplate("", "es")).toBeUndefined();
  });

  it("conserva la estructura del grafo entre idiomas", () => {
    const structure = (code: string): string[] =>
      code.match(/\b\w+ --> \w+\b|\bsubgraph \w+/g) ?? [];
    for (const id of IDS) {
      const base = structure(getTemplate(id, "es"));
      expect(base.length).toBeGreaterThan(0);
      for (const { code } of LOCALES) {
        expect(structure(getTemplate(id, code))).toEqual(base);
      }
    }
  });
});
