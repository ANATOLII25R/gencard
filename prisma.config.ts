import { defineConfig } from '@prisma/config'

// Hardcoded for absolute certainty during development and CLI commands (migration/db push)
const DB_URL = "postgresql://neondb_owner:npg_aCf6pwy5IRgr@ep-silent-star-a9xejj2y-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: DB_URL,
  },
})
