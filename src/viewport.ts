import { ZOOM } from "./config";
import { readSvgSize } from "./svg";
import { clampZoom, fitZoom, zoomIn, zoomOut } from "./zoom";

/**
 * Gestiona zoom y desplazamiento ("manito") del diagrama dentro de su contenedor.
 */
export class Viewport {
  private zoom: number = ZOOM.default;
  private panMode = false;
  private dragOrigin:
    | { x: number; y: number; scrollLeft: number; scrollTop: number }
    | undefined;

  constructor(
    private readonly container: HTMLElement,
    private readonly canvas: HTMLElement,
    private readonly onZoomChange: (zoom: number) => void,
  ) {
    container.addEventListener("pointerdown", this.startDrag);
    container.addEventListener("pointermove", this.drag);
    container.addEventListener("pointerup", this.endDrag);
    container.addEventListener("pointercancel", this.endDrag);
  }

  get isPanMode(): boolean {
    return this.panMode;
  }

  zoomIn(): void {
    this.setZoom(zoomIn(this.zoom));
  }

  zoomOut(): void {
    this.setZoom(zoomOut(this.zoom));
  }

  reset(): void {
    this.setZoom(ZOOM.default);
  }

  fit(): void {
    const svg = this.canvas.querySelector("svg");
    if (!svg) return;

    const next = fitZoom(svg.getBBox(), {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    });
    if (next !== null) this.setZoom(next);
  }

  /** Recalcula el espacio de scroll; llamar al cambiar contenido o layout. */
  refresh(): void {
    this.canvas.style.transform = `scale(${this.zoom})`;
    this.updateScrollSpace();
    this.onZoomChange(this.zoom);
  }

  setPanMode(active: boolean): void {
    this.panMode = active;
    this.container.classList.toggle("modo-manito", active);
    if (!active) this.endDrag();
  }

  /** `transform: scale` no altera el layout, así que se reserva el espacio extra a mano. */
  updateScrollSpace(): void {
    const svg = this.canvas.querySelector("svg");
    if (!svg) {
      this.canvas.style.margin = "0";
      return;
    }

    const rect = svg.getBoundingClientRect();
    const { width, height } = readSvgSize(svg, {
      width: rect.width / this.zoom,
      height: rect.height / this.zoom,
    });
    const extraX = Math.max(0, width * (this.zoom - 1));
    const extraY = Math.max(0, height * (this.zoom - 1));

    this.canvas.style.marginRight = `${Math.ceil(extraX)}px`;
    this.canvas.style.marginBottom = `${Math.ceil(extraY)}px`;
  }

  private setZoom(value: number): void {
    this.zoom = clampZoom(value);
    this.refresh();
  }

  private readonly startDrag = (event: PointerEvent): void => {
    if (!this.panMode || event.button !== 0) return;
    this.dragOrigin = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: this.container.scrollLeft,
      scrollTop: this.container.scrollTop,
    };
    this.container.setPointerCapture(event.pointerId);
    this.container.classList.add("arrastrando");
  };

  private readonly drag = (event: PointerEvent): void => {
    if (!this.dragOrigin) return;
    this.container.scrollLeft =
      this.dragOrigin.scrollLeft - (event.clientX - this.dragOrigin.x);
    this.container.scrollTop =
      this.dragOrigin.scrollTop - (event.clientY - this.dragOrigin.y);
  };

  private readonly endDrag = (): void => {
    this.dragOrigin = undefined;
    this.container.classList.remove("arrastrando");
  };
}
