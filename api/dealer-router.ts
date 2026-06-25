import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { dealers } from "@db/schema";
import { seedData } from "./data-seed";
import { eq, like } from "drizzle-orm";
import { z } from "zod";

async function withFallback<T>(dbFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await dbFn();
  } catch {
    return fallback;
  }
}

export const dealerRouter = createRouter({
  list: publicQuery.query(async () => {
    return withFallback(async () => {
      const db = getDb();
      return db.select().from(dealers).where(eq(dealers.status, "active"));
    }, seedData.dealers.filter((d: any) => d.status === "active"));
  }),

  getByCity: publicQuery
    .input(z.object({ city: z.string() }))
    .query(async ({ input }) => {
      return withFallback(async () => {
        const db = getDb();
        return db.select().from(dealers).where(eq(dealers.city, input.city));
      }, seedData.dealers.filter((d: any) => d.city?.toLowerCase() === input.city.toLowerCase()));
    }),

  search: publicQuery
    .input(z.object({ q: z.string() }))
    .query(async ({ input }) => {
      return withFallback(async () => {
        const db = getDb();
        return db.select().from(dealers).where(like(dealers.name, `%${input.q}%`));
      }, seedData.dealers.filter((d: any) => d.name?.toLowerCase().includes(input.q.toLowerCase())));
    }),
});
