import { z } from "zod";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Address } from "@prisma/client";

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
  createOrUpdateAddress: protectedProcedure
    .input(
      z.object({
        addressData: z.object({
          house_number: z.optional(z.string()),
          street: z.optional(z.string()),
          phone: z.optional(z.string()),
          zip_code: z.optional(z.string()),
          city: z.optional(z.string()),
        }),
        addressId: z.optional(z.string()),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.address.findUnique({
        where: { userId: input.userId },
      });
      // updating
      if (address) {
        return await ctx.prisma.address.update({
          where: { id: address.id },
          data: input.addressData,
        });
      }

      //check if all values are present
      const addressDataKeyValue = Object.values(input.addressData);
      if (addressDataKeyValue.length !== 5) {
        throw new Error("Address fields cannot be empty");
      }
      // create
      return await ctx.prisma.address.create({
        data: { ...(input.addressData as Address), userId: input.userId },
      });
    }),
});
