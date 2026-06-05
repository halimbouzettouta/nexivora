import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { dealers } from "@db/schema";
import { eq, like } from "drizzle-orm";
import { z } from "zod";

export const dealerRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(dealers).where(eq(dealers.status, "active"));
  }),

  getByCity: publicQuery
    .input(z.object({ city: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(dealers).where(eq(dealers.city, input.city));
    }),

  search: publicQuery
    .input(z.object({ q: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(dealers).where(like(dealers.name, `%${input.q}%`));
    }),
});
