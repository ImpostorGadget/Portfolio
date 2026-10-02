/* =========================================================
   ACTUALIZAR RUTA DEL SCRIPT EN LOS HTMLs DE DETALLE
   Solo cambia si NO coincide exactamente con la ruta destino.
   Deja la línea final exactamente como:
     <script type="module" src="/cheatsheets/js/cheatsheet-detalle.js"></script>
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


/* =========================================================
   RUTAS
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAIZ = path.resolve(__dirname, "..");

const CARPETA_DETALLE = path.join(RAIZ, "cheatsheets", "detalle");


/* =========================================================
   LÍNEA DESTINO (EXACTA)
========================================================= */

const LINEA_DESTINO =
    `<script type="module" src="/cheatsheets/js/cheatsheet-detalle.js"></script>`;


/* =========================================================
   RECORRER CARPETA RECURSIVAMENTE
========================================================= */

function recorrerCarpeta(carpeta, callback) {
    if (!fs.existsSync(carpeta)) return;

    const entradas = fs.readdirSync(carpeta, { withFileTypes: true });

    entradas.forEach((entrada) => {
        const rutaCompleta = path.join(carpeta, entrada.name);

        if (entrada.isDirectory()) {
            recorrerCarpeta(rutaCompleta, callback);
        } else if (entrada.isFile() && entrada.name.endsWith(".html")) {
            callback(rutaCompleta);
        }
    });
}


/* =========================================================
   MAIN
========================================================= */

function main() {

    if (!fs.existsSync(CARPETA_DETALLE)) {
        console.error(`❌ No existe la carpeta: ${CARPETA_DETALLE}`);
        process.exit(1);
    }

    let total = 0;
    let cambiados = 0;
    let yaOk = 0;

    recorrerCarpeta(CARPETA_DETALLE, (archivo) => {

        total++;

        const contenido = fs.readFileSync(archivo, "utf-8");

        /* -----------------------------------------
           Comprobar si YA tiene la línea exacta
           (buscando cualquier variante de la línea)
        ----------------------------------------- */

        const regexLinea =
            /<script\s+type="module"\s+src="[^"]*cheatsheet-detalle\.js"\s*><\/script>/g;

        const matches = contenido.match(regexLinea);

        if (matches && matches.length === 1 && matches[0] === LINEA_DESTINO) {
            yaOk++;
            return;
        }

        /* -----------------------------------------
           Reemplazar cualquier variante por la línea exacta
        ----------------------------------------- */

        const nuevo = contenido.replace(regexLinea, LINEA_DESTINO);

        /* Si no había ninguna línea, saltar */

        if (nuevo === contenido) {
            console.warn(
                `⚠️  Sin línea de cheatsheet-detalle.js: ${path.relative(RAIZ, archivo)}`
            );
            return;
        }

        fs.writeFileSync(archivo, nuevo, "utf-8");

        cambiados++;

        console.log(`✅ Actualizado: ${path.relative(RAIZ, archivo)}`);
    });


    /* Resumen */

    console.log("");
    console.log("=========================================");
    console.log("✅ Comprobación completada");
    console.log("=========================================");
    console.log(`Total HTMLs escaneados:     ${total}`);
    console.log(`Actualizados:               ${cambiados}`);
    console.log(`Ya tenían la ruta exacta:   ${yaOk}`);
    console.log("=========================================");
}


main();