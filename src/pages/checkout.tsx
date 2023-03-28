import { Typography } from "antd";
import { type NextPage } from "next";
import React from "react";
import CartItemsList from "~/components/cart/CartItemsList";
import { useCartStore } from "~/stores/cartStore";

const Checkout: NextPage = () => {
  const { items } = useCartStore();

  return (
    <div>
      <Typography.Title className="text-center" level={3}>
        Checkout
      </Typography.Title>
      <div className="mx-auto w-[600px]">
        <CartItemsList items={items} />
      </div>
    </div>
  );
};

export default Checkout;
