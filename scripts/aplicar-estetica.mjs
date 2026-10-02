/* =========================================================
   APLICAR ESTÉTICA TERMINAL A TODO EL PORTFOLIO
   Recorre todos los .html y los envuelve en el wrapper
   terminal, añade el header y limpia scripts antiguos.
========================================================= */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");


/* =========================================================
   CONFIGURACIÓN POR PÁGINA
   Ajusta aquí la ruta y el comando de cada HTML
========================================================= */

const CONFIG = {
    "index.html": {
        ruta: "~/home",
        cmd: "whoami",
        activo: "inicio"
    },
    "pages/stack.html": {
        ruta: "~/stack",
        cmd: "cat stack.log",
        activo: "stack"
    },
    "pages/proyectos.html": {
        ruta: "~/proyectos",
        cmd: "ls -la",
        activo: "proyectos"
    },
    "pages/tools.html": {
        ruta: "~/tools",
        cmd: "ls tools/",
        activo: "tools"
    },
    "pages/sobre-mi.html": {
        ruta: "~/sobre-mi",
        cmd: "cat about.md",
        activo: "sobre-mi"
    },
    "cheatsheets/index.html": {
        ruta: "~/cheatsheets",
        cmd: "ls -la",
        activo: "cheatsheets"
    },
    "writeups/writeups.html": {
        ruta: "~/writeups",
        cmd: "ls -la",
        activo: "writeups"
    }
};

/* Las categorías de cheatsheets siguen un patrón */
const CATEGORIAS_CHEATSHEET = [
    "git",
    "linux",
    "javascript",
    "php",
    "sysadmin",
    "cybersecurity"
];


/* =========================================================
   FRAGMENTOS COMUNES
========================================================= */

const NAV_ITEMS = [
    { href: "/",              label: "~/home",       activo: "inicio" },
    { href: "/pages/stack.html",     label: "~/stack",      activo: "stack" },
    { href: "/pages/proyectos.html", label: "~/proyectos",  activo: "proyectos" },
    { href: "/pages/tools.html",     label: "~/tools",      activo: "tools" },
    { href: "/cheatsheets/index.html", label: "~/cheatsheets", activo: "cheatsheets" },
    { href: "/writeups/writeups.html", label: "~/writeups",   activo: "writeups" },
    { href: "/pages/sobre-mi.html",  label: "~/sobre-mi",   activo: "sobre-mi" }
];

function construirNav(activo) {
    return NAV_ITEMS.map(({ href, label, activo: id }) => {
        const clase = id === activo ? ' class="active"' : "";
        return `                    <a href="${href}"${clase}>${label}</a>`;
    }).join("\n");
}

function construirHeader(ruta, activo) {
    return `
            <header class="terminal-header">

                <h1 class="terminal-logo">
                    Ángel García<span class="terminal-logo-cursor">▌</span>
                </h1>

                <nav class="terminal-nav">
${construirNav(activo)}
                </nav>

                <div class="terminal-subnav">
                    <div class="terminal-lang">
                        <span class="active">ES</span> · <span>EN</span>
                    </div>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="terminal-account">
                        account
                    </a>
                </div>

            </header>`;
}

function construirBarra(ruta) {
    return `
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
        </div>`;
}

function construirComando(ruta, cmd) {
    return `
            <div class="terminal-command">
                <span class="prompt">root@angel</span><span class="sep">:</span><span class="path">${ruta}</span><span class="sep">$</span> <span class="cmd">${cmd}</span>
            </div>`;
}

function construirFooter() {
    return `
        <div class="term-footer">
            <span>© <span id="current-year"></span> Ángel García</span>
            <span>Portfolio técnico</span>
        </div>`;
}


/* =========================================================
   EXTRAER CONTENIDO DEL <main>
========================================================= */

function extraerMain(html) {
    /* Coge lo que esté entre <main...> y </main> */
    const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

    return match ? match[1].trim() : null;
}


/* =========================================================
   LIMPIAR CONTENIDO
   Quita back-link y section-tag duplicados del main,
   ya que se añaden fuera
========================================================= */

