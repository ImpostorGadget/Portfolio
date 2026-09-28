document.addEventListener(`DOMContentLoaded`,()=>{e()});async function e(){try{let e=await fetch(`/data.json`);if(!e.ok)throw Error(`No se pudo cargar data.json: HTTP ${e.status}`);let a=await e.json();a.profile&&t(a.profile),Array.isArray(a.skills)&&n(a.skills),Array.isArray(a.projects)&&r(a.projects),Array.isArray(a.writeups)&&i(a.writeups),o()}catch(e){console.error(`Error cargando los datos del portfolio:`,e)}}function t(e){let t=document.querySelector(`#hero-name`);t&&(t.textContent=e.name||``);let n=document.querySelector(`#hero-description`);n&&(n.textContent=e.description||``);let r=document.querySelector(`#about-content`);r&&(r.innerHTML=`<p>${e.about||``}</p>`)}function n(e){let t=document.querySelector(`#skills-container`);t&&(t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`article`);n.className=`skill-card`,n.innerHTML=`

            <span class="skill-category">
                ${e.category}
            </span>

            <h3>
                ${e.name}
            </h3>

            <span class="skill-level">
                ${e.level}
            </span>

        `,t.appendChild(n)}))}function r(e){let t=document.querySelector(`#projects-container`);t&&(t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`article`);n.className=`project-card`;let r=Array.isArray(e.technologies)?e.technologies.map(e=>`<span class="tech">${e}</span>`).join(``):``,i=[];e.github&&e.github!==`#`&&i.push(`

                <a
                    href="${e.github}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    GitHub
                </a>

            `),e.demo&&e.demo!==`#`&&i.push(`

                <a
                    href="${e.demo}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link primary"
                >
                    Ver proyecto
                </a>

            `),n.innerHTML=`

            <h3>
                ${e.title}
            </h3>

            <p>
                ${e.description}
            </p>

            <div class="project-tech">
                ${r}
            </div>

            <small>
                ${e.status}
            </small>

            ${i.length?`
                        <div class="project-links">
                            ${i.join(``)}
                        </div>
                    `:``}

        `,t.appendChild(n)}))}function i(e){let t=document.querySelector(`#writeups-container`);if(t){if(t.innerHTML=``,e.length===0){t.innerHTML=`

            <p class="empty-state">
                No hay writeups disponibles actualmente.
            </p>

        `;return}e.forEach(e=>{let n=document.createElement(`article`);n.className=`writeup-card`;let r=Array.isArray(e.tools)?e.tools.map(e=>`<span class="tech">${e}</span>`).join(``):``,i=a(e.date);n.innerHTML=`

            <div class="writeup-card-header">

                <span class="writeup-category">
                    ${e.category||`Ciberseguridad`}
                </span>

                <span class="writeup-difficulty">
                    ${e.difficulty||``}
                </span>

            </div>


            <h2>
                ${e.title}
            </h2>


            <p>
                ${e.summary||``}
            </p>


            ${i?`
                        <div class="writeup-meta">
                            ${i}
                        </div>
                    `:``}


            ${r?`
                        <div class="project-tech">
                            ${r}
                        </div>
                    `:``}


            <div class="writeup-card-footer">

                <a
                    href="/writeups/${e.slug}.html"
                    class="project-link primary"
                >
                    Leer writeup
                </a>

            </div>

        `,t.appendChild(n)})}}function a(e){if(!e)return``;let t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(`es-ES`,{day:`2-digit`,month:`long`,year:`numeric`})}function o(){let e=document.querySelector(`#year`);e&&(e.textContent=new Date().getFullYear());function t(){let e=document.querySelectorAll(`.filter-btn`),t=document.getElementById(`writeups-container`),n=document.getElementById(`empty-state`),r=document.querySelector(`.writeups-toolbar h2`);e.length&&t&&e.forEach(i=>{i.addEventListener(`click`,()=>{e.forEach(e=>e.classList.remove(`active`)),i.classList.add(`active`);let a=i.dataset.filter,o=t.querySelectorAll(`.writeup-card`),s=0;o.forEach(e=>{let t=a===`all`||e.dataset.category===a;e.classList.toggle(`hidden`,!t),t&&s++}),n&&(n.hidden=s!==0),r&&(r.textContent=a===`all`?`Laboratorios y análisis`:`Laboratorios y análisis · ${i.textContent}`)})})}document.addEventListener(`DOMContentLoaded`,()=>{t()})}