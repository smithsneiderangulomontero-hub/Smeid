import { ZOOM } from "./config";

export interface Size {
  width: number;
  height: number;
}

const round2 = (value: number): number => Number(value.toFixed(2));

export function clampZoom(value: number, max: number = ZOOM.max): number {
  return Math.min(max, Math.max(ZOOM.min, round2(value)));
}

export const zoomIn = (current: number): number =>
  clampZoom(current + ZOOM.step);

export const zoomOut = (current: number): number =>
  clampZoom(current - ZOOM.step);

/**
 * Zoom necesario para que `content` quepa en `available`.
 * Devuelve `null` si alguna de las dimensiones no es utilizable.
 */
export function fitZoom(content: Size, available: Size): number | null {
  if (content.width <= 0 || content.height <= 0) return null;

  const width = available.width - ZOOM.fitMargin;
  const height = available.height - ZOOM.fitMargin;
  if (width <= 0 || height <= 0) return null;

  return clampZoom(
    Math.min(width / content.width, height / content.height),
    ZOOM.fitMax,
  );
}
