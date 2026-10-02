import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ = path.resolve(__dirname, "..");


console.log("");
console.log("=========================================");
console.log("🔍 Verificando data.json");
console.log("=========================================");
console.log("");


/* Rutas candidatas */

const candidatas = [
    path.join(RAIZ, "public", "data.json"),
    path.join(RAIZ, "data.json"),
    path.join(RAIZ, "data", "data.json"),
    path.join(RAIZ, "public", "data", "data.json"),
    path.join(RAIZ, "js", "data.json")
];


console.log("Buscando data.json en:");

candidatas.forEach((ruta) => {
    const relativa = path.relative(RAIZ, ruta);

    if (fs.existsSync(ruta)) {
        console.log(`   ✅ ${relativa}`);
    } else {
        console.log(`   ❌ ${relativa}`);
    }
});


/* Recomendación */

console.log("");
console.log("=========================================");
console.log("📁 Ubicación correcta:");
console.log("   public/data.json");
console.log("=========================================");
console.log("");
console.log("Ruta completa esperada:");
console.log(`   ${path.join(RAIZ, "public", "data.json")}`);
console.log("");


/* Comprobar la carpeta public */

const publicDir = path.join(RAIZ, "public");

if (!fs.existsSync(publicDir)) {
    console.log("❌ La carpeta public/ NO existe.");
    console.log("   → Créala manualmente o ejecuta:");
    console.log(`   mkdir "${publicDir}"`);
    console.log("");
} else {
    console.log("✅ La carpeta public/ existe.");

    const archivosPublic = fs.readdirSync(publicDir);
    console.log(`   Contenido: ${archivosPublic.join(", ") || "(vacía)"}`);
    console.log("");
}


/* Si el JSON está en otro sitio, avisar */

const jsonEnPublic = path.join(publicDir, "data.json");

if (fs.existsSync(jsonEnPublic)) {
    console.log("✅ public/data.json EXISTE. Reinicia Vite:");
    console.log("   Ctrl+C  →  npm run dev");
} else {
    console.log("❌ public/data.json NO existe.");
    console.log("");
    console.log("Muévelo a esa ruta o vuelve a crearlo.");
}
console.log("");