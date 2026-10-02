/* =========================================================
   MOVER A PUBLIC
   Mueve cheatsheets/js y data a public/ para que Vite
   los sirva correctamente.
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");


/* =========================================================
   MOVER CARPETA (recursivo)
========================================================= */

function moverCarpeta(origen, destino) {
    if (!fs.existsSync(origen)) {
        console.log(`⚠️  No existe: ${path.relative(RAIZ, origen)}`);
        return;
    }

    /* Crear carpeta destino */

    fs.mkdirSync(destino, { recursive: true });

    /* Recorrer y mover */

    fs.readdirSync(origen).forEach((nombre) => {
        const origenAbs = path.join(origen, nombre);
        const destinoAbs = path.join(destino, nombre);

        if (fs.statSync(origenAbs).isDirectory()) {
            moverCarpeta(origenAbs, destinoAbs);
        } else {
            fs.renameSync(origenAbs, destinoAbs);

            console.log(
                `✅ ${path.relative(RAIZ, origenAbs)} → ${path.relative(RAIZ, destinoAbs)}`
            );
        }
    });

    /* Borrar carpeta origen si queda vacía */

    if (fs.readdirSync(origen).length === 0) {
        fs.rmdirSync(origen);
    }
}


/* =========================================================
   MAIN
========================================================= */

console.log("");
console.log("=========================================");
console.log("📦 Moviendo archivos a public/");
console.log("=========================================");
console.log("");


/* 1. Mover cheatsheets/js → public/cheatsheets/js */

moverCarpeta(
    path.join(RAIZ, "cheatsheets", "js"),
    path.join(RAIZ, "public", "cheatsheets", "js")
);


/* 2. Mover data/cheatsheets.json → public/data/cheatsheets.json */

const jsonOrigen = path.join(RAIZ, "data", "cheatsheets.json");
const jsonDestino = path.join(RAIZ, "public", "data", "cheatsheets.json");

if (fs.existsSync(jsonOrigen)) {
    fs.mkdirSync(path.dirname(jsonDestino), { recursive: true });
    fs.renameSync(jsonOrigen, jsonDestino);

    console.log(`✅ data/cheatsheets.json → public/data/cheatsheets.json`);
} else {
    console.log(`⚠️  No existe: data/cheatsheets.json`);
}


console.log("");
console.log("=========================================");
console.log("✅ Movimiento completado");
console.log("=========================================");
console.log("");
console.log("Ahora:");
console.log("  1. Reinicia Vite: Ctrl+C → npm run dev");
console.log("  2. Recarga con Ctrl+Shift+R");
console.log("");