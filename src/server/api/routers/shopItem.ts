import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const shopItemRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shopItem.findMany();
  }),
});
