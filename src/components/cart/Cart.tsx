import { Badge, Button, Popover } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import React from "react";
import { useCartStore } from "~/stores/cartStore";
import CartItemsList from "./CartItemsList";

const Cart = () => {
  const { items } = useCartStore();
  return (
    <Popover
      placement="leftTop"
      trigger={"click"}
      content={<CartItemsList items={items} />}
    >
      <Badge className="absolute bottom-8 right-8" count={items.length}>
        <Button
          shape="circle"
          size="large"
          className="!h-14 !w-14 bg-themeGrey text-white ring-2 ring-themeTurkish"
          icon={<ShoppingOutlined className="text-2xl" />}
        />
      </Badge>
    </Popover>
  );
};

export default Cart;
