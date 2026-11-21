# Contribuir a SMEID

¡Gracias por tu interés! SMEID es software libre y sin fines de lucro; toda ayuda es bienvenida: errores, ideas, documentación, traducciones y código.

## Preparar el entorno

Requisitos: Node.js >= 20.

```bash
git clone https://github.com/smithsneiderangulomontero-hub/Smeid.git
cd Smeid
npm install
npm run dev
```

> No abras `index.html` con doble clic: necesita pasar por Vite.

## Flujo de trabajo

1. Abre un issue para cambios grandes antes de empezar, así evitamos trabajo duplicado.
2. Crea una rama desde `main` (`feature/...` o `fix/...`).
3. Haz cambios pequeños y enfocados.
4. Comprueba que todo pasa en local:

   ```bash
   npm run ci   # lint + tipos + tests + build
   ```

5. Abre un Pull Request y rellena la plantilla.

## Convenciones

- **Formato y lint**: [Biome](https://biomejs.dev/). Usa `npm run lint:fix` para corregir automáticamente.
- **Commits**: mensajes claros, preferiblemente con [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`...).
- **Tests**: la lógica pura va en módulos sin DOM y con test (`*.test.ts` junto al módulo).
- **Seguridad**: no uses `innerHTML` con contenido que no provenga de `mermaid.render`. Los mensajes de error se muestran con `textContent`.
- **CSP**: no añadas scripts externos ni `eval`; el build aplica una política estricta.

## Añadir o corregir un idioma

Los textos viven en `src/i18n/locales/` (un archivo por idioma). `es.ts` es el catálogo base: sus claves definen el tipo `MessageKey`, y el resto de idiomas deben tener **exactamente** las mismas (el typecheck y los tests lo comprueban).

Para **corregir una traducción**, edita el archivo del idioma.

Para **añadir un idioma** (por ejemplo francés, `fr`):

1. Crea `src/i18n/locales/fr.ts` copiando `en.ts` y traduciendo los valores (no las claves).
2. En `src/i18n/index.ts`: importa `fr`, añádelo a `LOCALES` (con su nombre en ese idioma, p. ej. `Français`) y a `CATALOGS`.
3. En `src/templates.ts`: añade las entradas `fr` en `ROADMAP_TEXT` y `ARCHITECTURE_TEXT`. Evita comillas dobles (`"`) dentro de los textos.
4. Ejecuta `npm run ci`. Los tipos te avisarán si falta alguna clave o idioma.
5. Prueba con `npm run dev` que los textos no se desbordan y que las plantillas se ven bien (los compuestos largos pueden partirse).

Si añades texto nuevo a la interfaz, añade la clave en `es.ts` y en todos los demás idiomas, y en el HTML usa `data-i18n` (texto), `data-i18n-title`, `data-i18n-aria-label` o `data-i18n-placeholder`. Los textos generados desde TypeScript se piden con `t("clave")`.

## Dependencias y licencias

Se prefieren dependencias con licencia permisiva compatible con MIT (MIT, ISC, BSD, Apache-2.0). La única excepción actual es `elkjs` (dependencia de Mermaid, `EPL-2.0 OR GPL-3.0-or-later`), que usamos bajo EPL-2.0 sin modificarla; no añadas otras dependencias con copyleft sin abrir antes un issue. Si añades o cambias dependencias de producción, ejecuta `npm run licenses` y confirma el cambio de `THIRD_PARTY_LICENSES.md`.

## Qué no incluir

- Código copiado de fuentes con licencia incompatible o sin licencia.
- Secretos, claves, datos personales o información confidencial de empresas o clientes (en código, plantillas, ejemplos o capturas).

## Licencia de las contribuciones

Al enviar un cambio aceptas que se publique bajo la [licencia MIT](./LICENSE) del proyecto.

Al participar aceptas respetar el [Código de Conducta](./CODE_OF_CONDUCT.md).
