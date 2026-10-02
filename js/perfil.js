/* =========================================================
   ÁNGEL GARCÍA — PERFIL
   Carga el perfil desde data.json y lo pinta en el hero.
========================================================= */

import data from "../data/data.json";


document.addEventListener("DOMContentLoaded", cargarPerfil);


function cargarPerfil() {
    const profile = data.profile;

    if (!profile) {
        console.warn("No hay 'profile' en data.json");
        return;
    }

    console.log("Perfil cargado:", profile);

    /* Nombre */

    const heroName = document.querySelector("#hero-name");

    if (heroName) {
        /* Mantener el cursor parpadeante si existe */
        const cursor = heroName.querySelector(".terminal-logo-cursor");

        heroName.textContent = profile.name || "";

        if (cursor) {
            heroName.appendChild(cursor);
        }
    }

    /* Rol */

    const heroRole = document.querySelector("#hero-role");

    if (heroRole) {
        heroRole.textContent = profile.role || "";
    }

    /* Descripción */

    const heroDescription = document.querySelector("#hero-description");

    if (heroDescription) {
        heroDescription.textContent = profile.description || "";
    }

    /* About (sobre mí) */

    const aboutContent = document.querySelector("#about-content");

    if (aboutContent) {
        aboutContent.innerHTML = `
            <p>${profile.about || ""}</p>
        `;
    }

    /* Datos técnicos */

    const currently = document.querySelector("#profile-currently");

    if (currently) {
        currently.textContent = profile.currently || "";
    }

    const specialization = document.querySelector("#profile-specialization");

    if (specialization) {
        specialization.textContent = profile.specialization || "";
    }

    const base = document.querySelector("#profile-base");

    if (base) {
        base.textContent = profile.base || "";
    }

    const objective = document.querySelector("#profile-objective");

    if (objective) {
        objective.textContent = profile.objective || "";
    }
}