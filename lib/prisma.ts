import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Standard Node.js pg adapter - works correctly in Server Actions
// @neondatabase/serverless is an Edge-only WebSocket driver, not for Node.js
const DB_URL =
  "postgresql://neondb_owner:npg_aCf6pwy5IRgr@ep-silent-star-a9xejj2y-pooler.gwc.azure.neon.tech/neondb?sslmode=require";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makePrismaClient() {
  const pool = new Pool({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
