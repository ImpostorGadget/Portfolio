/* =========================================================
   ÁNGEL GARCÍA — PORTFOLIO
   Main application logic
========================================================= */


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    cargarPortfolio();
});


/* =========================================================
   CARGAR PORTFOLIO
========================================================= */

async function cargarPortfolio() {
    try {
        const response = await fetch("/data.json");

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar data.json: HTTP ${response.status}`
            );
        }

        const data = await response.json();

        /* Perfil */
        if (data.profile) {
            cargarPerfil(data.profile);
        }

        /* Skills */
        if (Array.isArray(data.skills)) {
            cargarSkills(data.skills);
        }

        /* Proyectos */
        if (Array.isArray(data.projects)) {
            cargarProyectos(data.projects);
        }

        /* Writeups */
        if (Array.isArray(data.writeups)) {
            cargarWriteups(data.writeups);
        }

        /* Año */
        cargarAño();

        /*
         * Los filtros se inicializan DESPUÉS de pintar
         * los writeups porque necesitan encontrar
         * las tarjetas ya creadas en el DOM.
         */
        initWriteupFilters();

    } catch (error) {
        console.error(
            "Error cargando los datos del portfolio:",
            error
        );
    }
}


/* =========================================================
   PERFIL
========================================================= */

function cargarPerfil(profile) {
    /* Nombre del hero */
    const heroName = document.querySelector("#hero-name");

    if (heroName) {
        heroName.textContent = profile.name || "";
    }


    /* Descripción del hero */
    const heroDescription =
        document.querySelector("#hero-description");

    if (heroDescription) {
        heroDescription.textContent =
            profile.description || "";
    }


    /* Sobre mí */
    const aboutContent =
        document.querySelector("#about-content");

    if (aboutContent) {
        aboutContent.innerHTML = `
            <p>${profile.about || ""}</p>
        `;
    }
}


/* =========================================================
   SKILLS
========================================================= */

function cargarSkills(skills) {
    const container =
        document.querySelector("#skills-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    skills.forEach((skill) => {
        const card =
            document.createElement("article");

        card.className = "skill-card";


        card.innerHTML = `
            <span class="skill-category">
                ${skill.category || "Tecnología"}
            </span>

            <h3>
                ${skill.name || ""}
            </h3>

            <span class="skill-level">
                ${skill.level || ""}
            </span>
        `;


        container.appendChild(card);
    });
}


/* =========================================================
   PROYECTOS
========================================================= */

function cargarProyectos(projects) {
    const container =
        document.querySelector("#projects-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    projects.forEach((project) => {
        const card =
            document.createElement("article");

        card.className = "project-card";


        /* -----------------------------------------
           TECNOLOGÍAS
        ----------------------------------------- */

        const technologies =
            Array.isArray(project.technologies)
                ? project.technologies
                    .map(
                        (technology) => `
                            <span class="tech">
                                ${technology}
                            </span>
                        `
                    )
                    .join("")
                : "";


        /* -----------------------------------------
           ENLACES
        ----------------------------------------- */

        const links = [];


        /* GitHub */

        if (
            project.github &&
            project.github !== "#"
        ) {
            links.push(`
                <a
                    href="${project.github}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    GitHub
                </a>
            `);
        }


        /* Demo */

        if (
            project.demo &&
            project.demo !== "#"
        ) {
            links.push(`
                <a
                    href="${project.demo}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link primary"
                >
                    Ver proyecto
                </a>
            `);
        }


        /* -----------------------------------------
           CONTENIDO DE LA TARJETA
        ----------------------------------------- */

        card.innerHTML = `
            <h3>
                ${project.title || ""}
            </h3>

            <p>
                ${project.description || ""}
            </p>

            ${
                technologies
                    ? `
                        <div class="project-tech">
                            ${technologies}
                        </div>
                    `
                    : ""
            }

            ${
                project.status
                    ? `
                        <small class="project-status">
                            ${project.status}
                        </small>
                    `
                    : ""
            }

            ${
                links.length
                    ? `
                        <div class="project-links">
                            ${links.join("")}
                        </div>
                    `
                    : ""
            }
        `;


        container.appendChild(card);
    });
}


/* =========================================================
   WRITEUPS
========================================================= */

function cargarWriteups(writeups) {
    const container =
        document.querySelector("#writeups-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    /* -----------------------------------------
       SIN WRITEUPS
    ----------------------------------------- */

    if (writeups.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                No hay writeups disponibles actualmente.
            </p>
        `;

        return;
    }


    /* -----------------------------------------
       WRITEUPS
    ----------------------------------------- */

    writeups.forEach((writeup, index) => {
        const card =
            document.createElement("article");


        /* -------------------------------------
           CLASE
        ------------------------------------- */

        card.className = "writeup-card";


        /* -------------------------------------
           NÚMERO

           01
           02
           03
           ...
        ------------------------------------- */

        card.dataset.number =
            String(index + 1).padStart(2, "0");


        /* -------------------------------------
           CATEGORÍA

           Necesaria para los filtros.
        ------------------------------------- */

        card.dataset.category =
            writeup.category || "Ciberseguridad";


        /* -------------------------------------
           TECNOLOGÍAS
        ------------------------------------- */

        const tools =
            Array.isArray(writeup.tools)
                ? writeup.tools
                    .map(
                        (tool) => `
                            <span class="tech">
                                ${tool}
                            </span>
                        `
                    )
                    .join("")
                : "";


        /* -------------------------------------
           FECHA
        ------------------------------------- */

        const formattedDate =
            formatearFecha(writeup.date);


        /* -------------------------------------
           CONTENIDO
        ------------------------------------- */

        card.innerHTML = `
            <div class="writeup-card-main">

                <div class="writeup-card-header">

                    <span class="writeup-category">
                        ${writeup.category || "Ciberseguridad"}
                    </span>

                    ${
                        writeup.difficulty
                            ? `
                                <span class="writeup-difficulty">
                                    ${writeup.difficulty}
                                </span>
                            `
                            : ""
                    }

                </div>


                <h2>
                    ${writeup.title || ""}
                </h2>


                <p>
                    ${writeup.summary || ""}
                </p>


                ${
                    formattedDate
                        ? `
                            <div class="writeup-meta">
                                ${formattedDate}
                            </div>
                        `
                        : ""
                }


                ${
                    tools
                        ? `
                            <div class="project-tech">
                                ${tools}
                            </div>
                        `
                        : ""
                }

            </div>


            <div class="writeup-card-footer">

                <a
                    href="/writeups/${writeup.slug}.html"
                    class="project-link primary"
                >
                    Leer writeup →
                </a>

            </div>
        `;


        container.appendChild(card);
    });
}


