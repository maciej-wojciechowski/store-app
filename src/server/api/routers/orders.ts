import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        orderItems: z.array(z.object({ id: z.string(), quantity: z.number() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // get address
      const address = await ctx.prisma.address.findUnique({
        where: { userId: input.userId },
      });
      if (!address) {
        throw new Error("User has no address");
      }
      // get shop items
      const shopItems = await ctx.prisma.shopItem.findMany({
        where: { id: { in: input.orderItems.map((item) => item.id) } },
      });
      // total price
      let totalPrice = 0;
      // order items
      const items = input.orderItems.map((item) => {
        const shopItem = shopItems.find((i) => i.id === item.id);
        if (!shopItem) {
          throw new Error("Shop item not found");
        }
        // decrease stock
        ctx.prisma.shopItem
          .update({
            where: { id: shopItem.id },
            data: { stock: shopItem.stock - item.quantity },
          })
          .catch(() => {
            throw new Error("Could not update shop item stock");
          });
        // add to total price
        totalPrice += shopItem.price * item.quantity;
        return {
          shopItemId: item.id,
          quantity: item.quantity,
          price: shopItem.price,
        };
      });
      // create order
      return ctx.prisma.order.create({
        data: {
          userId: input.userId,
          items: {
            create: items,
          },
          address: Object.values(address).join(","),
          totalPrice: totalPrice,
        },
      });
    }),
});
