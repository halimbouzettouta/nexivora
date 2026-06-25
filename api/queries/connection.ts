import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;
let dbUnavailable = false;

// Check if DB URL uses a private endpoint that won't work on Render
const isPrivateEndpoint = env.databaseUrl.includes("privatelink") || 
                          env.databaseUrl.includes("private.") ||
                          env.databaseUrl.includes("internal.");

export function getDb() {
  if (dbUnavailable || isPrivateEndpoint) {
    throw new Error("Database unavailable: private endpoint not accessible from this server");
  }
  if (!instance) {
    try {
      instance = drizzle(env.databaseUrl, {
        mode: "planetscale",
        schema: fullSchema,
      });
    } catch {
      dbUnavailable = true;
      throw new Error("Database connection failed");
    }
  }
  return instance;
}

export function markDbUnavailable() {
  dbUnavailable = true;
}
