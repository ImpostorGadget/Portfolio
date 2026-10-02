/* =========================================================
   FIX SCRIPTS — Convierte las rutas absolutas /cheatsheets/js/X
   a rutas relativas ./js/X o ../../js/X según profundidad.
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
const CHEATSHEETS_DIR = path.join(RAIZ, "cheatsheets");


function recorrerHTML(dir) {
    const out = [];

    if (!fs.existsSync(dir)) return out;

    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        const ruta = path.join(dir, e.name);

        if (e.isDirectory()) out.push(...recorrerHTML(ruta));
        else if (e.name.endsWith(".html")) out.push(ruta);
    });

    return out;
}


const archivos = recorrerHTML(CHEATSHEETS_DIR);

let modificados = 0;

archivos.forEach((rutaAbs) => {
    const relativa = path.relative(RAIZ, rutaAbs);

    /* Calcular cuántos niveles subir hasta "cheatsheets/"
       Ej:
       - "cheatsheets/index.html"                      → profundidad 0
       - "cheatsheets/detalle/cybersecurity/recon.html" → profundidad 2
    */

    const partes = path.dirname(relativa).split(path.sep);

    /* partes[0] = "cheatsheets" */
    const profundidad = partes.length - 1;

    const prefijo = profundidad === 0 ? "./" : "../".repeat(profundidad);

    let contenido = fs.readFileSync(rutaAbs, "utf-8");
    const original = contenido;

    /* Reemplazar /cheatsheets/js/X → ./js/X (o ../../js/X) */

    contenido = contenido.replace(
        /src="\/cheatsheets\/js\/([^"]+)"/g,
        `src="${prefijo}js/$1"`
    );

    if (contenido !== original) {
        fs.writeFileSync(rutaAbs, contenido, "utf-8");
        console.log(`✅ ${relativa}  →  prefijo "${prefijo}"`);
        modificados++;
    }
});

console.log("");
console.log("=========================================");
console.log(`✅ Modificados: ${modificados}`);
console.log("=========================================");
console.log("");
console.log("Ahora:");
console.log("  npm run dev    (probar)");
console.log("  npm run build  (debe funcionar)");
console.log("");