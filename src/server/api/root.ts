import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { shopItemRouter } from "./routers/shopItem";
import { orderRouter } from "./routers/orders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  shopItem: shopItemRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
