import { Badge, Button, Popover } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import React, { useEffect, useRef } from "react";
import { type CartItem, useCartStore } from "~/stores/cartStore";
import CartItemsList from "./CartItemsList";
import { useRouter } from "next/router";

const Cart = () => {
  const { items, setItems } = useCartStore();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const parsedCart = JSON.parse(cart) as CartItem[] | null;
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    }
  }, []);

  const prevItems = useRef(items);
  useEffect(() => {
    // this check skips the first render which results in an empty cart
    if (!prevItems.current.length && !items.length) {
      return;
    }
    localStorage.setItem("cart", JSON.stringify(items));
    prevItems.current = items;
  }, [items]);
  const router = useRouter();
  return (
    <Popover
      placement="leftTop"
      trigger="click"
      content={
        <div className="relative w-96">
          <CartItemsList
            items={items}
            listClassName="max-h-[300px] overflow-auto"
          />
          <Button
            className="absolute right-0 bottom-0"
            type="primary"
            disabled={!items.length}
            onClick={() => void router.push("/checkout")}
          >
            Checkout
          </Button>
        </div>
      }
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
