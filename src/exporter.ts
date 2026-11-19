import { EXPORT } from "./config";
import { readSvgSize } from "./svg";

function serialize(svg: SVGElement): string {
  return new XMLSerializer().serializeToString(svg);
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar el SVG como imagen."));
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("No se pudo generar el PNG.")),
      "image/png",
    );
  });
}

export function exportSvg(svg: SVGElement): void {
  const blob = new Blob([serialize(svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  downloadBlob(blob, EXPORT.svgFileName);
}

/**
 * @param background color de relleno del PNG (el SVG de Mermaid es transparente).
 */
export async function exportPng(
  svg: SVGElement,
  background: string,
): Promise<void> {
  const { width, height } = readSvgSize(svg, EXPORT.fallbackSize);

  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));

  const svgUrl = URL.createObjectURL(
    new Blob([serialize(clone)], { type: "image/svg+xml;charset=utf-8" }),
  );

  try {
    const image = await loadImage(svgUrl);

    const canvas = document.createElement("canvas");
    canvas.width = width * EXPORT.pngScale;
    canvas.height = height * EXPORT.pngScale;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D no disponible.");

    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(EXPORT.pngScale, EXPORT.pngScale);
    context.drawImage(image, 0, 0, width, height);

    downloadBlob(await canvasToBlob(canvas), EXPORT.pngFileName);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
