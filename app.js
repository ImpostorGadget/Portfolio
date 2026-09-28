document.addEventListener("DOMContentLoaded", () => {

    cargarPortfolio();

});


async function cargarPortfolio() {

    try {

        const response = await fetch("./data.json");

        const data = await response.json();

        cargarPerfil(data.profile);

        cargarSkills(data.skills);

        cargarProyectos(data.projects);

        cargarAño();

    } catch (error) {

        console.error(
            "Error cargando los datos:",
            error
        );

    }

}


/* =========================
   PERFIL
========================= */

function cargarPerfil(profile) {

    document.querySelector("#hero-name")
        .textContent = profile.name;


    document.querySelector("#hero-description")
        .textContent = profile.description;


    document.querySelector("#about-content")
        .innerHTML = `
            <p>
                ${profile.about}
            </p>
        `;

}


/* =========================
   SKILLS
========================= */

function cargarSkills(skills) {

    const container =
        document.querySelector(
            "#skills-container"
        );


    container.innerHTML = "";


    skills.forEach(skill => {

        const card =
            document.createElement("article");


        card.classList.add(
            "skill-card"
        );


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
        document.querySelector(
            "#projects-container"
        );


    container.innerHTML = "";


    projects.forEach(project => {

        const card =
            document.createElement("article");


        card.classList.add(
            "project-card"
        );


        const technologies =
            project.technologies
                .map(
                    tech =>
                        `<span class="tech">${tech}</span>`
                )
                .join("");


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

    document.querySelector("#year")
        .textContent =
        new Date().getFullYear();

}