function limpiarContenido(contenido) {
    let limpio = contenido;

    /* Quitar <section class="page-header"> completo */
    limpio = limpio.replace(
        /<section class="page-header">[\s\S]*?<\/section>/i,
        ""
    );

    /* Quitar <section class="writeups-hero"> */
    limpio = limpio.replace(
        /<section class="writeups-hero">[\s\S]*?<\/section>/i,
        ""
    );

    /* Quitar <section class="hero"> */
    limpio = limpio.replace(
        /<section class="hero">[\s\S]*?<\/section>/i,
        ""
    );

    /* Quitar section-tag suelto */
    limpio = limpio.replace(
        /<span class="section-tag">[^<]*<\/span>/gi,
        ""
    );

    /* Quitar back-link suelto */
    limpio = limpio.replace(
        /<a href="[^"]*" class="back-link">[^<]*<\/a>/gi,
        ""
    );

    return limpio.trim();
}


/* =========================================================
   CONSTRUIR HTML FINAL
========================================================= */

function construirHTML(htmlOriginal, config) {
    const contenido = extraerMain(htmlOriginal);

    if (!contenido) {
        console.warn("  ⚠️  No se encontró <main> en el HTML");
        return null;
    }

    const contenidoLimpio = limpiarContenido(contenido);

    /* Extraer <title> y <meta description> */

    const titleMatch = htmlOriginal.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "Ángel García";

    const descMatch = htmlOriginal.match(
        /<meta\s+name="description"\s+content="([^"]*)"\s*>/i
    );
    const desc = descMatch ? descMatch[1] : "";

    /* Scripts originales (solo los del body que NO sean navbar.js) */

    const scripts = [];
    const scriptRegex = /<script\s+type="module"\s+src="([^"]+)"\s*><\/script>/gi;
    let m;

    while ((m = scriptRegex.exec(htmlOriginal)) !== null) {
        const src = m[1];

        if (src.includes("navbar.js")) continue;
        if (src.includes("cheatsheet.js")) continue;
        if (src.includes("cheatsheets.js")) continue;
        if (src.includes("app.js")) continue;
        if (src.includes("stack.js")) continue;

        scripts.push(`    <script type="module" src="${src}"></script>`);
    }

    /* Mantener scripts específicos según la página */

    const extras = [];

    if (config.esCategoriaCheatsheet) {
        extras.push(`    <script type="module" src="/cheatsheets/js/cheatsheet.js"></script>`);
    } else if (config.esIndexCheatsheet) {
        extras.push(`    <script type="module" src="/cheatsheets/js/cheatsheets.js"></script>`);
    } else if (config.esStack) {
        extras.push(`    <script type="module" src="/js/stack.js"></script>`);
    } else {
        extras.push(`    <script type="module" src="/js/app.js"></script>`);
    }

    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${desc}">
    <title>${title}</title>

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/css/cheatsheets.css">
</head>

<body>

    <div class="terminal-wrapper">
${construirBarra(config.ruta)}
        <div class="terminal-body">
${construirHeader(config.ruta, config.activo)}
${construirComando(config.ruta, config.cmd)}

${contenidoLimpio}

        </div>
${construirFooter()}
    </div>

${extras.join("\n")}

    <script>
        document.querySelector("#current-year").textContent =
            new Date().getFullYear();
    </script>

</body>

