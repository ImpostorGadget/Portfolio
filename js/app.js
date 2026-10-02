/* =========================================================
   ÁNGEL GARCÍA — PORTFOLIO
   Main application logic
   Carga data.json desde la raíz del sitio
========================================================= */

const DATA_URL = `${import.meta.env.BASE_URL}data.json`;

/* =========================================================
   UTILIDADES
========================================================= */

function escapeHtml(valor) {
    if (valor === null || valor === undefined) return "";
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttr(valor) {
    return escapeHtml(valor);
}

function esUrlSegura(url) {
    if (!url || url === "#") return false;
    try {
        const u = new URL(url, window.location.origin);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function normalizarCategoria(categoria) {
    if (!categoria) return "otros";

    const slug = String(categoria)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "otros";
}

function formatearFecha(date) {
    if (!date) return "";

    const tieneHora = String(date).includes("T");
    const fecha = new Date(tieneHora ? date : `${date}T00:00:00`);

    if (Number.isNaN(fecha.getTime())) return String(date);

    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    cargarAño(); // Siempre, independiente de data.json
    cargarPortfolio();
});

/* =========================================================
   CARGAR PORTFOLIO
========================================================= */

async function cargarPortfolio() {
    let data;

    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} al cargar ${DATA_URL}`);
        }

        data = await response.json();
        console.log("data.json cargado:", data);
    } catch (error) {
        console.error("Error cargando los datos del portfolio:", error);
        return;
    }

    if (!data || typeof data !== "object") return;

    if (data.profile) cargarPerfil(data.profile);

    if (data.skills && typeof data.skills === "object") {
        cargarSkills(data.skills);
    }

    if (
        data.security &&
        typeof data.security === "object" &&
        !Array.isArray(data.security)
    ) {
        cargarSeguridad(data.security);
    }

    if (Array.isArray(data.projects)) cargarProyectos(data.projects);
    if (Array.isArray(data.writeups)) cargarWriteups(data.writeups);
}

/* =========================================================
   PERFIL
========================================================= */

function cargarPerfil(profile) {
    const heroName = document.querySelector("#hero-name");

    if (heroName) {
        const cursor = heroName.querySelector(".terminal-logo-cursor");
        heroName.textContent = profile.name || "";
        if (cursor) heroName.appendChild(cursor);
    }

    const camposSimples = {
        "hero-role": profile.role,
        "hero-description": profile.description,
        "profile-currently": profile.currently,
        "profile-specialization": profile.specialization,
        "profile-base": profile.base,
        "profile-objective": profile.objective
    };

    Object.entries(camposSimples).forEach(([id, valor]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor || "";
    });

    const aboutContent = document.querySelector("#about-content");
    if (aboutContent) {
        aboutContent.textContent = "";
        const p = document.createElement("p");
        p.textContent = profile.about || "";
        aboutContent.appendChild(p);
    }
}

/* =========================================================
   SKILLS
========================================================= */

function cargarSkills(skills) {
    const container = document.querySelector("#skills-container");
    if (!container) return;

    container.textContent = "";

    let grupos = {};

    if (Array.isArray(skills)) {
        skills.forEach((skill) => {
            const categoria = skill.category || "Otros";
            (grupos[categoria] ??= []).push(skill);
        });
    } else {
        grupos = skills;
    }

    Object.entries(grupos).forEach(([categoria, items]) => {
        if (!Array.isArray(items)) return;
        container.appendChild(
            construirGrupoSkills(categoria, items, false)
        );
    });
}

/* =========================================================
   CIBERSEGURIDAD
========================================================= */

function cargarSeguridad(security) {
    const container = document.querySelector("#security-container");
    if (!container) return;

    container.textContent = "";

    Object.entries(security).forEach(([categoria, items]) => {
        if (!Array.isArray(items)) return;
        container.appendChild(
            construirGrupoSkills(categoria, items, true)
        );
    });
}

/**
 * Construye un bloque <section class="skills-group"> reutilizable
 * para skills y ciberseguridad.
 */
function construirGrupoSkills(categoria, items, conDescripcion) {
    const bloque = document.createElement("section");
    bloque.className = "skills-group";

    const header = document.createElement("header");
    header.className = "skills-group-header";

    const label = document.createElement("span");
    label.className = "skills-group-label";
    label.textContent = categoria;

    const count = document.createElement("span");
    count.className = "skills-group-count";
    count.textContent = items.length;

    header.append(label, count);

    const grid = document.createElement("div");
    grid.className = "skills-grid";

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "skill-card";

        const h3 = document.createElement("h3");
        h3.textContent = item.name || "";

        const level = document.createElement("span");
        level.className = "skill-level";
        level.textContent = item.level || "";

        card.append(h3, level);

        if (conDescripcion && item.description) {
            const p = document.createElement("p");
            p.className = "skill-desc";
            p.textContent = item.description;
            card.appendChild(p);
        }

        grid.appendChild(card);
    });

    bloque.append(header, grid);
    return bloque;
}

/* =========================================================
   PROYECTOS
========================================================= */

function cargarProyectos(projects) {
    const container = document.querySelector("#projects-container");
    if (!container) return;

    container.textContent = "";

    projects.forEach((project) => {
        const card = document.createElement("article");
        card.className = "project-card";

        const h3 = document.createElement("h3");
        h3.textContent = project.title || "";

        const p = document.createElement("p");
        p.textContent = project.description || "";

        card.append(h3, p);

        if (Array.isArray(project.technologies) && project.technologies.length) {
            const techWrap = document.createElement("div");
            techWrap.className = "project-tech";
            project.technologies.forEach((t) => {
                const span = document.createElement("span");
                span.className = "tech";
                span.textContent = t;
                techWrap.appendChild(span);
            });
            card.appendChild(techWrap);
        }

        if (project.status) {
            const status = document.createElement("small");
            status.className = "project-status";
            status.textContent = project.status;
            card.appendChild(status);
        }

        const linksWrap = document.createElement("div");
        linksWrap.className = "project-links";

        if (esUrlSegura(project.github)) {
            linksWrap.appendChild(
                crearEnlace(project.github, "GitHub", "project-link")
            );
        }

        if (esUrlSegura(project.demo)) {
            linksWrap.appendChild(
                crearEnlace(project.demo, "Ver proyecto", "project-link primary")
            );
        }

        if (linksWrap.children.length) {
            card.appendChild(linksWrap);
        }

        container.appendChild(card);
    });
}

function crearEnlace(href, texto, clase) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = clase;
    a.textContent = texto;
    return a;
}

/* =========================================================
   WRITEUPS
========================================================= */

function cargarWriteups(writeups) {
    const container = document.querySelector("#writeups-container");
    if (!container) return;

    container.textContent = "";

    const emptyState = document.getElementById("empty-state");

    if (writeups.length === 0) {
        if (emptyState) emptyState.hidden = false;
        return;
    }

    // Mapa slug -> etiqueta original (para mostrar "Máquinas Linux")
    const categoriasMap = new Map();
    writeups.forEach((w) => {
        const slug = normalizarCategoria(w.category);
        if (!categoriasMap.has(slug)) {
            categoriasMap.set(slug, w.category || "Ciberseguridad");
        }
    });

    writeups.forEach((writeup) => {
        const card = document.createElement("article");
        card.className = "writeup-card";
        card.dataset.category = normalizarCategoria(writeup.category);

        const main = document.createElement("div");
        main.className = "writeup-card-main";

        const header = document.createElement("div");
        header.className = "writeup-card-header";

        const catSpan = document.createElement("span");
        catSpan.className = "writeup-category";
        catSpan.textContent = writeup.category || "Ciberseguridad";
        header.appendChild(catSpan);

        if (writeup.difficulty) {
            const diff = document.createElement("span");
            diff.className = "writeup-difficulty";
            diff.textContent = writeup.difficulty;
            header.appendChild(diff);
        }

        const h2 = document.createElement("h2");
        h2.textContent = writeup.title || "";

        const p = document.createElement("p");
        p.textContent = writeup.summary || "";

        main.append(header, h2, p);

        const fecha = formatearFecha(writeup.date);
        if (fecha) {
            const meta = document.createElement("div");
            meta.className = "writeup-meta";
            meta.textContent = fecha;
            main.appendChild(meta);
        }

        if (Array.isArray(writeup.tools) && writeup.tools.length) {
            const techWrap = document.createElement("div");
            techWrap.className = "project-tech";
            writeup.tools.forEach((t) => {
                const span = document.createElement("span");
                span.className = "tech";
                span.textContent = t;
                techWrap.appendChild(span);
            });
            main.appendChild(techWrap);
        }

        const footer = document.createElement("div");
        footer.className = "writeup-card-footer";

        if (writeup.slug) {
            const a = document.createElement("a");
            a.href = `${import.meta.env.BASE_URL}writeups/${encodeURIComponent(
                writeup.slug
            )}.html`;
            a.className = "project-link primary";
            a.textContent = "Leer writeup →";
            footer.appendChild(a);
        }

        card.append(main, footer);
        container.appendChild(card);
    });

    pintarFiltros(categoriasMap);
}

/* =========================================================
   FILTROS DINÁMICOS + LISTENERS
========================================================= */

function pintarFiltros(categoriasMap) {
    const container = document.getElementById("writeups-filters");
    if (!container) return;

    container.textContent = "";

    const crearBoton = (slug, label) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filter-btn";
        btn.dataset.filter = slug;
        btn.textContent = label;
        return btn;
    };

    const btnTodos = crearBoton("all", "Todos");
    btnTodos.classList.add("active");
    container.appendChild(btnTodos);

    categoriasMap.forEach((label, slug) => {
        container.appendChild(crearBoton(slug, label));
    });

    // Listeners justo aquí: acoplados a la creación
    initWriteupFilters(container);
}

function initWriteupFilters(filtersContainer) {
    const filterButtons = filtersContainer.querySelectorAll(".filter-btn");
    const container = document.getElementById("writeups-container");
    const emptyState = document.getElementById("empty-state");
    const toolbarTitle = document.querySelector(".writeups-toolbar h2");

    if (!filterButtons.length || !container) return;

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter || "all";
            const cards = container.querySelectorAll(".writeup-card");

            let visibleCount = 0;

            cards.forEach((card) => {
                const matches =
                    filter === "all" || card.dataset.category === filter;
                card.classList.toggle("hidden", !matches);
                if (matches) visibleCount++;
            });

            if (emptyState) emptyState.hidden = visibleCount !== 0;

            if (toolbarTitle) {
                toolbarTitle.textContent =
                    filter === "all"
                        ? "Laboratorios y análisis"
                        : `Laboratorios y análisis · ${button.textContent.trim()}`;
            }
        });
    });
}

/* =========================================================
   AÑO
========================================================= */

function cargarAño() {
    const year = document.querySelector("#year");
    if (year) year.textContent = new Date().getFullYear();
}