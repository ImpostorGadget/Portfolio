document.addEventListener("DOMContentLoaded", () => {

    const navbarContainer =
        document.querySelector("#navbar");

    if (!navbarContainer) {
        return;
    }


    navbarContainer.innerHTML = `

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

    `;


    activarPaginaActual();
    activarMenuMovil();

});


/* =========================
   PÁGINA ACTUAL
========================= */

function activarPaginaActual() {

    const path =
        window.location.pathname;

    let pagina = "inicio";


    if (path.includes("/pages/stack")) {

        pagina = "stack";

    } else if (path.includes("/pages/proyectos")) {

        pagina = "proyectos";

    } else if (path.includes("/pages/sobre-mi")) {

        pagina = "sobre-mi";

    } else if (path.includes("/writeups")) {

        pagina = "writeups";

    } else if (path.includes("/cheatsheets")) {

        pagina = "cheatsheets";
    }


    const enlace =
        document.querySelector(
            `[data-page="${pagina}"]`
        );


    if (enlace) {

        enlace.classList.add("active");

    }

}


/* =========================
   MENÚ MÓVIL
========================= */

function activarMenuMovil() {

    const button =
        document.querySelector("#navbar-toggle");

    const menu =
        document.querySelector(".navbar-menu");


    if (!button || !menu) {
        return;
    }


    button.addEventListener("click", () => {

        const abierto =
            menu.classList.toggle("active");


        button.setAttribute(
            "aria-expanded",
            abierto
        );


        button.setAttribute(
            "aria-label",
            abierto
                ? "Cerrar menú"
                : "Abrir menú"
        );

    });


    const enlaces =
        menu.querySelectorAll(".nav-link");


    enlaces.forEach((enlace) => {

        enlace.addEventListener("click", () => {

            menu.classList.remove("active");


            button.setAttribute(
                "aria-expanded",
                "false"
            );


            button.setAttribute(
                "aria-label",
                "Abrir menú"
            );

        });

    });

}