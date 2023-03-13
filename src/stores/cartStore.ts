import { type ShopItem } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type CartItem = Pick<ShopItem, "id">;

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
}

export const useCartStore = create(
  immer<CartStore>((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        state.items.push(item);
      }),
  }))
);
