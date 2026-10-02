/* =========================================================
   REEMPLAZAR — Búsqueda y sustitución en archivos
   Uso:
     node scripts/reemplazar.mjs

   Edita las variables BUSCAR y REEMPLAZAR al principio del
   archivo antes de ejecutarlo.
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");


/* =========================================================
   ⚙️  CONFIGURACIÓN  —  EDITA ESTAS VARIABLES
========================================================= */

/* Texto a buscar (puede ser una palabra, una frase, una ruta…) */

const BUSCAR = "Ángel García";

/* Texto por el que reemplazar */

const REEMPLAZAR = "Impostor Gadget";

/* Carpetas y archivos donde buscar
   Se recorren recursivamente. */

const RUTAS = [
    "cheatsheets",
    "pages",
    "writeups",
    "js",
    "css",
    "data",
    "index.html",
    "styles.css"
];

/* Extensiones de archivo a procesar */

const EXTENSIONES = [
    ".html",
    ".js",
    ".mjs",
    ".css",
    ".json"
];

/* ¿Guardar backup .bak del original? */

const GUARDAR_BACKUP = true;

/* ¿Sensible a mayúsculas/minúsculas? */

const CASE_SENSITIVE = false;


/* =========================================================
   HELPERS
========================================================= */

function log(msg) {
    console.log(msg);
}

function esArchivoValido(nombre) {
    return EXTENSIONES.some((ext) => nombre.endsWith(ext));
}

function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function crearRegex() {
    const flags = CASE_SENSITIVE ? "g" : "gi";
    return new RegExp(escaparRegex(BUSCAR), flags);
}


/* =========================================================
   RECORRER CARPETAS
========================================================= */

function recorrerRuta(rutaAbs, callback) {
    if (!fs.existsSync(rutaAbs)) return;

    const stat = fs.statSync(rutaAbs);

    /* Si es archivo → procesar */

    if (stat.isFile()) {
        if (esArchivoValido(rutaAbs)) callback(rutaAbs);
        return;
    }

    /* Si es carpeta → recorrer */

    fs.readdirSync(rutaAbs, { withFileTypes: true }).forEach((e) => {
        const ruta = path.join(rutaAbs, e.name);

        if (e.isDirectory()) {
            /* Ignorar carpetas típicas */
            if (
                e.name === "node_modules" ||
                e.name === "dist" ||
                e.name === ".git" ||
                e.name === ".vite"
            ) return;

            recorrerRuta(ruta, callback);
        } else if (e.isFile()) {
            if (esArchivoValido(e.name)) callback(ruta);
        }
    });
}


/* =========================================================
   PROCESAR UN ARCHIVO
========================================================= */

let totalArchivos = 0;
let totalReemplazos = 0;

function procesarArchivo(rutaAbs) {
    const contenido = fs.readFileSync(rutaAbs, "utf-8");
    const regex = crearRegex();

    const coincidencias = contenido.match(regex);

    if (!coincidencias) return;

    totalArchivos++;
    totalReemplazos += coincidencias.length;

    const nuevo = contenido.replace(regex, REEMPLAZAR);

    if (GUARDAR_BACKUP) {
        fs.writeFileSync(`${rutaAbs}.bak`, contenido, "utf-8");
    }

    fs.writeFileSync(rutaAbs, nuevo, "utf-8");

    const relativa = path.relative(RAIZ, rutaAbs);

    log(`✅ ${relativa}  (${coincidencias.length} reemplazo${coincidencias.length > 1 ? "s" : ""})`);
}


/* =========================================================
   MAIN
========================================================= */

function main() {
    log("");
    log("=========================================");
    log("🔍 Reemplazando texto en el proyecto");
    log("=========================================");
    log("");
    log(`Buscar:       "${BUSCAR}"`);
    log(`Reemplazar:   "${REEMPLAZAR}"`);
    log(`Sensible:     ${CASE_SENSITIVE ? "SÍ" : "NO"}`);
    log(`Extensiones:  ${EXTENSIONES.join(", ")}`);
    log(`Backup .bak:  ${GUARDAR_BACKUP ? "SÍ" : "NO"}`);
    log("");

    /* Recorrer cada ruta */

    RUTAS.forEach((r) => {
        recorrerRuta(path.join(RAIZ, r), procesarArchivo);
    });

    /* Resumen */

    log("");
    log("=========================================");
    log("✅ COMPLETADO");
    log("=========================================");
    log(`Archivos modificados:  ${totalArchivos}`);
    log(`Reemplazos totales:    ${totalReemplazos}`);
    log("");
}


main();