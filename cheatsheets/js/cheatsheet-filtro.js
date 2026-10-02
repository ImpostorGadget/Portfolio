/* =========================================================
   CHEATSHEET — FILTRO POR SECCIÓN
   Lee data.json y filtra los comandos por sección interna
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

document.addEventListener("DOMContentLoaded", cargarCheatsheet);

/* =========================================================
   CARGA PRINCIPAL
========================================================= */

async function cargarCheatsheet() {
    const detail = document.getElementById("cheatsheet-detail");
    const filters = document.getElementById("cheatsheet-filters");
    const titleEl = document.getElementById("cheatsheet-title");
    const subtitleEl = document.getElementById("cheatsheet-subtitle");

    if (!detail) return;

    /* --- 1. Detectar qué cheatsheet es por la URL --- */
    const slug = detectarSlugDesdeUrl();

    /* --- 2. Cargar data.json --- */
    let data;
    try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error("Error cargando data.json:", err);
        detail.textContent = "⚠️ No se pudo cargar la cheatsheet.";
        return;
    }

    /* --- 3. Buscar la cheatsheet por slug --- */
    const sheet = (data.cheatsheets || []).find((c) => c.slug === slug);

    if (!sheet) {
        detail.textContent = `No se encontró la cheatsheet "${slug}".`;
        return;
    }

    /* --- 4. Cabecera --- */
    const secciones = Array.isArray(sheet.sections) ? sheet.sections : [];
    const totalComandos = secciones.reduce(
        (acc, s) => acc + (s.commands || []).length,
        0
    );

    if (titleEl) titleEl.textContent = sheet.title || "";
    if (subtitleEl) {
        subtitleEl.textContent =
            sheet.subtitle ||
            `${secciones.length} secciones · ${totalComandos} comandos`;
    }

    document.title = `${sheet.title || "Cheatsheet"} · Portfolio`;

    /* --- 5. Pintar --- */
    pintarSecciones(secciones, detail);
    if (filters) generarFiltros(secciones, detail, filters);
}

/* =========================================================
   PINTAR SECCIONES
========================================================= */

function pintarSecciones(secciones, container) {
    container.textContent = "";

    if (!secciones.length) {
        const p = document.createElement("p");
        p.className = "empty-state";
        p.textContent = "No hay secciones disponibles.";
        container.appendChild(p);
        return;
    }

    secciones.forEach((sec) => {
        container.appendChild(crearSeccion(sec));
    });
}

function crearSeccion(sec) {
    const card = document.createElement("article");
    card.className = "cheatsheet-card cheatsheet-card-full";
    card.dataset.section = slugify(sec.title);

    const h3 = document.createElement("h3");
    h3.className = "cheatsheet-title-row";
    h3.textContent = sec.title || "";
    card.appendChild(h3);

    const ul = document.createElement("ul");
    ul.className = "cheatsheet-commands";

    (sec.commands || []).forEach((cmd) => {
        const li = document.createElement("li");
        li.className = "cheatsheet-command";

        const code = document.createElement("code");
        code.className = "cmd-code";
        code.textContent = cmd.command || "";

        const desc = document.createElement("span");
        desc.className = "cmd-desc";
        desc.textContent = cmd.description || "";

        li.append(code, desc);
        ul.appendChild(li);
    });

    card.appendChild(ul);
    return card;
}

/* =========================================================
   FILTROS
========================================================= */

function generarFiltros(secciones, detail, filtersContainer) {
    filtersContainer.textContent = "";

    /* --- Botón "Todos" --- */
    filtersContainer.appendChild(
        crearBotonFiltro("all", "Todos", true)
    );

    /* --- Un botón por sección --- */
    secciones.forEach((sec) => {
        filtersContainer.appendChild(
            crearBotonFiltro(slugify(sec.title), sec.title)
        );
    });

    /* --- Listener delegado --- */
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
                : secciones.filter((s) => slugify(s.title) === filtro);

        pintarSecciones(filtradas, detail);
        actualizarSubtitulo(filtradas, btn.textContent.trim());
    });
}

function crearBotonFiltro(filtro, label, activo = false) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cheatsheet-filter-btn" + (activo ? " active" : "");
    btn.dataset.filter = filtro;
    btn.textContent = label;
    return btn;
}

function actualizarSubtitulo(secciones, label) {
    const subtitleEl = document.getElementById("cheatsheet-subtitle");
    if (!subtitleEl) return;

    const total = secciones.reduce(
        (acc, s) => acc + (s.commands || []).length,
        0
    );

    subtitleEl.textContent =
        label === "Todos"
            ? `${secciones.length} secciones · ${total} comandos`
            : `${label} · ${total} comandos`;
}