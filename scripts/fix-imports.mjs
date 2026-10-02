/* =========================================================
   FIX IMPORTS — Arregla todas las rutas de import del JSON
   Detecta la ubicación de cada JS y calcula la ruta
   relativa correcta hacia data/cheatsheets.json
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const JSON_DESTINO = "data/cheatsheets.json";

/* Archivos JS que deben importar el JSON */
const ARCHIVOS_JS = [
    "cheatsheets/js/cheatsheets.js",
    "cheatsheets/js/cheatsheet.js",
    "cheatsheets/js/cheatsheet-filtro.js",
    "cheatsheets/js/cheatsheet-detalle.js",
    "cheatsheets/js/cheatsheet-comando.js",
    "js/cheatsheets.js"
];


/* =========================================================
   CALCULAR RUTA RELATIVA
========================================================= */

function rutaRelativa(archivoJS) {
    /* Directorio donde está el JS */
    const dirJS = path.dirname(
        path.join(RAIZ, archivoJS)
    );

    /* Ruta absoluta del JSON destino */
    const rutaAbsJSON = path.join(RAIZ, JSON_DESTINO);

    /* Ruta relativa desde el JS hasta el JSON */
    let relativa = path.relative(dirJS, rutaAbsJSON);

    /* Normalizar barras para Windows → siempre / */
    relativa = relativa.replace(/\\/g, "/");

    /* Asegurar que empieza por ./ o ../ */
    if (!relativa.startsWith(".")) {
        relativa = "./" + relativa;
    }

    return relativa;
}


/* =========================================================
   ARREGLAR UN ARCHIVO
========================================================= */

function arreglarArchivo(archivoJS) {
    const rutaAbs = path.join(RAIZ, archivoJS);

    if (!fs.existsSync(rutaAbs)) {
        console.log(`⚠️  No existe: ${archivoJS}`);
        return { estado: "no-existe" };
    }

    const contenido = fs.readFileSync(rutaAbs, "utf-8");

    /* Nueva ruta correcta */

    const rutaNueva = rutaRelativa(archivoJS);

    /* Buscar cualquier línea de `import data from "..."` */

    const regexImport = /import\s+data\s+from\s+["']([^"']+)["'];?/;

    const match = contenido.match(regexImport);

    /* Nueva línea de import */

    const nuevaLinea = `import data from "${rutaNueva}";`;


    /* --- CASO 1: YA TIENE EL IMPORT CORRECTO --- */

    if (match && match[1] === rutaNueva) {
        console.log(`✅ Ya está bien: ${archivoJS} → "${rutaNueva}"`);
        return { estado: "ok" };
    }


    /* --- CASO 2: TIENE UN IMPORT INCORRECTO --- */

    if (match) {
        console.log(`🔧 Arreglando: ${archivoJS}`);
        console.log(`   Antes:  "${match[1]}"`);
        console.log(`   Ahora:  "${rutaNueva}"`);

        /* Guardar backup */

        fs.writeFileSync(`${rutaAbs}.bak`, contenido, "utf-8");

        const nuevoContenido = contenido.replace(regexImport, nuevaLinea);

        fs.writeFileSync(rutaAbs, nuevoContenido, "utf-8");

        return { estado: "arreglado" };
    }


    /* --- CASO 3: NO TIENE IMPORT, HAY QUE AÑADIRLO --- */

    console.log(`➕ Añadiendo import a: ${archivoJS}`);
    console.log(`   Línea:  "${nuevaLinea}"`);

    fs.writeFileSync(`${rutaAbs}.bak`, contenido, "utf-8");

    /* Insertar después del primer bloque de comentarios o al principio */

    const lineas = contenido.split("\n");

    /* Buscar primera línea que NO sea comentario ni vacía */
    let indexInsercion = 0;

    for (let i = 0; i < lineas.length; i++) {
        const l = lineas[i].trim();

        /* Saltar comentarios y líneas vacías */
        if (
            l === "" ||
            l.startsWith("//") ||
            l.startsWith("/*") ||
            l.startsWith("*") ||
            l.endsWith("*/")
        ) {
            continue;
        }

        indexInsercion = i;
        break;
    }

    /* Insertar la línea del import + línea vacía */

    lineas.splice(indexInsercion, 0, nuevaLinea, "");

    fs.writeFileSync(rutaAbs, lineas.join("\n"), "utf-8");

    return { estado: "añadido" };
}


/* =========================================================
   MAIN
========================================================= */

function main() {
    console.log("");
    console.log("=========================================");
    console.log("🔧 Arreglando imports del JSON");
    console.log("=========================================");
    console.log("");
    console.log(`JSON destino: ${JSON_DESTINO}`);
    console.log("");

    let arreglados = 0;
    let ok = 0;
    let añadidos = 0;
    let noExisten = 0;

    ARCHIVOS_JS.forEach((archivoJS) => {
        const resultado = arreglarArchivo(archivoJS);

        if (resultado.estado === "arreglado") arreglados++;
        if (resultado.estado === "ok") ok++;
        if (resultado.estado === "añadido") añadidos++;
        if (resultado.estado === "no-existe") noExisten++;
    });

    console.log("");
    console.log("=========================================");
    console.log("✅ Resumen");
    console.log("=========================================");
    console.log(`Correctos:        ${ok}`);
    console.log(`Arreglados:       ${arreglados}`);
    console.log(`Añadidos:         ${añadidos}`);
    console.log(`No existen:       ${noExisten}`);
    console.log("");
    console.log("Cada archivo modificado tiene un .bak");
    console.log("");
    console.log("Ahora:");
    console.log("  1. Reinicia Vite: Ctrl+C → npm run dev");
    console.log("  2. Recarga con Ctrl+Shift+R");
    console.log("");
}


main();