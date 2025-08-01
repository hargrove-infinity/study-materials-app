import { EnvSchema } from "../validation";

export const ENV = EnvSchema.parse({
  Port: process.env.PORT,
  DatabaseUrl: process.env.DATABASE_URL,
});
