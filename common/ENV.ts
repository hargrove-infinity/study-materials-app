import { envSchema } from "../validation";

export const env = envSchema.parse({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
});
