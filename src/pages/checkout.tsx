import { Button, Typography } from "antd";
import { type NextPage } from "next";
import React from "react";
import CartItemsList from "~/components/cart/CartItemsList";
import { useCartStore } from "~/stores/cartStore";

const Checkout: NextPage = () => {
  const { items } = useCartStore();

  return (
    <div className="p-4">
      <Typography.Title className="text-center" level={3}>
        Checkout
      </Typography.Title>
      <div className="relative mx-auto w-[600px] ">
        <CartItemsList items={items} />
        <Button className="absolute right-0 bottom-0" type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
