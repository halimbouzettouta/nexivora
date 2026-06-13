import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";

export const referralRouter = createRouter({
  // Validate a referral code and return referrer info
  validate: publicQuery
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      const referrer = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.referralCode, input.code))
        .limit(1);

      const user = referrer[0];
      if (!user) {
        return { valid: false, referrer: null };
      }

      return {
        valid: true,
        referrer: {
          id: user.id,
          name: user.name || "E-Ride Marketer",
          referralCode: user.referralCode,
          rank: user.rankId,
        },
      };
    }),

  // Get network tree for a user (downline)
  getNetwork: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const allUsers = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.parentId, input.userId));

      return allUsers.map((u) => ({
        id: u.id,
        name: u.name || "Anonymous",
        role: u.role,
        rankId: u.rankId,
        createdAt: u.createdAt,
      }));
    }),

  // Get user's referrer chain (upline)
  getUpline: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const upline = [];
      let currentId = input.userId;
      let depth = 0;
      const maxDepth = 10; // Prevent infinite loops

      while (currentId && depth < maxDepth) {
        const users = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, currentId))
          .limit(1);

        if (!users[0]) break;

        const user = users[0];
        if (user.parentId) {
          const parents = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, user.parentId))
            .limit(1);

          if (parents[0]) {
            upline.push({
              id: parents[0].id,
              name: parents[0].name || "Anonymous",
              rankId: parents[0].rankId,
              level: depth + 1,
            });
          }
          currentId = user.parentId;
        } else {
          break;
        }
        depth++;
      }

      return upline;
    }),

  // Get stats for a referrer
  getStats: publicQuery
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      const referrer = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.referralCode, input.code))
        .limit(1);

      const user = referrer[0];
      if (!user) {
        return { valid: false, stats: null };
      }

      // Count direct referrals
      const directReferrals = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.parentId, user.id));

      // Count total team (recursive)
      const allUsers = await db.select().from(schema.users);
      let totalTeam = 0;

      function countDownline(parentId: number, visited: Set<number> = new Set()) {
        for (const u of allUsers) {
          if (u.parentId === parentId && !visited.has(u.id)) {
            visited.add(u.id);
            totalTeam++;
            countDownline(u.id, visited);
          }
        }
      }
      countDownline(user.id);

      return {
        valid: true,
        stats: {
          directCount: directReferrals.length,
          totalTeam,
          referrerName: user.name || "E-Ride Marketer",
        },
      };
    }),
});
