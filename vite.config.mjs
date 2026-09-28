import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    publicDir: "public",

    build: {
        rollupOptions: {
            input: {
                main: resolve(process.cwd(), "index.html"),
                stack: resolve(process.cwd(), "pages/stack.html"),
                proyectos: resolve(process.cwd(), "pages/proyectos.html"),
                sobreMi: resolve(process.cwd(), "pages/sobre-mi.html"),
                cheatsheets: resolve(
                    process.cwd(),
                    "cheatsheets/index.html"
                ),
            },
        },
    },
});