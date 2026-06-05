import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems, cartItems, products } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const orderRouter = createRouter({
  // Cart operations
  getCart: publicQuery
    .input(z.object({ sessionId: z.string() }).optional())
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const sessionId = input?.sessionId || "";
      const userId = ctx.user?.id;

      let cartQuery;
      if (userId) {
        cartQuery = db.select().from(cartItems).where(eq(cartItems.userId, userId));
      } else {
        cartQuery = db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
      }

      const items = await cartQuery;
      const enrichedItems = [];
      let total = 0;

      for (const item of items) {
        const product = await db.select().from(products).where(eq(products.id, item.productId));
        if (product[0]) {
          const price = parseFloat(product[0].salePrice || product[0].price);
          enrichedItems.push({
            ...item,
            product: product[0],
            lineTotal: price * item.quantity,
          });
          total += price * item.quantity;
        }
      }

      return { items: enrichedItems, total, count: enrichedItems.length };
    }),

  addToCart: publicQuery
    .input(z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      sessionId: z.string(),
      variant: z.any().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      await db.insert(cartItems).values({
        userId: userId || null,
        sessionId: userId ? null : input.sessionId,
        productId: input.productId,
        quantity: input.quantity,
        variant: input.variant || null,
      });

      return { success: true };
    }),

  removeFromCart: publicQuery
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
      return { success: true };
    }),

  updateCartQuantity: publicQuery
    .input(z.object({ itemId: z.number(), quantity: z.number().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(cartItems).set({ quantity: input.quantity }).where(eq(cartItems.id, input.itemId));
      return { success: true };
    }),

  // Order operations
  create: publicQuery
    .input(z.object({
      items: z.array(z.object({
        productId: z.number(),
        quantity: z.number(),
        variant: z.any().optional(),
      })),
      shippingAddress: z.object({
        fullName: z.string(),
        phone: z.string(),
        email: z.string(),
        address: z.string(),
        city: z.string(),
        postalCode: z.string().optional(),
      }),
      paymentMethod: z.enum(["card", "cod", "baridimob"]),
      shippingCost: z.number().default(2500),
      discount: z.number().default(0),
      referrerId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      // Calculate totals
      let subtotal = 0;
      for (const item of input.items) {
        const product = await db.select().from(products).where(eq(products.id, item.productId));
        if (product[0]) {
          subtotal += parseFloat(product[0].salePrice || product[0].price) * item.quantity;
        }
      }

      const total = subtotal + input.shippingCost - input.discount;
      const orderNumber = `ER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const orderResult = await db.insert(orders).values({
        userId: userId || null,
        orderNumber,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        shippingCost: input.shippingCost.toFixed(2),
        discount: input.discount.toFixed(2),
        total: total.toFixed(2),
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "cod" ? "pending" : "pending",
        referrerId: input.referrerId || null,
      });

      const orderId = Number(orderResult[0].insertId);

      // Create order items
      for (const item of input.items) {
        const product = await db.select().from(products).where(eq(products.id, item.productId));
        if (product[0]) {
          const price = parseFloat(product[0].salePrice || product[0].price);
          await db.insert(orderItems).values({
            orderId,
            productId: item.productId,
            variant: item.variant || null,
            quantity: item.quantity,
            unitPrice: price.toFixed(2),
            totalPrice: (price * item.quantity).toFixed(2),
          });
        }
      }

      return { success: true, orderId, orderNumber };
    }),

  getByNumber: publicQuery
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const order = await db.select().from(orders).where(eq(orders.orderNumber, input.orderNumber));
      if (!order[0]) return null;

      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order[0].id));
      const enrichedItems = [];
      for (const item of items) {
        const product = await db.select().from(products).where(eq(products.id, item.productId));
        enrichedItems.push({ ...item, product: product[0] || null });
      }

      return { ...order[0], items: enrichedItems };
    }),

  myOrders: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user?.id;
    if (!userId) return [];

    const myOrders = await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    return myOrders;
  }),
});
