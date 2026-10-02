/* =========================================================
   GENERADOR DE PÁGINAS DE FILTRO — CYBERSECURITY
   Lee data/cheatsheets.json y crea:
     cheatsheets/detalle/cybersecurity/<subcategoria>.html
   para cada subcategoría de la categoría "Cybersecurity".
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

const OUTPUT_DIR = path.join(
    RAIZ,
    "cheatsheets",
    "detalle",
    "cybersecurity"
);


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
   PLANTILLA HTML DE FILTRO
========================================================= */

function plantillaFiltro(subcategoria, slugSubcategoria) {
    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${subcategoria} · Cybersecurity · Ángel García.">
    <title>${subcategoria} · Cybersecurity | Ángel García</title>

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>

<body>

    <div id="navbar"></div>

    <main class="page-container">

        <section class="page-header">

            <a href="/cheatsheets/cybersecurity.html" class="back-link">
                ← Volver a Cybersecurity
            </a>

            <span class="section-tag">// cheatsheet · filtro</span>
            <h1 id="cheatsheet-title">${subcategoria}</h1>
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
    <script type="module" src="/cheatsheets/js/cheatsheet-filtro.js"></script>

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

    if (!fs.existsSync(JSON_PATH)) {
        console.error(`❌ No existe: ${JSON_PATH}`);
        process.exit(1);
    }

    const raw = fs.readFileSync(JSON_PATH, "utf-8");
    const data = JSON.parse(raw);

    const secciones = data.secciones || [];

    /* Filtrar solo las secciones de Cybersecurity */

    const cyber = secciones.filter(
        (s) => slugify(s.categoria) === "cybersecurity"
    );

    if (!cyber.length) {
        console.error("❌ No hay secciones de Cybersecurity en el JSON.");
        process.exit(1);
    }

    /* Crear carpeta */

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`📁 Creada: cheatsheets/detalle/cybersecurity/`);
    }

    /* Crear un HTML por cada subcategoría */

    let creados = 0;
    let existentes = 0;

    cyber.forEach((sec) => {

        const titulo = sec.titulo || "Sin título";
        const slug = slugify(titulo);

        const archivo = path.join(OUTPUT_DIR, `${slug}.html`);

        if (fs.existsSync(archivo)) {
            existentes++;
            return;
        }

        fs.writeFileSync(
            archivo,
            plantillaFiltro(titulo, slug),
            "utf-8"
        );

        creados++;

        console.log(`✅ ${slug}.html → ${titulo}`);
    });

    /* Resumen */

    console.log("");
    console.log("=========================================");
    console.log("✅ Filtros de Cybersecurity generados");
    console.log("=========================================");
    console.log(`Total subcategorías: ${cyber.length}`);
    console.log(`Archivos creados:    ${creados}`);
    console.log(`Ya existentes:       ${existentes}`);
    console.log("=========================================");
    console.log("");
    console.log("Disponibles:");
    cyber.forEach((sec) => {
        console.log(`  /cheatsheets/detalle/cybersecurity/${slugify(sec.titulo)}.html`);
    });
}


main();