import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { ENV } from "../common";
import * as schema from "./schema";

const sql = neon(ENV.DatabaseUrl);
export const db = drizzle({ client: sql, schema });
