import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;
let dbAvailable: boolean | null = null;

export function getDb() {
  // If we already know DB is unavailable, fail fast
  if (dbAvailable === false) {
    throw new Error("Database unavailable");
  }
  if (!instance) {
    // Add connection timeout via URL parameter
    const url = env.databaseUrl.includes("?")
      ? `${env.databaseUrl}&connectTimeout=3000`
      : `${env.databaseUrl}?connectTimeout=3000`;
    instance = drizzle(url, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}

// Mark DB as unavailable so fallback triggers
export function markDbUnavailable() {
  dbAvailable = false;
}
