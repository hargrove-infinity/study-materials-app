import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { envVariables } from "../common";
import * as schema from "./schema";

const sql = neon(envVariables.databaseUrl);
export const db = drizzle({ client: sql, schema });
