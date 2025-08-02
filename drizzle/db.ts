import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../common";
import * as schema from "./schema";

const sql = neon(env.databaseUrl);
export const db = drizzle({ client: sql, schema });
