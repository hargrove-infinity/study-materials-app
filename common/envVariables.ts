import "dotenv/config";
import { envSchema } from "../validation";

export const envVariables = envSchema.parse({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
});
