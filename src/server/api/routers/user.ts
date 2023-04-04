import { z } from "zod";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Address } from "@prisma/client";
import { supabase } from "~/utils/supabase";

export const userRouter = createTRPCRouter({
  /**
   * REGISTER
   */
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
  /**
   * GET USER DATA
   */
  getUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({ where: { id: input.userId } });
    }),
  /**
   * CREATE OR UPDATE ADDRESS
   */
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
          where: { userId: input.userId },
          data: input.addressData,
        });
      }

      //check if all values are present
      const addressDataValue = Object.values(input.addressData);
      if (addressDataValue.length !== 5 || addressDataValue.some((v) => !v)) {
        throw new Error("Address fields cannot be empty");
      }
      // create
      return await ctx.prisma.address.create({
        data: { ...(input.addressData as Address), userId: input.userId },
      });
    }),
  /**
   * GET USER ADDRESS
   */
  getUserProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.address.findUnique({
        where: { userId: input.userId },
      });
    }),
  /**
   * UPLOAD USER AVATAR
   */
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        file: z.instanceof(File),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // get user
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input.userId },
      });
      if (!user.image) {
        //upload pic to storage
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(input.userId + "_pic", input.file);
        if (error) {
          throw new Error(error.message);
        }
        console.log({ data, error });
        //save avatar url to db
        await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { image: data.path },
        });
      } else {
        const { error } = await supabase.storage
          .from("avatars")
          .update(input.userId + "_pic", input.file);
        if (error) {
          throw new Error(error.message);
        }
      }
    }),
});
