import { z } from "zod";
import bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({ name: z.string(), password: z.string(), email: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 12);
      return ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          hashedPassword,
        },
      });
    }),
  find: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({ where: { email: input.email } });
    }),
});
