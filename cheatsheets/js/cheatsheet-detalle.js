/* =========================================================
   CHEATSHEET — DETALLE (dos niveles)
   - Subcategoría: /cheatsheets/detalle/<cheatsheet>/<seccion>.html
   - Herramienta:  /cheatsheets/detalle/<cheatsheet>/<seccion>/<tool>.html
========================================================= */

const DATA_URL = `${import.meta.env.BASE_URL}data.json`;

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

/**
 * Detecta la ruta actual y devuelve:
 *   { slugCheatsheet, slugSeccion, slugTool }
 *
 * Ejemplos:
 *   /cheatsheets/detalle/cybersecurity/recon.html
 *     → { slugCheatsheet: "cybersecurity", slugSeccion: "recon", slugTool: null }
 *
 *   /cheatsheets/detalle/cybersecurity/recon/nmap.html
 *     → { slugCheatsheet: "cybersecurity", slugSeccion: "recon", slugTool: "nmap" }
 */
function detectarRuta() {
    const partes = window.location.pathname.split("/").filter(Boolean);
    const archivo = partes.pop().replace(/\.html?$/i, "");

    const idxDetalle = partes.lastIndexOf("detalle");
    const resto = partes.slice(idxDetalle + 1);

    /* resto tiene:
       - ["cybersecurity"]                        → estamos en subcategoría
       - ["cybersecurity", "recon"]               → estamos en herramienta
    */

    if (resto.length >= 2) {
        return {
            slugCheatsheet: resto[0],
            slugSeccion: resto[1],
            slugTool: archivo
        };
    }

    return {
        slugCheatsheet: resto[0],
        slugSeccion: archivo,
        slugTool: null
    };
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", cargarDetalle);

async function cargarDetalle() {
    const container = document.getElementById("cheatsheet-detail");
    if (!container) {
        console.warn("[detalle] No existe #cheatsheet-detail");
        return;
    }

    const { slugCheatsheet, slugSeccion, slugTool } = detectarRuta();
    console.log(
        "[detalle] cheatsheet:",
        slugCheatsheet,
        "· sección:",
        slugSeccion,
        "· tool:",
        slugTool
    );

    /* --- 1. Cargar data.json --- */
    let data;
    try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error("[detalle] error fetch:", err);
        container.textContent = "⚠️ No se pudo cargar el detalle.";
        return;
    }

    const lista = Array.isArray(data.cheatsheets) ? data.cheatsheets : [];
    const sheet = lista.find((c) => c.slug === slugCheatsheet);

    if (!sheet) {
        container.textContent = `No se encontró la cheatsheet "${slugCheatsheet}".`;
        return;
    }

    const secciones = Array.isArray(sheet.sections) ? sheet.sections : [];
    const seccion = secciones.find(
        (s) => (s.slug || slugify(s.title)) === slugSeccion
    );

    if (!seccion) {
        container.textContent =
            `No se encontró la sección "${slugSeccion}" en "${slugCheatsheet}".`;
        return;
    }

    const commands = Array.isArray(seccion.commands) ? seccion.commands : [];
    const titleEl = document.getElementById("cheatsheet-title");
    const subtitleEl = document.getElementById("cheatsheet-subtitle");

    /* =====================================================
       CASO 1 — Herramienta: /detalle/.../<seccion>/<tool>.html
       ===================================================== */
    if (slugTool) {
        const tool = commands.find(
            (c) => (c.slug || slugify(c.command)) === slugTool
        );

        console.log("[detalle] tool:", tool);

        if (!tool) {
            container.textContent =
                `No se encontró la herramienta "${slugTool}" en "${seccion.title}".`;
            return;
        }

        if (titleEl) titleEl.textContent = tool.command || "";
        if (subtitleEl) subtitleEl.textContent = tool.description || "";

        document.title = `${tool.command} · ${seccion.title} · ${sheet.title}`;

        /* Back-link a la sección */
        const back = document.querySelector(".back-link");
        if (back) {
            const slugSec = seccion.slug || slugify(seccion.title);
            back.href = `../${slugSec}.html`;
            back.textContent = `← back to ${seccion.title}`;
        }

        /* Render de bloques de detalle */
        container.textContent = "";

        const detailSections = Array.isArray(tool.detail) ? tool.detail : [];

        if (!detailSections.length) {
            const p = document.createElement("p");
            p.className = "empty-state";
            p.textContent = "No hay información adicional para esta herramienta.";
            container.appendChild(p);
            return;
        }

        detailSections.forEach((dsec) => {
            container.appendChild(crearBloqueDetalle(dsec));
        });

        return;
    }

    /* =====================================================
       CASO 2 — Subcategoría: /detalle/.../<seccion>.html
       ===================================================== */
    if (titleEl) titleEl.textContent = seccion.title || "";
    if (subtitleEl) subtitleEl.textContent = `${commands.length} herramientas`;

    document.title = `${seccion.title} · ${sheet.title} · Cheatsheet`;

    const back = document.querySelector(".back-link");
    if (back) {
        back.href = `../../${sheet.slug}.html`;
        back.textContent = `← back to ${sheet.title}`;
    }

    container.textContent = "";

    if (!commands.length) {
        const p = document.createElement("p");
        p.className = "empty-state";
        p.textContent = "No hay herramientas en esta sección.";
        container.appendChild(p);
        return;
    }

    const grid = document.createElement("div");
    grid.className = "cheatsheet-grid";

    commands.forEach((tool) => {
        grid.appendChild(
            crearTarjetaHerramienta(tool, slugCheatsheet, slugSeccion)
        );
    });

    container.appendChild(grid);
}

