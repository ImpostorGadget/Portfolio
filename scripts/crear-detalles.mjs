/* =========================================================
   CREAR LOS index.html DE DETALLE DE CADA CHEATSHEET
   - Crea la carpeta y el index.html si NO existen.
   - Nunca sobrescribe un index.html que ya tenga contenido.
   - Estructura generada:
       cheatsheets/detalle/<categoria>/<subcategoria>/<item>/index.html
   Uso:
       node scripts/crear-detalles.js
       node scripts/crear-detalles.js --dry-run   (solo muestra, no escribe)
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

const DRY_RUN = process.argv.includes("--dry-run");


/* =========================================================
   LÍNEA DEL SCRIPT (EXACTA)
========================================================= */

const LINEA_SCRIPT =
    `<script type="module" src="/cheatsheets/js/cheatsheet-detalle.js"></script>`;


/* =========================================================
   ESTRUCTURA DE CHEATSHEETS
   Categoría > Subcategoría > [items]
   Añade aquí lo que quieras que se cree.
========================================================= */

const ESTRUCTURA = {
    "Linux": {
        "Navegación": ["ls", "cd", "pwd", "tree"],
        "Archivos": ["cp", "mv", "rm", "touch"]
    },
    "Git": {
        "Básico": ["init", "add", "commit", "status"]
    }
};


/* =========================================================
   PLANTILLA HTML
   Ajusta aquí el <head>, el layout, etc. para que coincida
   con el de tus páginas de detalle actuales.
========================================================= */

function plantilla({ categoria, subcategoria, item }) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${item} · ${subcategoria} · ${categoria}</title>

    <link rel="stylesheet" href="/cheatsheets/css/cheatsheet-detalle.css">
</head>
<body data-categoria="${categoria}" data-subcategoria="${subcategoria}" data-item="${item}">

    <main class="detalle">

        <nav class="detalle__breadcrumb">
            <a href="/cheatsheets/">Cheatsheets</a> &gt;
            <span>${categoria}</span> &gt;
            <span>${subcategoria}</span> &gt;
            <span>${item}</span>
        </nav>

        <h1>${item}</h1>

        <!-- ================= CONTENIDO ================= -->

        <section>
            <p>TODO: añadir contenido.</p>
        </section>

        <!-- ============================================== -->

    </main>

    ${LINEA_SCRIPT}
</body>
</html>
`;
}


/* =========================================================
   UTILIDADES
========================================================= */

/** "Navegación Básica" -> "navegacion-basica" */
function slug(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


/* =========================================================
   MAIN
========================================================= */

function main() {

    let total = 0;
    let creados = 0;
    let existentes = 0;

    if (DRY_RUN) console.log("🔎 Modo simulación (--dry-run): no se escribe nada\n");

    for (const [categoria, subcategorias] of Object.entries(ESTRUCTURA)) {
        for (const [subcategoria, items] of Object.entries(subcategorias)) {
            for (const item of items) {

                total++;

                const carpeta = path.join(
                    CARPETA_DETALLE,
                    slug(categoria),
                    slug(subcategoria),
                    slug(item)
                );

                const archivo = path.join(carpeta, "index.html");
                const relativo = path.relative(RAIZ, archivo);

                /* Si ya existe, NO tocarlo (puede tener contenido) */

                if (fs.existsSync(archivo)) {
                    existentes++;
                    continue;
                }

                if (!DRY_RUN) {
                    fs.mkdirSync(carpeta, { recursive: true });
                    fs.writeFileSync(
                        archivo,
                        plantilla({ categoria, subcategoria, item }),
                        "utf-8"
                    );
                }

                creados++;
                console.log(`✅ Creado: ${relativo}`);
            }
        }
    }


    /* Resumen */

    console.log("");
    console.log("=========================================");
    console.log("✅ Proceso completado");
    console.log("=========================================");
    console.log(`Total cheatsheets en la estructura: ${total}`);
    console.log(`Creados:                            ${creados}`);
    console.log(`Ya existían (no tocados):           ${existentes}`);
    console.log("=========================================");
}


main();