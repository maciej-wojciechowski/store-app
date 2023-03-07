import { type Category } from "@prisma/client";
import { create } from "zustand";

interface CategoryStore {
  category: Category | null;
  setCategory: (category: Category | null) => void;
  resetCategory: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  category: null,
  setCategory: (category: Category | null) => set({ category: category }),
  resetCategory: () => set({ category: null }),
}));
