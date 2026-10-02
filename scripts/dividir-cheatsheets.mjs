import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");

const ORIGEN = path.join(RAIZ, "data", "cheatsheets.json");
const DESTINO = path.join(RAIZ, "public", "data", "cheatsheets");


function slugify(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


function escribir(ruta, datos) {
    const dir = path.dirname(ruta);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 4), "utf-8");
}


function main() {

    if (!fs.existsSync(ORIGEN)) {
        console.error(`❌ No existe: ${ORIGEN}`);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(ORIGEN, "utf-8"));
    const secciones = data.secciones || [];

    /* Agrupar por categoría */

    const porCategoria = {};

    secciones.forEach((sec) => {
        const cat = sec.categoria || "Otros";
        if (!porCategoria[cat]) porCategoria[cat] = [];
        porCategoria[cat].push(sec);
    });


    /* Contadores */

    let totalJson = 0;
    const indice = { categorias: [] };


    /* -----------------------------------------
       1. Por cada categoría
    ----------------------------------------- */

    Object.entries(porCategoria).forEach(([categoria, subcats]) => {

        const slugCategoria = slugify(categoria);

        /* --- A. JSON de la categoría (para cybersecurity.html) --- */

        const jsonCategoria = {
            categoria,
            subcategorias: subcats.map((s) => ({
                slug: slugify(s.titulo),
                titulo: s.titulo,
                total: (s.comandos || []).length
            }))
        };

        escribir(
            path.join(DESTINO, `${slugCategoria}.json`),
            jsonCategoria
        );

        totalJson++;


        /* --- B. Por cada subcategoría --- */

        subcats.forEach((sub) => {

            const slugSub = slugify(sub.titulo);

            /* JSON de la subcategoría (para recon.html) */

            const jsonSub = {
                categoria,
                subcategoria: sub.titulo,
                comandos: (sub.comandos || []).map((c) => ({
                    slug: slugify(c.comando),
                    comando: c.comando,
                    descripcion: c.descripcion || ""
                }))
            };

            escribir(
                path.join(DESTINO, slugCategoria, `${slugSub}.json`),
                jsonSub
            );

            totalJson++;


            /* JSON de cada comando (para nmap.html) */

            (sub.comandos || []).forEach((cmd) => {

                const slugCmd = slugify(cmd.comando);

                const jsonCmd = {
                    comando: cmd.comando,
                    descripcion: cmd.descripcion || "",
                    sintaxis: "",
                    ejemplos: [],
                    flags: [],
                    notas: ""
                };

                escribir(
                    path.join(DESTINO, slugCategoria, slugSub, `${slugCmd}.json`),
                    jsonCmd
                );

                totalJson++;
            });
        });


        /* Añadir al índice */

        indice.categorias.push({
            slug: slugCategoria,
            nombre: categoria,
            descripcion: "",
            subcategorias: subcats.length,
            comandos: subcats.reduce((a, s) => a + (s.comandos || []).length, 0)
        });
    });


    /* -----------------------------------------
       2. Índice global
    ----------------------------------------- */

    escribir(
        path.join(DESTINO, "_index.json"),
        indice
    );

    totalJson++;


    /* -----------------------------------------
       Resumen
    ----------------------------------------- */

    console.log("");
    console.log("=========================================");
    console.log("✅ JSONs generados");
    console.log("=========================================");
    console.log(`Categorías:    ${Object.keys(porCategoria).length}`);
    console.log(`Archivos JSON: ${totalJson}`);
    console.log(`Ruta:          public/data/cheatsheets/`);
    console.log("=========================================");
}


main();