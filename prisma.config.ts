import { defineConfig } from "@prisma/config";
import { config } from "dotenv";
import { resolve } from "node:path";

// Prisma CLI non carica .env.local di default
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL mancante: copia .env.example in .env.local e imposta DATABASE_URL (Neon)."
  );
}

export default defineConfig({
  datasource: { url },
});
