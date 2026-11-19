/** Claves de localStorage. Se mantienen con versión para poder migrar datos. */
export const STORAGE_KEYS = {
  code: "smeid_mermaid_codigo_v1",
  theme: "smeid_mermaid_tema_v1",
} as const;

export const ZOOM = {
  default: 1,
  min: 0.25,
  max: 2.5,
  step: 0.1,
  /** Límite superior al usar "Ajustar al contenedor". */
  fitMax: 1.5,
  /** Margen (px) que se reserva alrededor del diagrama al ajustar. */
  fitMargin: 48,
} as const;

export const SVG_LAYOUT = {
  paddingX: 50,
  paddingY: 40,
  minWidth: 720,
} as const;

/** Espera tras la última pulsación antes de volver a renderizar. */
export const RENDER_DEBOUNCE_MS = 250;
export const COPY_FEEDBACK_MS = 1400;

export const EXPORT = {
  svgFileName: "diagrama-smeid.svg",
  pngFileName: "diagrama-smeid.png",
  pngScale: 2,
  fallbackSize: { width: 900, height: 600 },
} as const;
