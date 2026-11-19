import { describe, expect, it } from "vitest";
import { SVG_LAYOUT } from "./config";
import { computeViewBox } from "./svg";

describe("computeViewBox", () => {
  it("añade márgenes alrededor del contenido", () => {
    const box = computeViewBox({ x: 10, y: 20, width: 1000, height: 300 });
    expect(box).toEqual({
      x: 10 - SVG_LAYOUT.paddingX,
      y: 20 - SVG_LAYOUT.paddingY,
      width: 1000 + SVG_LAYOUT.paddingX * 2,
      height: 300 + SVG_LAYOUT.paddingY * 2,
    });
  });

  it("respeta el ancho mínimo en diagramas estrechos", () => {
    const box = computeViewBox({ x: 0, y: 0, width: 100, height: 100 });
    expect(box.width).toBe(SVG_LAYOUT.minWidth);
  });
});
