document.addEventListener("DOMContentLoaded", () => {
    cargarPortfolio();
});


async function cargarPortfolio() {

    try {

        const response = await fetch("/data.json");

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar data.json: HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (data.profile) {
            cargarPerfil(data.profile);
        }

        if (Array.isArray(data.skills)) {
            cargarSkills(data.skills);
        }

        if (Array.isArray(data.projects)) {
            cargarProyectos(data.projects);
        }

        cargarAño();

    } catch (error) {

        console.error(
            "Error cargando los datos del portfolio:",
            error
        );

    }
}


/* =========================
   PERFIL
========================= */

function cargarPerfil(profile) {

    const heroName =
        document.querySelector("#hero-name");

    if (heroName) {
        heroName.textContent = profile.name || "";
    }


    const heroDescription =
        document.querySelector("#hero-description");

    if (heroDescription) {
        heroDescription.textContent =
            profile.description || "";
    }


    const aboutContent =
        document.querySelector("#about-content");

    if (aboutContent) {

        aboutContent.innerHTML = `
            <p>${profile.about || ""}</p>
        `;
    }
}


/* =========================
   SKILLS
========================= */

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
                ${skill.category}
            </span>

            <h3>
                ${skill.name}
            </h3>

            <span class="skill-level">
                ${skill.level}
            </span>
        `;

        container.appendChild(card);
    });
}


/* =========================
   PROJECTS
========================= */

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


        const technologies =
            Array.isArray(project.technologies)
                ? project.technologies
                    .map(
                        (technology) =>
                            `<span class="tech">${technology}</span>`
                    )
                    .join("")
                : "";


        card.innerHTML = `
            <h3>
                ${project.title}
            </h3>

            <p>
                ${project.description}
            </p>

            <div class="project-tech">
                ${technologies}
            </div>

            <small>
                ${project.status}
            </small>
        `;

        container.appendChild(card);
    });
}


/* =========================
   YEAR
========================= */

function cargarAño() {

    const year =
        document.querySelector("#year");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }
}