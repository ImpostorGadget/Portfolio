/* =========================================================
   RESET COMPLETO
   1. Mueve los JS de public/ (si están ahí) a cheatsheets/js/
   2. Mueve el JSON de public/ (si está ahí) a data/
   3. Arregla los <script> de todos los HTML
   4. Arregla los imports del JSON
   5. Muestra la estructura final
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");


function log(msg) {
    console.log(msg);
}

function existe(p) {
    return fs.existsSync(p);
}

function moverCarpeta(origen, destino) {
    if (!existe(origen)) {
        log(`⏭️  No existe: ${path.relative(RAIZ, origen)}`);
        return;
    }

    fs.mkdirSync(destino, { recursive: true });

    fs.readdirSync(origen, { withFileTypes: true }).forEach((e) => {
        const o = path.join(origen, e.name);
        const d = path.join(destino, e.name);

        if (e.isDirectory()) {
            moverCarpeta(o, d);
        } else {
            if (existe(d)) fs.unlinkSync(d);
            fs.renameSync(o, d);
            log(`✅ ${path.relative(RAIZ, o)} → ${path.relative(RAIZ, d)}`);
        }
    });

    if (fs.readdirSync(origen).length === 0) {
        fs.rmdirSync(origen);
    }
}


function recorrerHTML(dir) {
    const out = [];

    if (!existe(dir)) return out;

    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        const ruta = path.join(dir, e.name);

        if (e.isDirectory()) out.push(...recorrerHTML(ruta));
        else if (e.name.endsWith(".html")) out.push(ruta);
    });

    return out;
}


function arreglarHTML(rutaHTML) {

    const relativa = path.relative(RAIZ, rutaHTML);

    /* Calcular prefijo según profundidad dentro de cheatsheets/ */

    const partes = path.dirname(relativa).split(path.sep);
    const profundidad = partes.length - 1;

    const prefijo = profundidad === 0 ? "./" : "../".repeat(profundidad);

    let contenido = fs.readFileSync(rutaHTML, "utf-8");
    const original = contenido;

    /* Reemplazar cualquier ruta hacia cheatsheets/js/ */

    contenido = contenido.replace(
        /src="[^"]*cheatsheets\/js\/([^"]+)"/g,
        `src="${prefijo}js/$1"`
    );

    /* Reemplazar /js/ en la raíz */

    contenido = contenido.replace(
        /src="\/js\/(app|stack)\.js"/g,
        `src="${prefijo}../../js/$1.js"`
    );

    if (contenido !== original) {
        fs.writeFileSync(rutaHTML, contenido, "utf-8");
        log(`✅ ${relativa}  →  ${prefijo}js/...`);
        return true;
    }

    return false;
}


function arreglarImportsJS() {

    const carpetaJS = path.join(RAIZ, "cheatsheets", "js");

    if (!existe(carpetaJS)) return;

    fs.readdirSync(carpetaJS)
        .filter((n) => n.endsWith(".js"))
        .forEach((nombre) => {
            const rutaAbs = path.join(carpetaJS, nombre);

            let contenido = fs.readFileSync(rutaAbs, "utf-8");
            const original = contenido;

            contenido = contenido.replace(
                /import\s+data\s+from\s+["'][^"']*cheatsheets\.json["'];?/g,
                `import data from "../../data/cheatsheets.json";`
            );

            if (contenido !== original) {
                fs.writeFileSync(rutaAbs, contenido, "utf-8");
                log(`✅ import: ${nombre}`);
            }
        });
}


/* =========================================================
   MAIN
========================================================= */

log("");
log("╔═══════════════════════════════════════════╗");
log("║  RESET COMPLETO DEL PROYECTO              ║");
log("╚═══════════════════════════════════════════╝");


/* 1. Mover JS de public/ a cheatsheets/js/ */

log("");
log("=========================================");
log("📦 1. JS: public/cheatsheets/js → cheatsheets/js");
log("=========================================");

moverCarpeta(
    path.join(RAIZ, "public", "cheatsheets", "js"),
    path.join(RAIZ, "cheatsheets", "js")
);


/* 2. Mover JSON de public/ a data/ */

log("");
log("=========================================");
log("📦 2. JSON: public/data → data");
log("=========================================");

moverCarpeta(
    path.join(RAIZ, "public", "data"),
    path.join(RAIZ, "data")
);


/* 3. Arreglar <script> de HTML */

log("");
log("=========================================");
log("🔧 3. Arreglando <script> en HTML");
log("=========================================");

const htmls = recorrerHTML(path.join(RAIZ, "cheatsheets"));
htmls.forEach(arreglarHTML);


/* 4. Arreglar imports del JSON */

log("");
log("=========================================");
log("🔧 4. Arreglando imports del JSON");
log("=========================================");

arreglarImportsJS();


/* 5. Resumen */

log("");
log("=========================================");
log("✅ COMPLETADO");
log("=========================================");
log("");
log("Estructura final esperada:");
log("");
log("  Portfolio/");
log("  ├── data/cheatsheets.json");
log("  ├── cheatsheets/");
log("  │   ├── js/");
log("  │   │   ├── cheatsheets.js");
log("  │   │   ├── cheatsheet.js");
log("  │   │   ├── cheatsheet-filtro.js");
log("  │   │   ├── cheatsheet-detalle.js");
log("  │   │   └── cheatsheet-comando.js");
log("  │   ├── index.html");
log("  │   └── ...");
log("  └── vite.config.js");
log("");
log("Ahora:");
log("  npm run dev");
log("  npm run build");
log("");