/* =========================================================
   GENERADOR DE PÁGINAS DE DETALLE
   Lee data/cheatsheets.json y crea:
     cheatsheets/detalle/<categoria>/<seccion>.html
   para cada subcategoría del JSON.
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

const JSON_PATH = path.join(RAIZ, "data", "cheatsheets.json");

const OUTPUT_DIR = path.join(RAIZ, "cheatsheets", "detalle");


/* =========================================================
   SLUGIFY
========================================================= */

function slugify(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


/* =========================================================
   PLANTILLA HTML
========================================================= */

function plantillaHTML(categoria, seccion, slugCategoria) {
    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Detalle de ${seccion} · ${categoria} · Ángel García.">
    <title>${seccion} · ${categoria} · Cheatsheet | Ángel García</title>

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>

<body>

    <div id="navbar"></div>

    <main class="page-container">

        <section class="page-header">

            <a href="/cheatsheets/${slugCategoria}.html" class="back-link">
                ← Volver a ${categoria}
            </a>

            <span class="section-tag">// cheatsheet · detalle</span>
            <h1 id="cheatsheet-title">${seccion}</h1>
            <p id="cheatsheet-subtitle"></p>

        </section>

        <section class="cheatsheets-section">
            <div id="cheatsheet-detail" class="cheatsheet-content">
                <p class="loading">Cargando comandos...</p>
            </div>
        </section>

    </main>

    <footer>
        <p>© <span id="current-year"></span> Ángel García</p>
    </footer>

    <script type="module" src="/js/navbar.js"></script>
    <script type="module" src="/js/cheatsheet-detalle.js"></script>

    <script>
        document.querySelector("#current-year").textContent =
            new Date().getFullYear();
    </script>

</body>

</html>
`;
}


/* =========================================================
   MAIN
========================================================= */

function main() {

    /* 1. Comprobar que existe el JSON */

    if (!fs.existsSync(JSON_PATH)) {
        console.error(`❌ No se encontró: ${JSON_PATH}`);
        process.exit(1);
    }


    /* 2. Leer JSON */

    const raw = fs.readFileSync(JSON_PATH, "utf-8");
    const data = JSON.parse(raw);

    const secciones = data.secciones || [];

    if (!Array.isArray(secciones) || !secciones.length) {
        console.error("❌ El JSON no tiene 'secciones'.");
        process.exit(1);
    }


    /* 3. Crear carpeta base */

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`📁 Creada: cheatsheets/detalle/`);
    }


    /* 4. Generar HTMLs */

    let creados = 0;
    let existentes = 0;
    const categoriasCreadas = new Set();

    secciones.forEach((sec) => {

        const categoria = sec.categoria || "Otros";
        const titulo = sec.titulo || "Sin título";

        const slugCategoria = slugify(categoria);
        const slugSeccion = slugify(titulo);

        /* Carpeta de la categoría */

        const carpetaCategoria = path.join(OUTPUT_DIR, slugCategoria);

        if (!fs.existsSync(carpetaCategoria)) {
            fs.mkdirSync(carpetaCategoria, { recursive: true });

            if (!categoriasCreadas.has(slugCategoria)) {
                categoriasCreadas.add(slugCategoria);
                console.log(`📁 cheatsheets/detalle/${slugCategoria}/`);
            }
        }

        /* Archivo HTML */

        const archivoHTML = path.join(
            carpetaCategoria,
            `${slugSeccion}.html`
        );

        if (fs.existsSync(archivoHTML)) {
            existentes++;
            return;
        }

        fs.writeFileSync(
            archivoHTML,
            plantillaHTML(categoria, titulo, slugCategoria),
            "utf-8"
        );

        creados++;
    });


    /* 5. Resumen */

    console.log("");
    console.log("=========================================");
    console.log("✅ Generación completada");
    console.log("=========================================");
    console.log(`Categorías procesadas: ${categoriasCreadas.size}`);
    console.log(`Archivos creados:      ${creados}`);
    console.log(`Archivos ya existentes: ${existentes}`);
    console.log("");
    console.log("Ruta de salida: cheatsheets/detalle/");
    console.log("=========================================");
}


main();