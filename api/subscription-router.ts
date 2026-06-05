import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { subscriptionPlans } from "@db/schema";
import { eq } from "drizzle-orm";

export const subscriptionRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(subscriptionPlans).where(eq(subscriptionPlans.status, "active"));
  }),
});
