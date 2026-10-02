/* =========================================================
   FIX PORTFOLIO — Auditoría y reparación automática
   - Crea estructura de carpetas
   - Genera JSON servidos en public/data/cheatsheets/
   - Genera HTML base si faltan
   - Verifica rutas
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");


/* =========================================================
   LOG
========================================================= */

const LOG = {
    ok:    (t) => console.log(`✅ ${t}`),
    warn:  (t) => console.log(`⚠️  ${t}`),
    error: (t) => console.log(`❌ ${t}`),
    info:  (t) => console.log(`   ${t}`),
    title: (t) => {
        console.log("");
        console.log("=========================================");
        console.log(t);
        console.log("=========================================");
    }
};


/* =========================================================
   UTILIDADES
========================================================= */

function slugify(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function asegurarDir(ruta) {
    if (!fs.existsSync(ruta)) {
        fs.mkdirSync(ruta, { recursive: true });
        return true;
    }
    return false;
}

function escribirSiNoExiste(ruta, contenido) {
    if (fs.existsSync(ruta)) return false;
    asegurarDir(path.dirname(ruta));
    fs.writeFileSync(ruta, contenido, "utf-8");
    return true;
}

function escribirSiempre(ruta, contenido) {
    asegurarDir(path.dirname(ruta));
    fs.writeFileSync(ruta, contenido, "utf-8");
}


/* =========================================================
   RUTAS CLAVE
========================================================= */

const PATHS = {
    dataFuente: path.join(RAIZ, "data", "cheatsheets.json"),
    dataPublica: path.join(RAIZ, "public", "data", "cheatsheets"),
    cheatsheetsDir: path.join(RAIZ, "cheatsheets"),
    cheatsheetsJs: path.join(RAIZ, "cheatsheets", "js"),
    cheatsheetsCss: path.join(RAIZ, "cheatsheets", "css"),
    js: path.join(RAIZ, "js"),
    css: path.join(RAIZ, "css"),
    pages: path.join(RAIZ, "pages"),
    writeups: path.join(RAIZ, "writeups")
};


/* =========================================================
   PLANTILLAS
========================================================= */

const NAV = `
                <nav class="terminal-nav">
                    <a href="/">~/home</a>
                    <a href="/pages/stack.html" data-page="stack">~/stack</a>
                    <a href="/pages/proyectos.html" data-page="proyectos">~/proyectos</a>
                    <a href="/pages/tools.html" data-page="tools">~/tools</a>
                    <a href="/cheatsheets/index.html" data-page="cheatsheets">~/cheatsheets</a>
                    <a href="/writeups/writeups.html" data-page="writeups">~/writeups</a>
                    <a href="/pages/sobre-mi.html" data-page="sobre-mi">~/sobre-mi</a>
                </nav>
`;

const SUBNAV = `
                <div class="terminal-subnav">
                    <div class="terminal-lang">
                        <span class="active">ES</span> · <span>EN</span>
                    </div>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="terminal-account">account</a>
                </div>
`;

const TERMINAL_BAR = (ruta) => `
        <div class="terminal-bar">
            <div class="terminal-dots">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
            </div>
            <div class="terminal-path">root@angel:${ruta}</div>
            <div class="terminal-status">
                <span class="status-dot"></span>
                SYSTEM ONLINE
            </div>
        </div>
`;

const FOOTER = `
        <div class="term-footer">
            <span>© <span id="current-year"></span> Ángel García</span>
            <span>Portfolio técnico</span>
        </div>
`;


/* =========================================================
   1. ESTRUCTURA DE CARPETAS
========================================================= */

function crearEstructura() {
    LOG.title("1. Estructura de carpetas");

    const carpetas = [
        ["cheatsheets/", PATHS.cheatsheetsDir],
        ["cheatsheets/js/", PATHS.cheatsheetsJs],
        ["cheatsheets/css/", PATHS.cheatsheetsCss],
        ["js/", PATHS.js],
        ["css/", PATHS.css],
        ["pages/", PATHS.pages],
        ["writeups/", PATHS.writeups],
        ["public/", path.join(RAIZ, "public")],
        ["public/data/", path.join(RAIZ, "public", "data")],
        ["public/data/cheatsheets/", PATHS.dataPublica]
    ];

    carpetas.forEach(([nombre, ruta]) => {
        if (asegurarDir(ruta)) LOG.ok(`Creada: ${nombre}`);
        else LOG.info(`Ya existe: ${nombre}`);
    });
}


/* =========================================================
   2. LEER JSON FUENTE
========================================================= */

function leerFuente() {
    LOG.title("2. Leyendo cheatsheets.json");

    if (!fs.existsSync(PATHS.dataFuente)) {
        LOG.error(`No existe: data/cheatsheets.json`);
        process.exit(1);
    }

    const raw = fs.readFileSync(PATHS.dataFuente, "utf-8");

    try {
        const data = JSON.parse(raw);
        LOG.ok(`JSON válido · ${data.secciones?.length || 0} secciones`);
        return data;
    } catch (e) {
        LOG.error(`JSON inválido: ${e.message}`);
        process.exit(1);
    }
}


/* =========================================================
   3. GENERAR JSON EN public/data/cheatsheets/
========================================================= */

function generarJSON(data) {
    LOG.title("3. Generando JSON en public/data/cheatsheets/");

    const secciones = data.secciones || [];

    /* Agrupar por categoría */

    const porCategoria = {};

    secciones.forEach((sec) => {
        const cat = sec.categoria || "Otros";
        if (!porCategoria[cat]) porCategoria[cat] = [];
        porCategoria[cat].push(sec);
    });

    /* -------- 3.1. _index.json -------- */

    const indice = {
        categorias: Object.entries(porCategoria).map(([nombre, subs]) => ({
            slug: slugify(nombre),
            nombre,
            descripcion: "",
            subcategorias: subs.length,
            comandos: subs.reduce((a, s) => a + (s.comandos || []).length, 0)
        }))
    };

    escribirSiempre(
        path.join(PATHS.dataPublica, "_index.json"),
        JSON.stringify(indice, null, 4)
    );
    LOG.ok("_index.json");


    /* -------- 3.2. <categoria>.json -------- */

    Object.entries(porCategoria).forEach(([categoria, subs]) => {

        const slugCat = slugify(categoria);

        const jsonCat = {
            categoria,
            subcategorias: subs.map((s) => ({
                slug: slugify(s.titulo),
                titulo: s.titulo,
                total: (s.comandos || []).length
            }))
        };

        escribirSiempre(
            path.join(PATHS.dataPublica, `${slugCat}.json`),
            JSON.stringify(jsonCat, null, 4)
        );
        LOG.ok(`${slugCat}.json`);


        /* -------- 3.3. <categoria>/<subcategoria>.json -------- */

        subs.forEach((sub) => {

            const slugSub = slugify(sub.titulo);

            const jsonSub = {
                categoria,
                subcategoria: sub.titulo,
                comandos: (sub.comandos || []).map((c) => ({
                    slug: slugify(c.comando),
                    comando: c.comando,
                    descripcion: c.descripcion || ""
                }))
            };

            escribirSiempre(
                path.join(PATHS.dataPublica, slugCat, `${slugSub}.json`),
                JSON.stringify(jsonSub, null, 4)
            );


            /* -------- 3.4. <categoria>/<subcategoria>/<comando>.json -------- */

            (sub.comandos || []).forEach((cmd) => {

                const slugCmd = slugify(cmd.comando);

                const jsonCmd = {
                    comando: cmd.comando,
                    descripcion: cmd.descripcion || "",
                    sintaxis: "",
                    ejemplos: [],
                    flags: [],
                    notas: ""
                };

                escribirSiempre(
                    path.join(PATHS.dataPublica, slugCat, slugSub, `${slugCmd}.json`),
                    JSON.stringify(jsonCmd, null, 4)
                );
            });

            LOG.ok(`${slugCat}/${slugSub}.json + comandos`);
        });
    });

    LOG.info(`Total: ${contarArchivos(PATHS.dataPublica)} archivos`);
}


/* =========================================================
   UTIL: CONTAR ARCHIVOS
========================================================= */

function contarArchivos(dir) {
    if (!fs.existsSync(dir)) return 0;

    let total = 0;

    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        const ruta = path.join(dir, e.name);
        if (e.isDirectory()) total += contarArchivos(ruta);
        else total++;
    });

    return total;
}