/* =========================================================
   TARJETA DE HERRAMIENTA (subcategoría)
========================================================= */

function crearTarjetaHerramienta(tool, slugCheatsheet, slugSeccion) {
    const slugTool = tool.slug || slugify(tool.command);

    // ✅ Ruta con subcarpeta por sección
    const urlDetalle = `${slugSeccion}/${slugTool}.html`;

    const card = document.createElement("article");
    card.className = "cheatsheet-card cheatsheet-card-full";

    const header = document.createElement("div");
    header.className = "cheatsheet-header-row";

    const h3 = document.createElement("h3");
    h3.className = "cheatsheet-title-row";
    h3.textContent = tool.command || "";

    const link = document.createElement("a");
    link.href = urlDetalle;
    link.className = "cheatsheet-read-more-inline";
    link.textContent = "Leer más →";

    header.append(h3, link);
    card.appendChild(header);

    if (tool.description) {
        const p = document.createElement("p");
        p.className = "cheatsheet-desc";
        p.textContent = tool.description;
        card.appendChild(p);
    }

    return card;
}

/* =========================================================
   BLOQUE DE DETALLE (herramienta)
========================================================= */

function crearBloqueDetalle(dsec) {
    const section = document.createElement("section");
    section.className = "cheatsheet-card cheatsheet-card-full";

    const h3 = document.createElement("h3");
    h3.className = "cheatsheet-title-row";
    h3.textContent = dsec.title || "";
    section.appendChild(h3);

    const ul = document.createElement("ul");
    ul.className = "cheatsheet-commands";

    (dsec.commands || []).forEach((cmd) => {
        const li = document.createElement("li");
        li.className = "cheatsheet-command";

        const pre = document.createElement("pre");
        pre.className = "cmd-code-wrapper";

        const code = document.createElement("code");
        code.className = "cmd-code";
        code.textContent = cmd.command || "";
        pre.appendChild(code);

        const desc = document.createElement("p");
        desc.className = "cmd-desc";
        desc.textContent = cmd.description || "";

        li.append(pre, desc);
        ul.appendChild(li);
    });

    section.appendChild(ul);
    return section;
}