import { type ShopItem } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type CartItem = Pick<
  ShopItem,
  "id" | "name" | "price" | "image" | "stock"
> & {
  pcs: number;
};

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  changeItemPcs: (itemId: string, pcs: number) => void;
}

export const useCartStore = create(
  immer<CartStore>((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        let isPushed = false;
        state.items.forEach((el) => {
          if (el.id === item.id) {
            if (el.pcs + item.pcs < el.stock) {
              el.pcs += item.pcs;
            } else {
              el.pcs = el.stock;
            }
            isPushed = true;
          }
        });
        if (!isPushed) {
          state.items.push(item);
        }
      }),
    changeItemPcs: (itemId, pcs) =>
      set((state) => {
        state.items.forEach((el) => {
          if (el.id === itemId) {
            el.pcs = pcs;
          }
        });
      }),
  }))
);
