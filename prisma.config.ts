import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

const databaseUrl = process.env.DATABASE_URL;

// Determine if we're using PostgreSQL or SQLite
const isPostgres = databaseUrl?.startsWith("postgresql://") || databaseUrl?.startsWith("postgres://");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: isPostgres 
      ? databaseUrl 
      : (process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "prisma", "dev.db")}`),
  },
});
