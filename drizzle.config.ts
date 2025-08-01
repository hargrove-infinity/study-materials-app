import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { ENV } from "./common";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: ENV.DatabaseUrl },
});
