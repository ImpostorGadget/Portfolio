// js/cheatsheets.js
import data from "../data/cheatsheets.json";

document.addEventListener("DOMContentLoaded", cargarCheatsheets);

function cargarCheatsheets() {
    const grid = document.getElementById("cheatsheets-grid");
    if (!grid) return;

    // Acepta tanto { cheatsheets: [...] } como { secciones: [...] }
    const lista = data.cheatsheets || data.secciones || [];

    if (!lista.length) {
        grid.innerHTML = `<p class="loading">No hay cheatsheets disponibles.</p>`;
        return;
    }

    grid.innerHTML = "";
    lista.forEach(item => grid.appendChild(crearTarjeta(item)));
}

function crearTarjeta(item) {
    const card = document.createElement("article");
    card.className = "cheatsheet-card";

    card.innerHTML = `
        <button class="cheatsheet-toggle">
            <h3>${item.titulo}</h3>
            <span class="cheatsheet-count">${(item.comandos || []).length}</span>
        </button>
        <ul class="cheatsheet-list">
            ${(item.comandos || []).map(c => `
                <li class="cheatsheet-item">
                    <code class="cheatsheet-command">${c.comando}</code>
                    <span class="cheatsheet-desc">${c.descripcion}</span>
                </li>`).join("")}
        </ul>`;

    card.querySelector(".cheatsheet-toggle").addEventListener("click", () => {
        card.classList.toggle("open");
    });

    return card;
}