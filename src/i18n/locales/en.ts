import type { Messages } from "../types";

export const en: Messages = {
  "app.title": "SMEID · Local diagram viewer",

  "tpl.roadmap.title": "Load Roadmap TB template",
  "tpl.roadmap.label": "Roadmap",
  "tpl.arch.title": "Load Architecture template",
  "tpl.arch.label": "Arch.",
  "tpl.clear.title": "Clear editor",
  "tpl.clear.label": "Clear",

  "theme.aria": "Toggle theme",
  "theme.toLight": "Switch to light mode",
  "theme.toDark": "Switch to dark mode",

  "copy.title": "Copy code",
  "copy.done": "Copied",
  "export.svg.title": "Export SVG",
  "export.png.title": "Export PNG",

  "panel.collapse": "Collapse code panel",
  "panel.expand": "Expand code panel",
  "editor.aria": "Mermaid diagram code",
  "editor.placeholder":
    "Write or paste your Mermaid diagram here (e.g. flowchart TB)...",

  "zoom.out": "Zoom out",
  "zoom.in": "Zoom in",
  "zoom.reset": "Reset zoom to 100%",
  "zoom.fit.title": "Fit to container",
  "zoom.fit.label": "Fit",
  "pan.title": "Toggle hand tool to drag the diagram",
  "pan.label": "Pan",

  "lang.label": "Language",

  "status.initial": "Local save enabled",
  "status.saved": "Saved to localStorage",
  "status.saveFailed": "Could not save to localStorage",
  "status.restored": "Restored from localStorage",

  "error.render": "Render error:",
  "error.window": "Window error:",
  "error.unexpected": "Unexpected error:",
  "error.copy": "Could not copy to the clipboard.",
  "error.export.generic": "Could not export to PNG.",
  "error.export.image": "Could not load the SVG as an image.",
  "error.export.png": "Could not generate the PNG.",
  "error.export.canvas": "2D canvas not available.",
};
