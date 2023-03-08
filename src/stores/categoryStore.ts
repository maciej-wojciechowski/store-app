import { type Category } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IFilters {
  category: Category | "all";
  priceRange: [number, number] | null;
}

interface FiltersStore {
  filters: IFilters;
  setCategory: (category: IFilters["category"]) => void;
  setPriceRange: (priceRange: IFilters["priceRange"]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: IFilters = { category: "all", priceRange: null };

export const useFiltersStore = create(
  immer<FiltersStore>((set) => ({
    filters: DEFAULT_FILTERS,
    setCategory: (category) =>
      set((state) => {
        state.filters.category = category;
      }),
    setPriceRange: (priceRange) =>
      set((state) => {
        state.filters.priceRange = priceRange;
      }),
    resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  }))
);
