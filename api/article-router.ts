import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { articles } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

export const articleRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(20).default(10),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { category, page, limit } = input || {};
      const pageNum = page || 1;
      const limitNum = limit || 10;

      const conditions = [eq(articles.status, "published")];
      if (category && category !== "all") {
        conditions.push(eq(articles.category, category));
      }

      const allItems = await db.select().from(articles)
        .where(and(...conditions))
        .orderBy(desc(articles.publishedAt));
      
      const items = allItems.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return { items, total: allItems.length };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(articles).where(eq(articles.slug, input.slug));
      return result[0] || null;
    }),

  getByCategory: publicQuery
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(articles)
        .where(and(eq(articles.status, "published"), eq(articles.category, input.category)))
        .orderBy(desc(articles.publishedAt));
    }),
});
