import data from "/data/cheatsheets.json";


document.addEventListener("DOMContentLoaded", cargarCheatsheets);


/* =========================================================
   DESCRIPCIÓN POR CATEGORÍA
========================================================= */

const DESCRIPCIONES = {
    "Git": "Control de versiones",
    "Linux": "Sistema operativo y comandos",
    "JavaScript": "Lenguaje del navegador",
    "PHP": "Backend y servidor",
    "SysAdmin": "Administración de sistemas",
    "Cybersecurity": "Herramientas de seguridad ofensiva"
};


/* =========================================================
   SLUG
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
   CARGAR
========================================================= */

function cargarCheatsheets() {
    const grid = document.getElementById("cheatsheets-grid");

    if (!grid) return;

    const lista = data.secciones || [];

    if (!Array.isArray(lista) || !lista.length) {
        grid.innerHTML = `<p class="loading">No hay cheatsheets disponibles.</p>`;
        return;
    }

    /* Agrupar por categoría */

    const grupos = {};

    lista.forEach((s) => {
        const cat = s.categoria || "Otros";
        if (!grupos[cat]) grupos[cat] = [];
        grupos[cat].push(s);
    });

    grid.innerHTML = "";

    Object.entries(grupos).forEach(([categoria, items]) => {

        const descripcion = DESCRIPCIONES[categoria] || "";
        const slug = slugify(categoria);

        /* Bloque simple (enlace directo, sin desplegable) */

        const bloque = document.createElement("a");
        bloque.className = "cheatsheet-category cheatsheet-category-link-only";
        bloque.href = `/cheatsheets/${slug}.html`;

        bloque.innerHTML = `
            <span class="cheatsheet-category-title">
                <span class="cheatsheet-category-label">${categoria}</span>
                ${
                    descripcion
                        ? `<span class="cheatsheet-category-desc">${descripcion}</span>`
                        : ""
                }
            </span>

            <span class="cheatsheet-category-meta">
                <span class="cheatsheet-category-cta">
                    Ver cheatsheet completa →
                </span>
            </span>
        `;

        grid.appendChild(bloque);
    });
}