/* =========================================================
   4. VERIFICAR / CREAR HTML DE CHEATSHEETS
========================================================= */

function plantillaCheatsheetIndex() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cheatsheets · Ángel García</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>
<body>
    <div class="terminal-wrapper">
${TERMINAL_BAR("~/cheatsheets")}
        <div class="terminal-body">
            <header class="terminal-header">
                <h1 class="terminal-logo">Ángel García<span class="terminal-logo-cursor">▌</span></h1>
${NAV}
${SUBNAV}
            </header>
            <div class="terminal-command">
                <span class="prompt">root@angel</span><span class="sep">:</span><span class="path">~/cheatsheets</span><span class="sep">$</span> <span class="cmd">ls -la</span>
            </div>
            <div id="cheatsheets-grid" class="cheatsheet-content">
                <p class="loading">Cargando cheatsheets...</p>
            </div>
        </div>
${FOOTER}
    </div>
    <script type="module" src="/js/cheatsheets.js"></script>
    <script>document.querySelector("#current-year").textContent = new Date().getFullYear();</script>
</body>
</html>
`;
}

function plantillaCategoria(categoria, slugCat) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${categoria} · Cheatsheet | Ángel García</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>
<body>
    <div class="terminal-wrapper">
${TERMINAL_BAR(`~/cheatsheets/${slugCat}`)}
        <div class="terminal-body">
            <header class="terminal-header">
                <h1 class="terminal-logo">Ángel García<span class="terminal-logo-cursor">▌</span></h1>
${NAV}
${SUBNAV}
            </header>
            <a href="/cheatsheets/index.html" class="back-link">← back to cheatsheets</a>
            <div class="terminal-command">
                <span class="prompt">root@angel</span><span class="sep">:</span><span class="path">~/cheatsheets/${slugCat}</span><span class="sep">$</span> <span class="cmd">cat ${slugCat}.md</span>
            </div>
            <h1 id="cheatsheet-title">${categoria}</h1>
            <p id="cheatsheet-subtitle"></p>
            <div id="cheatsheet-filters" class="cheatsheet-filters"></div>
            <div id="cheatsheet-detail" class="cheatsheet-content">
                <p class="loading">Cargando comandos...</p>
            </div>
        </div>
${FOOTER}
    </div>
    <script type="module" src="/js/cheatsheet.js"></script>
    <script>document.querySelector("#current-year").textContent = new Date().getFullYear();</script>
</body>
</html>
`;
}

