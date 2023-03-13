import { Badge, Button } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import React from "react";
import { useCartStore } from "~/stores/cartStore";

const Cart = () => {
  const { items } = useCartStore();
  return (
    <Badge className="absolute bottom-8 right-8" count={items.length}>
      <Button
        shape="circle"
        size="large"
        className="!h-14 !w-14 bg-themeGrey text-white ring-2 ring-themeTurkish"
        icon={<ShoppingOutlined className="text-2xl" />}
      />
    </Badge>
  );
};

export default Cart;
