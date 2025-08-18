import "dotenv/config";
//! TMP commented
// import { envSchema } from "../validation";

//! TMP added
if (!process.env.DATABASE_URL) {
  throw new Error("databaseUrl is not presented");
}

export const envVariables = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
};