/* =========================================================
   FILTRADO DE WRITEUPS
========================================================= */

function initWriteupFilters() {
    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const container =
        document.getElementById("writeups-container");

    const emptyState =
        document.getElementById("empty-state");

    const toolbarTitle =
        document.querySelector(
            ".writeups-toolbar h2"
        );


    /*
     * Si esta página no tiene filtros o
     * no tiene contenedor de writeups,
     * no hacemos nada.
     */

    if (
        !filterButtons.length ||
        !container
    ) {
        return;
    }


    /* -----------------------------------------
       BOTONES
    ----------------------------------------- */

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            /* -------------------------------
               BOTÓN ACTIVO
            ------------------------------- */

            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            /* -------------------------------
               FILTRO
            ------------------------------- */

            const filter =
                button.dataset.filter || "all";


            /* -------------------------------
               TARJETAS
            ------------------------------- */

            const cards =
                container.querySelectorAll(
                    ".writeup-card"
                );


            let visibleCount = 0;


            /* -------------------------------
               FILTRAR
            ------------------------------- */

            cards.forEach((card) => {

                const category =
                    card.dataset.category || "";


                const matches =
                    filter === "all" ||
                    category === filter;


                card.classList.toggle(
                    "hidden",
                    !matches
                );


                if (matches) {
                    visibleCount++;
                }

            });


            /* -------------------------------
               EMPTY STATE
            ------------------------------- */

            if (emptyState) {

                emptyState.hidden =
                    visibleCount !== 0;

            }


            /* -------------------------------
               TÍTULO
            ------------------------------- */

            if (toolbarTitle) {

                const filterName =
                    button.textContent.trim();


                toolbarTitle.textContent =
                    filter === "all"
                        ? "Laboratorios y análisis"
                        : `Laboratorios y análisis · ${filterName}`;

            }

        });

    });
}


/* =========================================================
   CREAR EMPTY STATE DE FILTROS
========================================================= */

function crearEmptyState() {
    const container =
        document.querySelector(
            "#writeups-container"
        );

    if (!container) {
        return;
    }


    /*
     * Si ya existe, no hacemos nada.
     */

    if (
        document.getElementById("empty-state")
    ) {
        return;
    }


    const emptyState =
        document.createElement("p");


    emptyState.id = "empty-state";

    emptyState.className = "empty-state";

    emptyState.hidden = true;

    emptyState.textContent =
        "No hay writeups en esta categoría.";


    container.parentElement.appendChild(
        emptyState
    );
}


/* =========================================================
   FECHAS
========================================================= */

function formatearFecha(date) {

    if (!date) {
        return "";
    }


    const fecha =
        new Date(`${date}T00:00:00`);


    if (Number.isNaN(fecha.getTime())) {
        return date;
    }


    return fecha.toLocaleDateString(
        "es-ES",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


/* =========================================================
   AÑO
========================================================= */

function cargarAño() {
    const year =
        document.querySelector("#year");


    if (year) {
        year.textContent =
            new Date().getFullYear();
    }
}