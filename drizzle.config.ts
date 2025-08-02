import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { envVariables } from "./common";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: envVariables.databaseUrl },
});
