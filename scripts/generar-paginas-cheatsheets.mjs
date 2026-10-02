/* =========================================================
   GENERADOR COMPLETO DE PÁGINAS DE CHEATSHEETS
   Lee: data/cheatsheets.json
   Crea:
     cheatsheets/detalle/<categoria>/<subcategoria>.html
     cheatsheets/detalle/<categoria>/<subcategoria>/<comando>.html
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

const BASE_DETALLE = path.join(RAIZ, "cheatsheets", "detalle");


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
   PLANTILLAS
========================================================= */

/* Plantilla 1: página de subcategoría (recon.html, web.html…) */

function plantillaSubcategoria(categoria, subcategoria, slugCategoria) {
    const catEsc = categoria.replace(/"/g, "&quot;");
    const subEsc = subcategoria.replace(/"/g, "&quot;");

    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${subEsc} · ${catEsc} · Ángel García.">
    <title>${subEsc} · ${catEsc} | Ángel García</title>

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>

<body>

    <div id="navbar"></div>

    <main class="page-container">

        <section class="page-header">

            <a href="/cheatsheets/${slugCategoria}.html" class="back-link">
                ← Volver a ${catEsc}
            </a>

            <span class="section-tag">// cheatsheet · subcategoría</span>
            <h1 id="cheatsheet-title">${subEsc}</h1>
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


/* Plantilla 2: página de comando (nmap.html, ls.html…) */

function plantillaComando(categoria, subcategoria, comando, slugCategoria, slugSubcategoria) {
    const catEsc = categoria.replace(/"/g, "&quot;");
    const subEsc = subcategoria.replace(/"/g, "&quot;");
    const cmdEsc = comando.replace(/"/g, "&quot;");

    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${cmdEsc} · ${subEsc} · ${catEsc} · Ángel García.">
    <title>${cmdEsc} · ${subEsc} | Ángel García</title>

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>

<body>

    <div id="navbar"></div>

    <main class="page-container">

        <section class="page-header">

            <a href="/cheatsheets/detalle/${slugCategoria}/${slugSubcategoria}.html" class="back-link">
                ← Volver a ${subEsc}
            </a>

            <span class="section-tag">// cheatsheet · ${catEsc.toLowerCase()}</span>
            <h1 id="comando-titulo">${cmdEsc}</h1>
            <p id="comando-descripcion"></p>

        </section>

        <section class="cheatsheets-section">

            <div id="comando-detalle" class="cheatsheet-content">
                <p class="loading">Cargando comando...</p>
            </div>

            <!-- ============================================
                 CONTENIDO ADICIONAL
                 Añade aquí tus ejemplos, flags, notas…
            ============================================ -->

            <div class="comando-contenido">

                <!-- ↓↓↓ TU CONTENIDO AQUÍ ↓↓↓ -->



                <!-- ↑↑↑ TU CONTENIDO AQUÍ ↑↑↑ -->

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

    /* 1. Validar JSON */

    if (!fs.existsSync(JSON_PATH)) {
        console.error(`❌ No existe: ${JSON_PATH}`);
        process.exit(1);
    }

    const raw = fs.readFileSync(JSON_PATH, "utf-8");
    const data = JSON.parse(raw);

    const secciones = data.secciones || [];

    if (!secciones.length) {
        console.error("❌ El JSON no tiene 'secciones'.");
        process.exit(1);
    }


    /* 2. Contadores */

    let subcategoriasCreadas = 0;
    let comandosCreados = 0;
    let yaExistentes = 0;


    /* 3. Recorrer cada sección */

    secciones.forEach((sec) => {

        const categoria = sec.categoria || "Otros";
        const subcategoria = sec.titulo || "Sin título";

        const slugCategoria = slugify(categoria);
        const slugSubcategoria = slugify(subcategoria);

        /* -------------------------------------------
           A. Página de la subcategoría
           cheatsheets/detalle/<categoria>/<subcategoria>.html
        ------------------------------------------- */

        const carpetaCategoria = path.join(BASE_DETALLE, slugCategoria);

        if (!fs.existsSync(carpetaCategoria)) {
            fs.mkdirSync(carpetaCategoria, { recursive: true });
        }

        const archivoSubcategoria = path.join(
            carpetaCategoria,
            `${slugSubcategoria}.html`
        );

        if (!fs.existsSync(archivoSubcategoria)) {
            fs.writeFileSync(
                archivoSubcategoria,
                plantillaSubcategoria(categoria, subcategoria, slugCategoria),
                "utf-8"
            );
            subcategoriasCreadas++;
            console.log(`✅ ${slugCategoria}/${slugSubcategoria}.html`);
        } else {
            yaExistentes++;
        }


        /* -------------------------------------------
           B. Páginas de cada comando
           cheatsheets/detalle/<categoria>/<subcategoria>/<comando>.html
        ------------------------------------------- */

        const carpetaComandos = path.join(
            carpetaCategoria,
            slugSubcategoria
        );

        if (!fs.existsSync(carpetaComandos)) {
            fs.mkdirSync(carpetaComandos, { recursive: true });
        }

        (sec.comandos || []).forEach((cmd) => {

            const nombreComando = cmd.comando || "";

            if (!nombreComando) return;

            const slugComando = slugify(nombreComando) || "comando";

            const archivoComando = path.join(
                carpetaComandos,
                `${slugComando}.html`
            );

            if (!fs.existsSync(archivoComando)) {
                fs.writeFileSync(
                    archivoComando,
                    plantillaComando(
                        categoria,
                        subcategoria,
                        nombreComando,
                        slugCategoria,
                        slugSubcategoria
                    ),
                    "utf-8"
                );
                comandosCreados++;
            } else {
                yaExistentes++;
            }
        });
    });


    /* 4. Resumen */

    console.log("");
    console.log("=========================================");
    console.log("✅ Generación completada");
    console.log("=========================================");
    console.log(`Subcategorías creadas:  ${subcategoriasCreadas}`);
    console.log(`Comandos creados:       ${comandosCreados}`);
    console.log(`Ya existentes:          ${yaExistentes}`);
    console.log("=========================================");
    console.log("");
    console.log("Estructura:");
    console.log("  cheatsheets/detalle/<categoria>/<subcategoria>.html");
    console.log("  cheatsheets/detalle/<categoria>/<subcategoria>/<comando>.html");
}


main();