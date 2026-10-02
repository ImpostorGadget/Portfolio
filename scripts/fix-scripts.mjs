/* =========================================================
   ARREGLAR SCRIPTS
   Recorre todos los HTML de cheatsheets y corrige los
   <script type="module"> para que apunten correctamente
   a cheatsheets/js/*.js con rutas relativas.

   Reglas:
   - Todos los scripts deben estar en cheatsheets/js/
   - Cada HTML debe referenciarlos con ./js/... o ../js/...
     según su profundidad respecto a cheatsheets/
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");

const CHEATSHEETS_DIR = path.join(RAIZ, "cheatsheets");
const JS_DIR = path.join(CHEATSHEETS_DIR, "js");


/* =========================================================
   LOG
========================================================= */

function log(msg) {
    console.log(msg);
}


/* =========================================================
   DETECTAR SCRIPTS DISPONIBLES
========================================================= */

function listarScriptsDisponibles() {
    if (!fs.existsSync(JS_DIR)) {
        log(`⚠️  No existe la carpeta: ${path.relative(RAIZ, JS_DIR)}`);
        return [];
    }

    return fs
        .readdirSync(JS_DIR)
        .filter((n) => n.endsWith(".js"));
}


/* =========================================================
   RECORRER HTML
========================================================= */

function recorrerHTML(dir) {
    const out = [];

    if (!fs.existsSync(dir)) return out;

    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        const ruta = path.join(dir, e.name);

        if (e.isDirectory()) {
            out.push(...recorrerHTML(ruta));
        } else if (e.name.endsWith(".html")) {
            out.push(ruta);
        }
    });

    return out;
}


/* =========================================================
   CALCULAR PREFIJO
   Devuelve "./" si el HTML está en cheatsheets/
   Devuelve "../" si está en cheatsheets/detalle/
   Devuelve "../../" si está en cheatsheets/detalle/cybersecurity/
   ...
========================================================= */

function calcularPrefijo(rutaHTML) {
    const relativa = path.relative(RAIZ, rutaHTML);

    /* partes[0] = "cheatsheets"
       partes.length - 1 = profundidad real después de cheatsheets/
    */

    const partes = path.dirname(relativa).split(path.sep);
    const profundidad = partes.length - 1;

    return profundidad === 0 ? "./" : "../".repeat(profundidad);
}


/* =========================================================
   ARREGLAR UN HTML
========================================================= */

function arreglarHTML(rutaHTML) {

    /* Prefijo correcto para este HTML */

    const prefijo = calcularPrefijo(rutaHTML);

    /* Contenido actual */

    let contenido = fs.readFileSync(rutaHTML, "utf-8");
    const original = contenido;

    /* Reglas de reemplazo:
       1. /cheatsheets/js/X         → ./js/X (o ../js/X)
       2. ./js/X                    → sigue igual (se recalcula)
       3. ../js/X, ../../js/X, etc. → se recalcula según profundidad
       4. js/X (sin prefijo)        → añadir ./js/X
    */

    /* 1. Rutas absolutas desde la raíz del sitio */

    contenido = contenido.replace(
        /src="\/cheatsheets\/js\/([^"]+)"/g,
        `src="${prefijo}js/$1"`
    );

    /* 2. Rutas relativas mal calculadas (cualquier ../ seguido de js/) */

    contenido = contenido.replace(
        /src="(\.\.\/)+js\/([^"]+)"/g,
        `src="${prefijo}js/$2"`
    );

    /* 3. Rutas relativas simples ./js/ correctas (no hace falta tocar) */

    contenido = contenido.replace(
        /src="\.\/js\/([^"]+)"/g,
        `src="${prefijo}js/$1"`
    );

    /* 4. Sin prefijo (js/xxx.js) */

    contenido = contenido.replace(
        /src="js\/([^"]+)"/g,
        `src="${prefijo}js/$1"`
    );

    /* Si hubo cambios, guardar */

    if (contenido !== original) {
        fs.writeFileSync(rutaHTML, contenido, "utf-8");
        return true;
    }

    return false;
}


/* =========================================================
   MAIN
========================================================= */

function main() {
    log("");
    log("=========================================");
    log("🔧 Arreglando rutas de <script> en HTML");
    log("=========================================");
    log("");


    /* 1. Comprobar carpeta de JS */

    const scripts = listarScriptsDisponibles();

    log(`Scripts disponibles en cheatsheets/js/:`);
    scripts.forEach((s) => log(`   · ${s}`));
    log("");


    /* 2. Recorrer HTMLs */

    const archivos = recorrerHTML(CHEATSHEETS_DIR);

    log(`HTMLs encontrados: ${archivos.length}`);
    log("");


    /* 3. Arreglar cada uno */

    let modificados = 0;
    let sinCambios = 0;

    archivos.forEach((rutaAbs) => {
        const relativa = path.relative(RAIZ, rutaAbs);
        const prefijo = calcularPrefijo(rutaAbs);

        const cambio = arreglarHTML(rutaAbs);

        if (cambio) {
            log(`✅ ${relativa}  →  prefijo "${prefijo}"`);
            modificados++;
        } else {
            log(`⏭️  Sin cambios: ${relativa}`);
            sinCambios++;
        }
    });


    /* 4. Resumen */

    log("");
    log("=========================================");
    log("✅ COMPLETADO");
    log("=========================================");
    log(`Modificados:  ${modificados}`);
    log(`Sin cambios:  ${sinCambios}`);
    log("");
    log("Ahora:");
    log("  npm run dev    (probar)");
    log("  npm run build  (debe funcionar)");
    log("");
}


main();