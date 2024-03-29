import { z } from "zod";
import { getDeliveryCostWithKey } from "~/helpers/selectsHelpers";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  // GET USER ORDERS LIST
  getUserOrderList: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: { userId: input },
        select: { id: true, createdAt: true, totalPrice: true, status: true },
        orderBy: { createdAt: "desc" },
      });
    }),
  // GET ORDER
  getOrderById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findUnique({
        where: { id: input },
        include: {
          items: true,
        },
      });
    }),
  // CREATE
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        orderItems: z.array(z.object({ id: z.string(), quantity: z.number() })),
        delivery: z.enum(["post", "courier", "pickup"]),
        address: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let address = input.address;
      // get address if not provided
      if (!address) {
        const userAddress = await ctx.prisma.address.findUnique({
          where: { userId: input.userId },
        });
        if (!userAddress) {
          throw new Error("User has no address");
        }
        // remove userID from address
        address = Object.entries(userAddress)
          .reduce((acc, [key, value]) => {
            if (key !== "userId") {
              acc.push(value);
            }
            return acc;
          }, [] as string[])
          .join(",");
      }
      // get shop items
      const shopItems = await ctx.prisma.shopItem.findMany({
        where: { id: { in: input.orderItems.map((item) => item.id) } },
      });
      // total price - start with delivery cost
      let totalPrice = getDeliveryCostWithKey(input.delivery).cost;

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
          address,
          totalPrice: totalPrice,
          delivery: input.delivery,
        },
      });
    }),
});
