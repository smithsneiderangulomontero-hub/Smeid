import { SVG_LAYOUT } from "./config";
import type { Size } from "./zoom";

export interface Box extends Size {
  x: number;
  y: number;
}

/** Calcula el viewBox con márgenes a partir del contenido real del SVG. */
export function computeViewBox(bbox: Box): Box {
  return {
    x: bbox.x - SVG_LAYOUT.paddingX,
    y: bbox.y - SVG_LAYOUT.paddingY,
    width: Math.max(bbox.width + SVG_LAYOUT.paddingX * 2, SVG_LAYOUT.minWidth),
    height: bbox.height + SVG_LAYOUT.paddingY * 2,
  };
}

/** Ajusta viewBox y tamaño del SVG generado por Mermaid para centrarlo con márgenes. */
export function normalizeSvg(svg: SVGGraphicsElement): void {
  const bbox = svg.getBBox();
  if (!bbox.width || !bbox.height) return;

  const box = computeViewBox(bbox);
  svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
  svg.setAttribute("width", String(Math.ceil(box.width)));
  svg.setAttribute("height", String(Math.ceil(box.height)));
  svg.style.maxWidth = "none";
}

/** Tamaño declarado del SVG, o `fallback` si los atributos no son numéricos. */
export function readSvgSize(svg: SVGElement, fallback: Size): Size {
  const width = Number.parseFloat(svg.getAttribute("width") ?? "");
  const height = Number.parseFloat(svg.getAttribute("height") ?? "");
  return {
    width: Number.isFinite(width) && width > 0 ? width : fallback.width,
    height: Number.isFinite(height) && height > 0 ? height : fallback.height,
  };
}
