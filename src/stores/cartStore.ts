import { type ShopItem } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { myNotification } from "~/utils/notification";

export type CartItem = Pick<ShopItem, "id" | "name" | "price" | "stock"> & {
  qty: number;
  image: string;
};

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  deleteItem: (itemId: string) => void;
  changeItemQty: (itemId: string, qty: number) => void;
}

export const useCartStore = create(
  immer<CartStore>((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        let isPushed = false;
        state.items.forEach((el) => {
          if (el.id === item.id) {
            if (el.qty + item.qty < el.stock) {
              el.qty += item.qty;
            } else {
              el.qty = el.stock;
            }
            isPushed = true;
          }
        });
        if (!isPushed) {
          state.items.push(item);
        }
        myNotification.success({
          message: "Success",
          description: "Item added to cart",
          placement: "topRight",
        });
      }),
    deleteItem: (itemId) =>
      set((state) => {
        state.items = state.items.filter((el) => el.id !== itemId);
      }),
    changeItemQty: (itemId, qty) =>
      set((state) => {
        state.items.forEach((el) => {
          if (el.id === itemId) {
            el.qty = qty;
          }
        });
      }),
  }))
);
