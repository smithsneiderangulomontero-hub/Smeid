import { describe, expect, it } from "vitest";
import { ZOOM } from "./config";
import { clampZoom, fitZoom, zoomIn, zoomOut } from "./zoom";

describe("clampZoom", () => {
  it("limita al rango permitido", () => {
    expect(clampZoom(0)).toBe(ZOOM.min);
    expect(clampZoom(99)).toBe(ZOOM.max);
  });

  it("redondea a 2 decimales", () => {
    expect(clampZoom(1.0000001)).toBe(1);
  });
});

describe("zoomIn / zoomOut", () => {
  it("avanzan un paso sin arrastrar errores de coma flotante", () => {
    expect(zoomIn(1)).toBe(1.1);
    expect(zoomIn(1.1)).toBe(1.2);
    expect(zoomOut(1.1)).toBe(1);
  });

  it("no superan los límites", () => {
    expect(zoomIn(ZOOM.max)).toBe(ZOOM.max);
    expect(zoomOut(ZOOM.min)).toBe(ZOOM.min);
  });
});

describe("fitZoom", () => {
  it("reduce un diagrama que no cabe", () => {
    const result = fitZoom(
      { width: 1000, height: 500 },
      { width: 548, height: 1000 },
    );
    expect(result).toBe(0.5);
  });

  it("no amplía por encima de fitMax", () => {
    const result = fitZoom(
      { width: 10, height: 10 },
      { width: 5000, height: 5000 },
    );
    expect(result).toBe(ZOOM.fitMax);
  });

  it("devuelve null con contenido o contenedor inutilizables", () => {
    expect(
      fitZoom({ width: 0, height: 10 }, { width: 500, height: 500 }),
    ).toBeNull();
    expect(
      fitZoom({ width: 10, height: 10 }, { width: 20, height: 500 }),
    ).toBeNull();
  });
});
