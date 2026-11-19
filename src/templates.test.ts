import { describe, expect, it } from "vitest";
import { isPlantillaId, PLANTILLAS } from "./templates";

describe("isPlantillaId", () => {
  it("acepta ids existentes", () => {
    for (const id of Object.keys(PLANTILLAS)) {
      expect(isPlantillaId(id)).toBe(true);
    }
  });

  it("rechaza valores desconocidos o propiedades heredadas", () => {
    expect(isPlantillaId("nope")).toBe(false);
    expect(isPlantillaId("toString")).toBe(false);
    expect(isPlantillaId(undefined)).toBe(false);
  });
});