function generarHTML() {
    LOG.title("4. Generando HTML de cheatsheets");

    /* Index */

    if (escribirSiNoExiste(
        path.join(PATHS.cheatsheetsDir, "index.html"),
        plantillaCheatsheetIndex()
    )) {
        LOG.ok("index.html creado");
    } else {
        LOG.info("index.html ya existe (no se sobrescribe)");
    }

    /* Categorías */

    const data = JSON.parse(
        fs.readFileSync(PATHS.dataFuente, "utf-8")
    );

    const categorias = new Set(
        (data.secciones || []).map((s) => s.categoria || "Otros")
    );

    categorias.forEach((cat) => {
        const slugCat = slugify(cat);
        const ruta = path.join(PATHS.cheatsheetsDir, `${slugCat}.html`);

        if (escribirSiNoExiste(ruta, plantillaCategoria(cat, slugCat))) {
            LOG.ok(`${slugCat}.html creado`);
        } else {
            LOG.info(`${slugCat}.html ya existe`);
        }
    });
}


/* =========================================================
   5. VERIFICAR RUTAS DE LOS JS
========================================================= */

function verificarJS() {
    LOG.title("5. Verificando scripts JS");

    const requeridos = [
        ["js/cheatsheets.js", path.join(PATHS.js, "cheatsheets.js")],
        ["js/cheatsheet.js", path.join(PATHS.js, "cheatsheet.js")],
        ["js/cheatsheet-filtro.js", path.join(PATHS.js, "cheatsheet-filtro.js")],
        ["js/cheatsheet-comando.js", path.join(PATHS.js, "cheatsheet-comando.js")],
        ["js/stack.js", path.join(PATHS.js, "stack.js")],
        ["js/app.js", path.join(PATHS.js, "app.js")]
    ];

    requeridos.forEach(([nombre, ruta]) => {
        if (fs.existsSync(ruta)) LOG.ok(nombre);
        else LOG.warn(`FALTA: ${nombre}`);
    });
}


/* =========================================================
   6. VERIFICAR CSS
========================================================= */

function verificarCSS() {
    LOG.title("6. Verificando CSS");

    const requeridos = [
        ["styles.css", path.join(RAIZ, "styles.css")],
        ["css/cheatsheets.css", path.join(PATHS.css, "cheatsheets.css")],
        ["css/stack.css", path.join(PATHS.css, "stack.css")]
    ];

    requeridos.forEach(([nombre, ruta]) => {
        if (fs.existsSync(ruta)) LOG.ok(nombre);
        else LOG.warn(`FALTA: ${nombre}`);
    });
}


/* =========================================================
   7. INSTRUCCIONES FINALES
========================================================= */

function resumen() {
    LOG.title("✅ Reparación completada");

    console.log("Ahora:");

    console.log("");
    console.log("1. Reinicia Vite:");
    console.log("   Ctrl+C  →  npm run dev");

    console.log("");
    console.log("2. Recarga el navegador con Ctrl+Shift+R");

    console.log("");
    console.log("3. Comprueba las rutas:");
    console.log("   http://localhost:5173/data/cheatsheets/_index.json");
    console.log("   http://localhost:5173/data/cheatsheets/git.json");
    console.log("   http://localhost:5173/cheatsheets/index.html");
    console.log("   http://localhost:5173/cheatsheets/git.html");

    console.log("");
    console.log("Si algo sigue fallando → F12 → Console → pásame el error literal.");
    console.log("");
}


/* =========================================================
   MAIN
========================================================= */

function main() {
    console.log("");
    console.log("╔═══════════════════════════════════════╗");
    console.log("║  FIX PORTFOLIO — Reparación completa  ║");
    console.log("╚═══════════════════════════════════════╝");

    crearEstructura();
    const data = leerFuente();
    generarJSON(data);
    generarHTML();
    verificarJS();
    verificarCSS();
    resumen();
}

main();