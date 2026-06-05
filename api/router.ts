import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { dealerRouter } from "./dealer-router";
import { articleRouter } from "./article-router";
import { rankRouter } from "./rank-router";
import { subscriptionRouter } from "./subscription-router";
import { orderRouter } from "./order-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  dealer: dealerRouter,
  article: articleRouter,
  rank: rankRouter,
  subscription: subscriptionRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
