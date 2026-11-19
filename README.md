# SMEID

[![CI](https://github.com/smithsneiderangulomontero-hub/Smeid/actions/workflows/ci.yml/badge.svg)](https://github.com/smithsneiderangulomontero-hub/Smeid/actions/workflows/ci.yml)
[![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-green.svg)](./LICENSE)

Proyecto de software libre y sin fines de lucro. Visor y editor local de diagramas escritos con la sintaxis de [Mermaid](https://mermaid.js.org/): edición en vivo, zoom/desplazamiento, tema claro/oscuro, plantillas y exportación a SVG/PNG. Todo se ejecuta en el navegador; el código del diagrama solo se guarda en `localStorage`.

> SMEID es un proyecto independiente. **No está afiliado, patrocinado ni respaldado** por Mermaid, el proyecto `mermaid-js`, ni por Mermaid Chart / Mermaid Chart Inc. "Mermaid" y otros nombres citados pertenecen a sus respectivos titulares y se usan solo para describir la compatibilidad con su sintaxis.

## Requisitos

- Node.js >= 20

## Inicio rápido

```bash
npm install   # solo la primera vez
npm run dev   # abre la URL que muestra (normalmente http://localhost:5173)
```

> **No abras `index.html` con doble clic** (`file://`): la app está escrita en TypeScript y necesita pasar por Vite. Si lo haces verás la interfaz, pero ningún botón funcionará.

Para servir una versión de producción: `npm run build && npm run preview`.

## Scripts

| Comando             | Descripción                                         |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con HMR                      |
| `npm run build`     | Typecheck + build de producción en `dist/`          |
| `npm run preview`   | Sirve el build (con la CSP de producción aplicada)  |
| `npm run typecheck` | Comprueba tipos sin generar archivos                |
| `npm run lint`      | Lint y formato con Biome (`lint:fix` para corregir) |
| `npm run ci`        | Lint + tipos + tests + build (lo mismo que el CI)   |
| `npm run licenses`  | Regenera `THIRD_PARTY_LICENSES.md`                  |
| `npm test`          | Ejecuta los tests unitarios (Vitest)                |

## Arquitectura

```
index.html        Estructura de la UI
styles.css        Estilos y variables de tema
src/
  main.ts         Punto de entrada: obtiene elementos, conecta eventos y orquesta
  config.ts       Constantes (claves de storage, límites de zoom, nombres de export)
  dom.ts          requireElement(): acceso tipado y verificado al DOM
  storage.ts      localStorage tolerante a fallos
  theme.ts        Carga/guardado/aplicación del tema
  renderer.ts     Wrapper de Mermaid (carga lazy, anti-render obsoleto, limpieza)
  viewport.ts     Zoom y desplazamiento con "manito"
  svg.ts          Normalización del SVG generado
  exporter.ts     Exportación a SVG y PNG
  zoom.ts         Lógica pura de zoom (testeable)
  debounce.ts     Utilidad de debounce
  templates.ts    Plantillas de diagramas
```

Principios: la lógica pura (`zoom`, `svg.computeViewBox`, `debounce`) está separada del DOM para poder testearla; los módulos con DOM reciben sus dependencias por constructor o parámetro; el estado compartido se limita a `main.ts`.

## Seguridad

- Mermaid se empaqueta con la app (sin CDN) y se fija mediante `package-lock.json`.
- `securityLevel: "strict"` en Mermaid: el SVG se sanitiza y se deshabilitan HTML y clics dentro del diagrama.
- El build inyecta una `Content-Security-Policy` restrictiva (`script-src 'self'`, sin `unsafe-eval`). Ver `vite.config.ts`.
- Los mensajes de error se muestran con `textContent`, nunca como HTML.

> `innerHTML` se usa **solo** para insertar el SVG ya sanitizado por Mermaid. No pases por ahí contenido que no provenga de `mermaid.render`.

## Licencia

SMEID se distribuye bajo la licencia [MIT](./LICENSE): puedes usarlo, copiarlo, modificarlo y redistribuirlo, incluso con fines comerciales, conservando el aviso de copyright.

### Software de terceros

SMEID se apoya en software libre de terceros, entre otros:

- [Mermaid](https://github.com/mermaid-js/mermaid): licencia MIT. La librería es libre y gratuita; _Mermaid Chart_ es un producto comercial aparte, que SMEID no utiliza.
- [Vite](https://vite.dev/) y [Vitest](https://vitest.dev/) (desarrollo): licencia MIT.

El listado completo con los textos de licencia está en [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md) y se incluye dentro de `dist/` en cada build. Si cambias dependencias, regéneralo con `npm run licenses`.

## Contribuir

Las contribuciones son bienvenidas: lee [CONTRIBUTING.md](./CONTRIBUTING.md) y el [Código de Conducta](./CODE_OF_CONDUCT.md). Para reportar vulnerabilidades, consulta [SECURITY.md](./SECURITY.md).

## Persistencia

| Clave                     | Contenido                                           |
| ------------------------- | --------------------------------------------------- |
| `smeid_mermaid_codigo_v1` | Código del editor                                   |
| `smeid_mermaid_tema_v1`   | `"light"` o `"dark"` (si falta, usa el del sistema) |
