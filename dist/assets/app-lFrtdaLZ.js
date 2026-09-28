document.addEventListener(`DOMContentLoaded`,()=>{e()});async function e(){try{let e=await fetch(`/data.json`);if(!e.ok)throw Error(`No se pudo cargar data.json: HTTP ${e.status}`);let a=await e.json();a.profile&&t(a.profile),Array.isArray(a.skills)&&n(a.skills),Array.isArray(a.projects)&&r(a.projects),i()}catch(e){console.error(`Error cargando los datos del portfolio:`,e)}}function t(e){let t=document.querySelector(`#hero-name`);t&&(t.textContent=e.name||``);let n=document.querySelector(`#hero-description`);n&&(n.textContent=e.description||``);let r=document.querySelector(`#about-content`);r&&(r.innerHTML=`
            <p>${e.about||``}</p>
        `)}function n(e){let t=document.querySelector(`#skills-container`);t&&(t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`article`);n.className=`skill-card`,n.innerHTML=`
            <span class="skill-category">
                ${e.category}
            </span>

            <h3>
                ${e.name}
            </h3>

            <span class="skill-level">
                ${e.level}
            </span>
        `,t.appendChild(n)}))}function r(e){let t=document.querySelector(`#projects-container`);t&&(t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`article`);n.className=`project-card`;let r=Array.isArray(e.technologies)?e.technologies.map(e=>`<span class="tech">${e}</span>`).join(``):``;n.innerHTML=`
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
        `,t.appendChild(n)}))}function i(){let e=document.querySelector(`#year`);e&&(e.textContent=new Date().getFullYear())}