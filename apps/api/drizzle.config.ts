import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.development" });

const databaseUrl = process.env.DATABASE_URL;
const password = process.env.PGPASSWORD;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!password) {
  throw new Error("PGPASSWORD is required");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
    password,
  },
  strict: true,
  verbose: true,
});
