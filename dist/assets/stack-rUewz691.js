/* empty css               */import"./modulepreload-polyfill-P2Xu9kJm.js";var e={Frontend:`Interfaces y experiencia de usuario`,Backend:`Servidores, APIs y bases de datos`,Programación:`Lenguajes y paradigmas`,Scripting:`Automatización y utilidades`,Ciberseguridad:`Ofensiva, análisis y auditoría`,Sistemas:`Sistemas operativos e infraestructura`,"Bases de datos":`Almacenamiento y consultas`,Herramientas:`Utilidades del día a día`,DevOps:`Despliegue y contenedores`,Redes:`Protocolos, servicios y seguridad`,Virtualización:`Máquinas virtuales y entornos`,IA:`Inteligencia artificial y herramientas generativas`};document.addEventListener(`DOMContentLoaded`,t);async function t(){let e=document.getElementById(`stack-container`);if(!e){console.error(`No existe #stack-container en el HTML`);return}try{let t=await fetch(`/data/skills.json`);if(!t.ok)throw Error(`HTTP ${t.status}`);let r=await t.json();if(!Array.isArray(r)||!r.length){e.innerHTML=`
                <p class="empty-state">No hay stack disponible.</p>
            `;return}let i={};r.forEach(e=>{let t=e.category||`Otros`;i[t]||(i[t]=[]),i[t].push(e)}),n(i,e)}catch(t){console.error(`Error cargando stack:`,t),e.innerHTML=`
            <p class="error-state">
                No se pudo cargar el stack.
            </p>
        `}}function n(t,n){n.innerHTML=``,Object.entries(t).forEach(([t,i],a)=>{if(!Array.isArray(i))return;let o=e[t]||``,s=document.createElement(`section`);s.className=`stack-category`;let c=document.createElement(`button`);c.className=`stack-category-toggle`,c.type=`button`,c.innerHTML=`
            <span class="stack-category-title">
                <span class="stack-category-label">${t}</span>
                ${o?`<span class="stack-category-desc">${o}</span>`:``}
            </span>

            <span class="stack-category-meta">
                <span class="stack-category-count">${i.length}</span>
                <span class="stack-category-chevron">+</span>
            </span>
        `;let l=document.createElement(`div`);l.className=`stack-category-body`;let u=document.createElement(`div`);u.className=`stack-group-items`,i.forEach(e=>{u.appendChild(r(e))}),l.appendChild(u),c.addEventListener(`click`,()=>{s.classList.toggle(`open`)}),s.appendChild(c),s.appendChild(l),n.appendChild(s)})}function r(e){let t=document.createElement(`article`);return t.className=`stack-card`,t.innerHTML=`
        <h3>${e.name||``}</h3>
        <span class="stack-level">${e.level||``}</span>
    `,t}