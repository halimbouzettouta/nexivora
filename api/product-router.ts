import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, categories } from "@db/schema";
import { seedData } from "./data-seed";
import { eq, like, and, desc, asc } from "drizzle-orm";
import { z } from "zod";

// Helper: try DB, fallback to seed data
async function withFallback<T>(dbFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await dbFn();
  } catch {
    return fallback;
  }
}

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["featured", "price_asc", "price_desc", "rating"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(12),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { category, search, sortBy, page, limit } = input || {};
      const pageNum = page || 1;
      const limitNum = limit || 12;
      const offset = (pageNum - 1) * limitNum;

      try {
        let query = db.select().from(products);

        const conditions = [];
        if (category && category !== "all") {
          const cat = await db.select().from(categories).where(eq(categories.slug, category));
          if (cat[0]) {
            conditions.push(eq(products.categoryId, cat[0].id));
          }
        }
        if (search) {
          conditions.push(like(products.name, `%${search}%`));
        }

        let finalQuery;
        if (conditions.length > 0) {
          finalQuery = query.where(and(...conditions));
        } else {
          finalQuery = query;
        }

        // Sorting
        if (sortBy === "price_asc") {
          finalQuery = finalQuery.orderBy(asc(products.price));
        } else if (sortBy === "price_desc") {
          finalQuery = finalQuery.orderBy(desc(products.price));
        } else if (sortBy === "rating") {
          finalQuery = finalQuery.orderBy(desc(products.rating));
        } else {
          finalQuery = finalQuery.orderBy(desc(products.createdAt));
        }

        const allItems = await finalQuery;
        const items = allItems.slice(offset, offset + limitNum);

        return {
          items,
          total: allItems.length,
          page: pageNum,
          totalPages: Math.ceil(allItems.length / limitNum),
        };
      } catch {
        // Fallback to seed data when DB is unreachable
        let allItems = seedData.products;
        if (category && category !== "all") {
          const cat = seedData.categories.find((c: any) => c.slug === category);
          if (cat) allItems = allItems.filter((p: any) => p.categoryId === cat.id);
        }
        if (search) {
          allItems = allItems.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (sortBy === "price_asc") {
          allItems.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === "price_desc") {
          allItems.sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortBy === "rating") {
          allItems.sort((a: any, b: any) => parseFloat(b.rating) - parseFloat(a.rating));
        }
        const items = allItems.slice(offset, offset + limitNum);
        return {
          items,
          total: allItems.length,
          page: pageNum,
          totalPages: Math.ceil(allItems.length / limitNum),
        };
      }
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return withFallback(async () => {
        const db = getDb();
        const result = await db.select().from(products).where(eq(products.id, input.id));
        return result[0] || null;
      }, seedData.products.find((p: any) => p.id === input.id) || null);
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return withFallback(async () => {
        const db = getDb();
        const result = await db.select().from(products).where(like(products.name, `%${input.slug.replace(/-/g, "")}%`));
        return result[0] || null;
      }, seedData.products.find((p: any) => p.slug === input.slug) || seedData.products.find((p: any) => p.name.toLowerCase().includes(input.slug.replace(/-/g, " ").toLowerCase())) || null);
    }),

  getFeatured: publicQuery.query(async () => {
    return withFallback(async () => {
      const db = getDb();
      return db.select().from(products).where(eq(products.status, "active")).orderBy(desc(products.rating)).limit(6);
    }, seedData.products.filter((p: any) => p.status === "active").sort((a: any, b: any) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 6));
  }),

  categories: publicQuery.query(async () => {
    return withFallback(async () => {
      const db = getDb();
      return db.select().from(categories);
    }, seedData.categories);
  }),
});
