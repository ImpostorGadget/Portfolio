import { defineConfig } from "vite";
import { resolve } from "path";

const root = __dirname;

export default defineConfig({
    root,
    publicDir: "public",  // ⬅️ CLAVE: NO false

    appType: "mpa",

    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(root, "index.html"),
                stack: resolve(root, "pages/stack.html"),
                proyectos: resolve(root, "pages/proyectos.html"),
                tools: resolve(root, "pages/tools.html"),
                sobreMi: resolve(root, "pages/sobre-mi.html"),
                cheatsheets: resolve(root, "cheatsheets/index.html"),
                cheatsheetGit: resolve(root, "cheatsheets/git.html"),
                cheatsheetLinux: resolve(root, "cheatsheets/linux.html"),
                cheatsheetJavaScript: resolve(root, "cheatsheets/javascript.html"),
                cheatsheetPHP: resolve(root, "cheatsheets/php.html"),
                cheatsheetSysAdmin: resolve(root, "cheatsheets/sysadmin.html"),
                cheatsheetCybersecurity: resolve(root, "cheatsheets/cybersecurity.html"),
                writeups: resolve(root, "writeups/writeups.html")
            }
        }
    }
});