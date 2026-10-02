/* =========================================================
   GENERADOR DE PÁGINAS DE COMANDO
   Crea cheatsheets/detalle/<categoria>/<seccion>/<comando>.html
   para cada comando del cheatsheets.json
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

const OUTPUT_BASE = path.join(RAIZ, "cheatsheets", "detalle");


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

function plantillaHTML(categoria, seccion, comando, slugCategoria, slugSeccion) {
    /* Escapamos las comillas para el HTML */

    const categoriaEsc = categoria.replace(/"/g, "&quot;");
    const seccionEsc = seccion.replace(/"/g, "&quot;");
    const comandoEsc = comando.replace(/"/g, "&quot;");

    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${comandoEsc} · ${seccionEsc} · ${categoriaEsc} · Ángel García.">
    <title>${comandoEsc} · ${seccionEsc} | Ángel García</title>

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>

<body>

    <div id="navbar"></div>

    <main class="page-container">

        <section class="page-header">

            <a href="/cheatsheets/detalle/${slugCategoria}/${slugSeccion}.html" class="back-link">
                ← Volver a ${seccionEsc}
            </a>

            <span class="section-tag">// cheatsheet · ${categoriaEsc.toLowerCase()}</span>
            <h1 id="comando-titulo">${comandoEsc}</h1>
            <p id="comando-descripcion"></p>

        </section>

        <section class="cheatsheets-section">

            <div id="comando-detalle" class="comando-detalle">
                <p class="loading">Cargando información del comando...</p>
            </div>

            <!-- ============================================
                 CONTENIDO ADICIONAL
                 Aquí puedes escribir lo que quieras:
                 ejemplos, casos de uso, flags, notas...
            ============================================ -->

            <div class="comando-contenido">

                <!-- ↓↓↓ AÑADE TU CONTENIDO AQUÍ ↓↓↓ -->



                <!-- ↑↑↑ AÑADE TU CONTENIDO AQUÍ ↑↑↑ -->

            </div>

        </section>

    </main>

    <footer>
        <p>© <span id="current-year"></span> Ángel García</p>
    </footer>

    <script type="module" src="/js/navbar.js"></script>
    <script type="module" src="/js/cheatsheet-comando.js"></script>

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

    let totalComandos = 0;
    let creados = 0;
    let existentes = 0;

    secciones.forEach((sec) => {

        const categoria = sec.categoria || "Otros";
        const seccion = sec.titulo || "Sin título";

        const slugCategoria = slugify(categoria);
        const slugSeccion = slugify(seccion);

        /* Carpeta: cheatsheets/detalle/<categoria>/<seccion>/ */

        const carpetaComandos = path.join(
            OUTPUT_BASE,
            slugCategoria,
            slugSeccion
        );

        if (!fs.existsSync(carpetaComandos)) {
            fs.mkdirSync(carpetaComandos, { recursive: true });
        }

        (sec.comandos || []).forEach((cmd) => {

            const nombreComando = cmd.comando || "";

            if (!nombreComando) return;

            totalComandos++;

            const slugComando = slugify(nombreComando);

            /* Si el slug queda vacío, generamos uno con índice */

            const archivo = path.join(
                carpetaComandos,
                `${slugComando || "comando"}.html`
            );

            if (fs.existsSync(archivo)) {
                existentes++;
                return;
            }

            fs.writeFileSync(
                archivo,
                plantillaHTML(
                    categoria,
                    seccion,
                    nombreComando,
                    slugCategoria,
                    slugSeccion
                ),
                "utf-8"
            );

            creados++;
        });
    });


    /* Resumen */

    console.log("");
    console.log("=========================================");
    console.log("✅ Páginas de comando generadas");
    console.log("=========================================");
    console.log(`Secciones procesadas:   ${secciones.length}`);
    console.log(`Comandos totales:       ${totalComandos}`);
    console.log(`Páginas creadas:        ${creados}`);
    console.log(`Ya existentes:          ${existentes}`);
    console.log("=========================================");
    console.log("");
    console.log("Ruta: cheatsheets/detalle/<categoria>/<seccion>/<comando>.html");
}


main();