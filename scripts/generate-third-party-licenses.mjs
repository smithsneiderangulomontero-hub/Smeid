// Genera THIRD_PARTY_LICENSES.md con las licencias de las dependencias de
// producción (las que se empaquetan en el build). Ejecutar: npm run licenses
import { init } from "license-checker-rseidelsohn";
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const OUTPUT = "THIRD_PARTY_LICENSES.md";

const packages = await new Promise((resolve, reject) => {
  init(
    { start: process.cwd(), production: true, excludePrivatePackages: true },
    (error, json) => (error ? reject(error) : resolve(json)),
  );
});

/** Solo se incluye el texto si el archivo es realmente una licencia (no un README). */
function readLicenseText(file) {
  if (!file || !/^(licen[cs]e|copying)/i.test(basename(file))) return null;
  return readFileSync(file, "utf8").trim();
}

const sections = Object.keys(packages)
  .sort((a, b) => a.localeCompare(b))
  .map((id) => {
    const pkg = packages[id];
    const text = readLicenseText(pkg.licenseFile);
    return [
      `## ${id}`,
      "",
      `- Licencia: ${[pkg.licenses].flat().join(", ")}`,
      pkg.repository ? `- Repositorio: ${pkg.repository}` : null,
      "",
      text
        ? ["```text", text, "```"].join("\n")
        : "_Sin archivo de licencia en el paquete; ver el repositorio._",
      "",
    ]
      .filter((line) => line !== null)
      .join("\n");
  });

const header = [
  "# Licencias de terceros",
  "",
  "SMEID incluye (empaquetado en el build) las siguientes dependencias de",
  "software libre. Cada una conserva su propia licencia y copyright.",
  "",
  "> Archivo generado con `npm run licenses`. No editar a mano.",
  "",
].join("\n");

writeFileSync(OUTPUT, `${header}\n${sections.join("\n")}`);
console.log(`${OUTPUT}: ${sections.length} paquetes`);
