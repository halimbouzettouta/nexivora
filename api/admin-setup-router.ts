import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

/**
 * Admin Setup Router - Development/Deployment helper
 * 
 * These endpoints help manage user roles during setup.
 * In production, adminQuery middleware would protect these.
 */
export const adminSetupRouter = createRouter({
  /**
   * List all users (for finding who to promote)
   * GET: /api/trpc/adminSetup.listUsers
   */
  listUsers: publicQuery.query(async () => {
    const db = getDb();
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    }).from(users);
    return allUsers;
  }),

  /**
   * Promote a user to admin by user ID
   * POST: /api/trpc/adminSetup.promote
   * Body: { userId: number }
   */
  promote: publicQuery
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(users)
        .set({ role: "admin" })
        .where(eq(users.id, input.userId));
      return { success: true, message: `User ${input.userId} promoted to admin` };
    }),

  /**
   * Promote a user to admin by email
   * POST: /api/trpc/adminSetup.promoteByEmail
   * Body: { email: string }
   */
  promoteByEmail: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.update(users)
        .set({ role: "admin" })
        .where(eq(users.email, input.email));
      
      if (result[0].affectedRows === 0) {
        return { success: false, message: `No user found with email: ${input.email}` };
      }
      return { success: true, message: `User with email ${input.email} promoted to admin` };
    }),

  /**
   * Demote a user to regular user
   * POST: /api/trpc/adminSetup.demote
   * Body: { userId: number }
   */
  demote: publicQuery
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(users)
        .set({ role: "user" })
        .where(eq(users.id, input.userId));
      return { success: true, message: `User ${input.userId} demoted to user` };
    }),

  /**
   * Check if an admin exists
   * GET: /api/trpc/adminSetup.checkAdmin
   */
  checkAdmin: publicQuery.query(async () => {
    const db = getDb();
    const adminUsers = await db.select()
      .from(users)
      .where(eq(users.role, "admin"));
    
    const superAdminUsers = await db.select()
      .from(users)
      .where(eq(users.role, "superadmin"));
    
    const totalAdmins = adminUsers.length + superAdminUsers.length;
    
    return {
      hasAdmin: totalAdmins > 0,
      adminCount: totalAdmins,
      admins: [...adminUsers, ...superAdminUsers].map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    };
  }),
});
