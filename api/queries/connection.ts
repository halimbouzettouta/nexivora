import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;
let connectionFailed = false;

export function getDb() {
  if (connectionFailed) {
    throw new Error("Database connection previously failed");
  }
  if (!instance) {
    try {
      instance = drizzle(env.databaseUrl, {
        mode: "planetscale",
        schema: fullSchema,
      });
    } catch {
      connectionFailed = true;
      throw new Error("Database connection failed");
    }
  }
  return instance;
}
