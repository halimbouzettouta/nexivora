import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { ranks } from "@db/schema";
import { seedData } from "./data-seed";
import { asc } from "drizzle-orm";

async function withFallback<T>(dbFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await dbFn();
  } catch {
    return fallback;
  }
}

export const rankRouter = createRouter({
  list: publicQuery.query(async () => {
    return withFallback(async () => {
      const db = getDb();
      return db.select().from(ranks).orderBy(asc(ranks.orderIdx));
    }, seedData.ranks.sort((a: any, b: any) => (a.orderIdx || 0) - (b.orderIdx || 0)));
  }),
});
