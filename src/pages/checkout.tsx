import { Button, Typography } from "antd";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import CartItemsList from "~/components/cart/CartItemsList";
import { useCartStore } from "~/stores/cartStore";
import { api } from "~/utils/api";

const Checkout: NextPage = () => {
  const { data: sessionData } = useSession();
  const { items } = useCartStore();
  const createOrder = api.order.create.useMutation();

  if (!sessionData?.user) {
    return <div>Log in to checkout</div>;
  }

  const handleCreateOrder = () => {
    createOrder.mutate({
      orderItems: items.map((item) => ({ id: item.id, quantity: item.qty })),
      userId: sessionData.user.id,
    });
  };

  return (
    <div className="p-4">
      <Typography.Title className="text-center" level={3}>
        Checkout
      </Typography.Title>
      <div className="relative mx-auto w-[600px] ">
        <CartItemsList items={items} />
        <Button
          onClick={handleCreateOrder}
          className="absolute right-0 bottom-0"
          type="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
