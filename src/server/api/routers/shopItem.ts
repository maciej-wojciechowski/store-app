import { Category, Producer } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const shopItemRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        category: z.nullable(z.nativeEnum(Category)),
        producer: z.nullable(z.nativeEnum(Producer)),
        priceRange: z.nullable(z.array(z.number(), z.number())),
      })
    )
    .query(({ ctx, input }) => {
      const where: Record<string, unknown> = {};
      if (input.category) {
        where.category = input.category;
      }
      if (input.producer) {
        where.producer = input.producer;
      }
      if (input.priceRange) {
        where.price = {
          gte: input.priceRange[0],
          lte: input.priceRange[1],
        };
      }
      return ctx.prisma.shopItem.findMany({
        where,
      });
    }),
});