</html>
`;
}


/* =========================================================
   RECORRER HTML
========================================================= */

function recorrerYTransformar() {
    console.log("");
    console.log("=========================================");
    console.log("🎨 Aplicando estética terminal");
    console.log("=========================================");
    console.log("");

    let procesados = 0;
    let omitidos = 0;

    /* 1. Páginas con configuración manual */

    Object.entries(CONFIG).forEach(([rutaRel, config]) => {
        const rutaAbs = path.join(RAIZ, rutaRel);

        if (!fs.existsSync(rutaAbs)) {
            console.log(`⚠️  No existe: ${rutaRel}`);
            return;
        }

        const html = fs.readFileSync(rutaAbs, "utf-8");

        if (html.includes("terminal-wrapper")) {
            console.log(`⏭️  Ya migrado: ${rutaRel}`);
            omitidos++;
            return;
        }

        /* Marcar tipo */

        if (rutaRel === "cheatsheets/index.html") {
            config.esIndexCheatsheet = true;
        } else if (rutaRel.includes("stack")) {
            config.esStack = true;
        } else {
            config.esApp = true;
        }

        const nuevo = construirHTML(html, config);

        if (!nuevo) {
            console.log(`❌ No se pudo procesar: ${rutaRel}`);
            return;
        }

        /* Backup */

        fs.writeFileSync(`${rutaAbs}.bak`, html, "utf-8");
        fs.writeFileSync(rutaAbs, nuevo, "utf-8");

        console.log(`✅ Migrado: ${rutaRel}`);
        procesados++;
    });

    /* 2. Categorías de cheatsheets */

    CATEGORIAS_CHEATSHEET.forEach((slug) => {
        const rutaRel = `cheatsheets/${slug}.html`;
        const rutaAbs = path.join(RAIZ, rutaRel);

        if (!fs.existsSync(rutaAbs)) {
            console.log(`⚠️  No existe: ${rutaRel}`);
            return;
        }

        const html = fs.readFileSync(rutaAbs, "utf-8");

        if (html.includes("terminal-wrapper")) {
            console.log(`⏭️  Ya migrado: ${rutaRel}`);
            omitidos++;
            return;
        }

        const config = {
            ruta: `~/cheatsheets/${slug}`,
            cmd: `cat ${slug}.md`,
            activo: "cheatsheets",
            esCategoriaCheatsheet: true
        };

        const nuevo = construirHTML(html, config);

        if (!nuevo) {
            console.log(`❌ No se pudo procesar: ${rutaRel}`);
            return;
        }

        fs.writeFileSync(`${rutaAbs}.bak`, html, "utf-8");
        fs.writeFileSync(rutaAbs, nuevo, "utf-8");

        console.log(`✅ Migrado: ${rutaRel}`);
        procesados++;
    });

    /* 3. Detalle de cheatsheets (recursivo) */

    const detalleDir = path.join(RAIZ, "cheatsheets", "detalle");

    if (fs.existsSync(detalleDir)) {
        recorrerDetalle(detalleDir, procesados, omitidos);
    }

    console.log("");
    console.log("=========================================");
    console.log(`✅ Procesados: ${procesados}`);
    console.log(`⏭️  Omitidos:   ${omitidos}`);
    console.log("=========================================");
    console.log("");
    console.log("Cada archivo tiene un backup con extensión .bak");
    console.log("");
}

function recorrerDetalle(dir, procesados, omitidos) {
    const entradas = fs.readdirSync(dir, { withFileTypes: true });

    entradas.forEach((e) => {
        const rutaAbs = path.join(dir, e.name);

        if (e.isDirectory()) {
            recorrerDetalle(rutaAbs, procesados, omitidos);
            return;
        }

        if (!e.name.endsWith(".html")) return;

        const rutaRel = path.relative(RAIZ, rutaAbs).replace(/\\/g, "/");

        const html = fs.readFileSync(rutaAbs, "utf-8");

        if (html.includes("terminal-wrapper")) {
            console.log(`⏭️  Ya migrado: ${rutaRel}`);
            omitidos++;
            return;
        }

        /* Extraer partes de la ruta:
           cheatsheets/detalle/<categoria>/<subcategoria>.html
           cheatsheets/detalle/<categoria>/<subcategoria>/<comando>.html
        */

        const partes = rutaRel.split("/");
        const idx = partes.indexOf("detalle");

        const categoria = partes[idx + 1] || "";
        const subcategoria = partes[idx + 2]?.replace(".html", "") || "";
        const comando = partes[idx + 3]?.replace(".html", "") || null;

        const cmd = comando
            ? `cat ${comando}.md`
            : `cat ${subcategoria}.md`;

        const config = {
            ruta: `~/cheatsheets/${categoria}/${subcategoria}`,
            cmd,
            activo: "cheatsheets",
            esCategoriaCheatsheet: true
        };

        const nuevo = construirHTML(html, config);

        if (!nuevo) return;

        fs.writeFileSync(`${rutaAbs}.bak`, html, "utf-8");
        fs.writeFileSync(rutaAbs, nuevo, "utf-8");

        console.log(`✅ Migrado: ${rutaRel}`);
        procesados++;
    });
}


/* =========================================================
   MAIN
========================================================= */

recorrerYTransformar();