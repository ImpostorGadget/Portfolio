/* =========================================================
   CHEATSHEET — ÍNDICE DE SECCIONES
   Ruta esperada: /cheatsheets/<slug>.html
   Ejemplo:       /cheatsheets/cybersecurity.html
   Pinta una tarjeta por cada sección del cheatsheet.
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

function detectarSlugDesdeUrl() {
    return window.location.pathname
        .split("/")
        .pop()
        .replace(/\.html?$/i, "");
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", cargarIndice);

/* =========================================================
   CARGA PRINCIPAL
========================================================= */

async function cargarIndice() {
    const detail =
        document.getElementById("cheatsheet-detail") ||
        document.getElementById("cheatsheet-content");

    const filters = document.getElementById("cheatsheet-filters");
    const titleEl = document.getElementById("cheatsheet-title");
    const subtitleEl = document.getElementById("cheatsheet-subtitle");

    if (!detail) {
        console.warn("[indice] No existe contenedor de detalle");
        return;
    }

    const slug = detectarSlugDesdeUrl();
    console.log("[indice] slug:", slug);

    let data;
    try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error("[indice] error fetch:", err);
        detail.textContent = "⚠️ No se pudo cargar la cheatsheet.";
        return;
    }

    const lista = Array.isArray(data.cheatsheets) ? data.cheatsheets : [];
    const sheet = lista.find((c) => c.slug === slug);

    console.log("[indice] sheet:", sheet);

    if (!sheet) {
        detail.textContent = `No se encontró la cheatsheet "${slug}".`;
        return;
    }

    /* --- Todas las secciones (SIN filtro) --- */
    const secciones = Array.isArray(sheet.sections) ? sheet.sections : [];
    console.log("[indice] secciones encontradas:", secciones.length);

    /* --- Cabecera --- */
    if (titleEl) titleEl.textContent = sheet.title || "";

    const totalComandos = secciones.reduce(
        (acc, s) => acc + (s.commands || []).length,
        0
    );

    if (subtitleEl) {
        subtitleEl.textContent =
            sheet.subtitle ||
            `${secciones.length} secciones · ${totalComandos} comandos`;
    }

    /* --- Pintar TODAS las secciones --- */
    pintarIndice(secciones, detail, slug);

    /* --- Pintar filtros --- */
    if (filters) {
        generarFiltros(secciones, detail, filters, slug);
    }
}

/* =========================================================
   RENDER — índice de tarjetas con "Leer más →"
========================================================= */

function pintarIndice(secciones, container, slugCheatsheet) {
    container.textContent = "";

    if (!secciones.length) {
        const p = document.createElement("p");
        p.className = "empty-state";
        p.textContent = "No hay secciones disponibles.";
        container.appendChild(p);
        return;
    }

    const grid = document.createElement("div");
    grid.className = "cheatsheet-grid";

    secciones.forEach((sec) => {
        grid.appendChild(crearTarjetaSeccion(sec, slugCheatsheet));
    });

    container.appendChild(grid);
}

function crearTarjetaSeccion(sec, slugCheatsheet) {
    const slugSeccion = sec.slug || slugify(sec.title);
    const urlDetalle = `detalle/${slugCheatsheet}/${slugSeccion}.html`;

    const card = document.createElement("article");
    card.className = "cheatsheet-card cheatsheet-card-full";
    card.dataset.section = slugSeccion;

    /* --- Header row --- */
    const header = document.createElement("div");
    header.className = "cheatsheet-header-row";

    const h3 = document.createElement("h3");
    h3.className = "cheatsheet-title-row";
    h3.textContent = sec.title || "";

    const link = document.createElement("a");
    link.href = urlDetalle;
    link.className = "cheatsheet-read-more-inline";
    link.textContent = "Leer más →";

    header.append(h3, link);
    card.appendChild(header);

    return card;
}

/* =========================================================
   FILTROS
========================================================= */

function generarFiltros(secciones, detail, filtersContainer, slugCheatsheet) {
    filtersContainer.textContent = "";

    const crearBtn = (filtro, label, activo = false) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cheatsheet-filter-btn" + (activo ? " active" : "");
        btn.dataset.filter = filtro;
        btn.textContent = label;
        return btn;
    };

    filtersContainer.appendChild(crearBtn("all", "Todos", true));

    secciones.forEach((sec) => {
        filtersContainer.appendChild(
            crearBtn(sec.slug || slugify(sec.title), sec.title)
        );
    });

    filtersContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".cheatsheet-filter-btn");
        if (!btn) return;

        filtersContainer
            .querySelectorAll(".cheatsheet-filter-btn")
            .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filtro = btn.dataset.filter;

        const filtradas =
            filtro === "all"
                ? secciones
                : secciones.filter(
                    (s) => (s.slug || slugify(s.title)) === filtro
                );

        pintarIndice(filtradas, detail, slugCheatsheet);

        const subtitleEl = document.getElementById("cheatsheet-subtitle");
        if (subtitleEl) {
            const total = filtradas.reduce(
                (a, s) => a + (s.commands || []).length,
                0
            );
            subtitleEl.textContent =
                filtro === "all"
                    ? `${filtradas.length} secciones · ${total} comandos`
                    : `${filtradas[0].title} · ${total} comandos`;
        }
    });
}