import { Category } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const shopItemRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ category: z.nullable(z.nativeEnum(Category)) }))
    .query(({ ctx, input }) => {
      if (input.category) {
        return ctx.prisma.shopItem.findMany({
          where: {
            category: input.category,
          },
        });
      }
      return ctx.prisma.shopItem.findMany();
    }),
});
