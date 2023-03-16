import { type ShopItem } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type CartItem = Pick<ShopItem, "id" | "name" | "price" | "image"> & {
  pcs: number;
};

interface CartStore {
  items: CartItem[];
  totalAmount: number;
  addItem: (item: CartItem) => void;
}

export const useCartStore = create(
  immer<CartStore>((set) => ({
    items: [],
    totalAmount: 0,
    addItem: (item) =>
      set((state) => {
        state.totalAmount += item.price * item.pcs;
        const foundIdx = state.items.findIndex((el) => el.id === item.id);
        if (foundIdx === -1 || !state.items[foundIdx]) {
          state.items.push(item);
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.items[foundIdx]!.pcs += item.pcs;
      }),
  }))
);
