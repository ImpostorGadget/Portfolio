/* =========================================================
   SOLUCIÓN FINAL
   1. Mueve public/cheatsheets/js → cheatsheets/js
   2. Mueve public/data → data
   3. Cambia todos los <script> de los HTML a rutas relativas
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");


/* =========================================================
   MOVER CARPETA
========================================================= */

function moverCarpeta(origen, destino) {
    if (!fs.existsSync(origen)) {
        console.log(`⏭️  No existe: ${path.relative(RAIZ, origen)}`);
        return;
    }

    fs.mkdirSync(destino, { recursive: true });

    fs.readdirSync(origen).forEach((nombre) => {
        const o = path.join(origen, nombre);
        const d = path.join(destino, nombre);

        if (fs.statSync(o).isDirectory()) {
            moverCarpeta(o, d);
        } else {
            fs.renameSync(o, d);
            console.log(`✅ ${path.relative(RAIZ, o)} → ${path.relative(RAIZ, d)}`);
        }
    });

    if (fs.readdirSync(origen).length === 0) {
        fs.rmdirSync(origen);
    }
}


/* =========================================================
   RECORRER HTML
========================================================= */

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


/* =========================================================
   MAIN
========================================================= */

console.log("");
console.log("=========================================");
console.log("📦 Moviendo JS y JSON fuera de public/");
console.log("=========================================");
console.log("");


/* 1. Mover public/cheatsheets/js → cheatsheets/js */

moverCarpeta(
    path.join(RAIZ, "public", "cheatsheets", "js"),
    path.join(RAIZ, "cheatsheets", "js")
);


/* 2. Mover public/data → data */

moverCarpeta(
    path.join(RAIZ, "public", "data"),
    path.join(RAIZ, "data")
);


/* 3. Arreglar los <script> */

console.log("");
console.log("=========================================");
console.log("🔧 Arreglando rutas de <script>");
console.log("=========================================");
console.log("");

const CHEATSHEETS_DIR = path.join(RAIZ, "cheatsheets");
const archivos = recorrerHTML(CHEATSHEETS_DIR);

let modificados = 0;

archivos.forEach((rutaAbs) => {
    const relativa = path.relative(RAIZ, rutaAbs);

    /* Cuántos niveles subir hasta "cheatsheets/" */

    const partes = path.dirname(relativa).split(path.sep);
    const profundidad = partes.length - 1;

    const prefijo = profundidad === 0 ? "./" : "../".repeat(profundidad);

    let contenido = fs.readFileSync(rutaAbs, "utf-8");
    const original = contenido;

    /* Cualquier ruta hacia cheatsheet*.js → relativa correcta */

    contenido = contenido.replace(
        /src="[^"]*\/cheatsheets\/js\/([^"]+)"/g,
        `src="${prefijo}js/$1"`
    );

    contenido = contenido.replace(
        /src="\.?\.?\/?cheatsheets\/js\/([^"]+)"/g,
        `src="${prefijo}js/$1"`
    );

    if (contenido !== original) {
        fs.writeFileSync(rutaAbs, contenido, "utf-8");
        console.log(`✅ ${relativa}  →  ${prefijo}js/...`);
        modificados++;
    }
});


/* Resumen */

console.log("");
console.log("=========================================");
console.log("✅ Todo listo");
console.log("=========================================");
console.log(`HTMLs con <script> actualizado: ${modificados}`);
console.log("");
console.log("Ahora:");
console.log("  npm run dev    (probar)");
console.log("  npm run build  (debe funcionar)");
console.log("");