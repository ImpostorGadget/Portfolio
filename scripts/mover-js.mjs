/* =========================================================
   MOVER TODO
   Mueve los JS y el JSON a su ubicación definitiva:
     - public/cheatsheets/js  →  cheatsheets/js
     - public/data            →  data
     - js/cheatsheets.js      →  (borrar, ya no se usa)

   Y arregla automáticamente los <script> de los HTML
   para que usen rutas relativas.
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");


/* =========================================================
   HELPERS
========================================================= */

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
            if (existe(d)) {
                log(`⚠️  Ya existe, se sobreescribe: ${path.relative(RAIZ, d)}`);
                fs.unlinkSync(d);
            }

            fs.renameSync(o, d);
            log(`✅ ${path.relative(RAIZ, o)} → ${path.relative(RAIZ, d)}`);
        }
    });

    /* Borrar carpeta origen si queda vacía */

    if (fs.readdirSync(origen).length === 0) {
        fs.rmdirSync(origen);
    }
}

function borrarArchivoSiExiste(p) {
    if (existe(p)) {
        fs.unlinkSync(p);
        log(`🗑️  Eliminado: ${path.relative(RAIZ, p)}`);
    }
}


/* =========================================================
   RECORRER HTML
========================================================= */

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


/* =========================================================
   ARREGLAR <script> EN HTML
========================================================= */

function arreglarScriptsHTML() {
    log("");
    log("=========================================");
    log("🔧 Arreglando <script> de los HTML");
    log("=========================================");
    log("");

    const dir = path.join(RAIZ, "cheatsheets");
    const archivos = recorrerHTML(dir);

    let modificados = 0;

    archivos.forEach((rutaAbs) => {
        const relativa = path.relative(RAIZ, rutaAbs);

        /* Calcular prefijo según profundidad:
           - "cheatsheets/index.html"                        → "./"
           - "cheatsheets/detalle/cybersecurity/recon.html"  → "../../"
        */

        const partes = path.dirname(relativa).split(path.sep);
        const profundidad = partes.length - 1;
        const prefijo = profundidad === 0 ? "./" : "../".repeat(profundidad);

        let contenido = fs.readFileSync(rutaAbs, "utf-8");
        const original = contenido;

        /* Reemplazar cualquier ruta que apunte a cheatsheets/js/... */

        contenido = contenido.replace(
            /src="[^"]*\/?cheatsheets\/js\/([^"]+)"/g,
            `src="${prefijo}js/$1"`
        );

        if (contenido !== original) {
            fs.writeFileSync(rutaAbs, contenido, "utf-8");
            log(`✅ ${relativa}  →  ${prefijo}js/...`);
            modificados++;
        }
    });

    log("");
    log(`✅ HTMLs modificados: ${modificados}`);
}


/* =========================================================
   ARREGLAR IMPORTS DEL JSON EN JS
========================================================= */

function arreglarImportsJS() {
    log("");
    log("=========================================");
    log("🔧 Arreglando imports del JSON en los JS");
    log("=========================================");
    log("");

    const carpetaJS = path.join(RAIZ, "cheatsheets", "js");

    if (!existe(carpetaJS)) {
        log(`⏭️  No existe: ${path.relative(RAIZ, carpetaJS)}`);
        return;
    }

    const archivos = fs.readdirSync(carpetaJS).filter((n) => n.endsWith(".js"));

    let modificados = 0;

    archivos.forEach((nombre) => {
        const rutaAbs = path.join(carpetaJS, nombre);

        let contenido = fs.readFileSync(rutaAbs, "utf-8");
        const original = contenido;

        /* Reemplazar cualquier import del JSON por la ruta correcta */

        contenido = contenido.replace(
            /import\s+data\s+from\s+["'][^"']*cheatsheets\.json["'];?/g,
            `import data from "../../data/cheatsheets.json";`
        );

        if (contenido !== original) {
            fs.writeFileSync(rutaAbs, contenido, "utf-8");
            log(`✅ ${nombre}`);
            modificados++;
        }
    });

    log("");
    log(`✅ JS modificados: ${modificados}`);
}


/* =========================================================
   MAIN
========================================================= */

log("");
log("╔═══════════════════════════════════════════╗");
log("║  MOVER TODO — JS + JSON + arreglar rutas  ║");
log("╚═══════════════════════════════════════════╝");


/* 1. Mover public/cheatsheets/js → cheatsheets/js */

log("");
log("=========================================");
log("📦 1. Moviendo JS de public/ a cheatsheets/");
log("=========================================");

moverCarpeta(
    path.join(RAIZ, "public", "cheatsheets", "js"),
    path.join(RAIZ, "cheatsheets", "js")
);


/* 2. Mover public/data → data */

log("");
log("=========================================");
log("📦 2. Moviendo JSON de public/ a data/");
log("=========================================");

moverCarpeta(
    path.join(RAIZ, "public", "data"),
    path.join(RAIZ, "data")
);


/* 3. Borrar js/cheatsheets.js (duplicado antiguo) */

log("");
log("=========================================");
log("🗑️  3. Limpiando archivos duplicados");
log("=========================================");

borrarArchivoSiExiste(
    path.join(RAIZ, "js", "cheatsheets.js")
);

borrarArchivoSiExiste(
    path.join(RAIZ, "js", "cheatsheet.js")
);

borrarArchivoSiExiste(
    path.join(RAIZ, "js", "cheatsheet-filtro.js")
);

borrarArchivoSiExiste(
    path.join(RAIZ, "js", "cheatsheet-comando.js")
);


/* 4. Arreglar <script> en HTML */

arreglarScriptsHTML();


/* 5. Arreglar imports del JSON */

arreglarImportsJS();


/* =========================================================
   RESUMEN FINAL
========================================================= */

log("");
log("=========================================");
log("✅ MOVIMIENTO COMPLETADO");
log("=========================================");
log("");
log("Estructura final:");
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
log("");
log("Ahora ejecuta:");
log("  npm run dev     (probar en dev)");
log("  npm run build   (construir producción)");
log("");