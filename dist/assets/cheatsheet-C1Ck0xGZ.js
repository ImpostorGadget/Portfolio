document.addEventListener(`DOMContentLoaded`,n);var e=[`../data/cheatsheets.json`];function t(e){return String(e||``).toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}async function n(){let n=document.querySelector(`#cheatsheet-detail`),a=document.querySelector(`#cheatsheet-filters`);if(!n)return;let o=null;for(let t of e)try{let e=await fetch(t);if(e.ok){let t=await e.text();if(t.trim().startsWith(`<`))continue;o=JSON.parse(t);break}}catch{}if(!o){n.innerHTML=`<p class="error-state">No se pudo cargar la cheatsheet.</p>`;return}let s=window.location.pathname.split(`/`).pop().replace(`.html`,``),c=(o.secciones||[]).filter(e=>t(e.categoria)===s);if(!c.length){n.innerHTML=`<p class="empty-state">No hay comandos para esta categoría.</p>`;return}let l=c[0].categoria,u=document.querySelector(`#cheatsheet-title`),d=document.querySelector(`#cheatsheet-subtitle`);if(u&&(u.textContent=l),d){let e=c.reduce((e,t)=>e+(t.comandos||[]).length,0);d.textContent=`${c.length} secciones · ${e} comandos`}a&&i(c,n,a,s),r(c,n,s)}function r(e,t,n){t.innerHTML=``,e.forEach(e=>{t.appendChild(a(e,n))})}function i(e,n,i,a){i.innerHTML=``;let o=document.createElement(`button`);o.className=`cheatsheet-filter-btn active`,o.dataset.filter=`all`,o.type=`button`,o.textContent=`Todos`,i.appendChild(o),e.forEach(e=>{let n=document.createElement(`button`);n.className=`cheatsheet-filter-btn`,n.dataset.filter=t(e.titulo),n.type=`button`,n.textContent=e.titulo,i.appendChild(n)});let s=i.querySelectorAll(`.cheatsheet-filter-btn`);s.forEach(i=>{i.addEventListener(`click`,()=>{s.forEach(e=>e.classList.remove(`active`)),i.classList.add(`active`);let o=i.dataset.filter,c=o===`all`?e:e.filter(e=>t(e.titulo)===o);r(c,n,a);let l=document.querySelector(`#cheatsheet-subtitle`);if(l){let e=c.reduce((e,t)=>e+(t.comandos||[]).length,0);l.textContent=o===`all`?`${c.length} secciones · ${e} comandos`:`${c[0].titulo} · ${e} comandos`}})})}function a(e,n){let r=document.createElement(`article`);r.className=`cheatsheet-card cheatsheet-card-full`;let i=`/cheatsheets/detalle/${n}/${t(e.titulo)}.html`;return(e.comandos||[]).length,r.innerHTML=`
        <div class="cheatsheet-header-row">

            <h3 class="cheatsheet-title-row">${e.titulo||``}</h3>

            <div class="cheatsheet-header-meta">

                <a href="${i}" class="cheatsheet-read-more-inline">
                    Leer más →
                </a>

            </div>

        </div>
    `,r}