/**
 * Catálogo base. Sus claves definen `MessageKey`: los demás idiomas deben
 * tener exactamente las mismas, o el typecheck falla.
 */
export const es = {
  "app.title": "SMEID · Visor de diagramas local",

  "tpl.roadmap.title": "Cargar plantilla Roadmap TB",
  "tpl.roadmap.label": "Roadmap",
  "tpl.arch.title": "Cargar plantilla Arquitectura",
  "tpl.arch.label": "Arq.",
  "tpl.clear.title": "Limpiar editor",
  "tpl.clear.label": "Limpiar",

  "theme.aria": "Cambiar tema",
  "theme.toLight": "Cambiar a modo claro",
  "theme.toDark": "Cambiar a modo oscuro",

  "copy.title": "Copiar código",
  "copy.done": "Copiado",
  "export.svg.title": "Exportar SVG",
  "export.png.title": "Exportar PNG",

  "panel.collapse": "Contraer panel de código",
  "panel.expand": "Expandir panel de código",
  "editor.aria": "Código del diagrama Mermaid",
  "editor.placeholder":
    "Escribe o pega tu diagrama Mermaid aquí (ej. flowchart TB)...",

  "zoom.out": "Alejar",
  "zoom.in": "Acercar",
  "zoom.reset": "Restablecer zoom a 100%",
  "zoom.fit.title": "Ajustar al contenedor",
  "zoom.fit.label": "Ajustar",
  "pan.title": "Activar o desactivar mover con manito",
  "pan.label": "Manito",

  "lang.label": "Idioma",

  "status.initial": "Guardado local activo",
  "status.saved": "Guardado en localStorage",
  "status.saveFailed": "No se pudo guardar en localStorage",
  "status.restored": "Recuperado de localStorage",

  "error.render": "Error al renderizar:",
  "error.window": "Error de ventana:",
  "error.unexpected": "Error inesperado:",
  "error.copy": "No se pudo copiar al portapapeles.",
  "error.export.generic": "No se pudo exportar a PNG.",
  "error.export.image": "No se pudo cargar el SVG como imagen.",
  "error.export.png": "No se pudo generar el PNG.",
  "error.export.canvas": "Canvas 2D no disponible.",
} as const;
