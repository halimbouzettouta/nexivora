import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { ranks } from "@db/schema";
import { asc } from "drizzle-orm";

export const rankRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(ranks).orderBy(asc(ranks.orderIdx));
  }),
});
