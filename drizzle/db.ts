import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { envVariables } from "../common";
import * as schema from "./schema";

const pool = new Pool({ connectionString: envVariables.databaseUrl });
export const db = drizzle(pool, { schema });
