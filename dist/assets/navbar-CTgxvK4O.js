(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),document.addEventListener(`DOMContentLoaded`,()=>{let n=document.querySelector(`#navbar`);n&&(n.innerHTML=`

        <header class="header">

            <div class="container nav">

                <!-- LOGO -->

                <a
                    href="/index.html"
                    class="logo"
                >
                    AG<span>.</span>
                </a>


                <!-- NAVEGACIÓN -->

                <nav
                    class="navbar-menu"
                    aria-label="Navegación principal"
                >

                    <a
                        href="/index.html"
                        class="nav-link"
                        data-page="inicio"
                    >
                        Inicio
                    </a>

                    <a
                        href="/pages/stack.html"
                        class="nav-link"
                        data-page="stack"
                    >
                        Stack
                    </a>

                    <a
                        href="/pages/proyectos.html"
                        class="nav-link"
                        data-page="proyectos"
                    >
                        Proyectos
                    </a>

                    <a
                        href="/writeups/writeups.html"
                        class="nav-link"
                        data-page="writeups"
                    >
                        Writeups
                    </a>

                    <a
                        href="/cheatsheets/index.html"
                        class="nav-link"
                        data-page="cheatsheets"
                    >
                        Cheatsheets
                    </a>

                    <a
                        href="/pages/sobre-mi.html"
                        class="nav-link"
                        data-page="sobre-mi"
                    >
                        Sobre mí
                    </a>

                </nav>


                <!-- GITHUB -->

                <div class="navbar-actions">

                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="github-link"
                    >
                        GitHub
                    </a>

                </div>


                <!-- MENÚ MÓVIL -->

                <button
                    id="navbar-toggle"
                    class="navbar-toggle"
                    type="button"
                    aria-label="Abrir menú"
                    aria-expanded="false"
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

            </div>

        </header>

    `,e(),t())});function e(){let e=window.location.pathname,t=`inicio`;e.includes(`/pages/stack`)?t=`stack`:e.includes(`/pages/proyectos`)?t=`proyectos`:e.includes(`/pages/sobre-mi`)?t=`sobre-mi`:e.includes(`/writeups`)?t=`writeups`:e.includes(`/cheatsheets`)&&(t=`cheatsheets`);let n=document.querySelector(`[data-page="${t}"]`);n&&n.classList.add(`active`)}function t(){let e=document.querySelector(`#navbar-toggle`),t=document.querySelector(`.navbar-menu`);e&&t&&(e.addEventListener(`click`,()=>{let n=t.classList.toggle(`active`);e.setAttribute(`aria-expanded`,n),e.setAttribute(`aria-label`,n?`Cerrar menú`:`Abrir menú`)}),t.querySelectorAll(`.nav-link`).forEach(n=>{n.addEventListener(`click`,()=>{t.classList.remove(`active`),e.setAttribute(`aria-expanded`,`false`),e.setAttribute(`aria-label`,`Abrir menú`)})}))}