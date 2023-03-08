import { type Category } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IFilters {
  category: Category | "all";
}

interface FiltersStore {
  filters: IFilters;
  setCategory: (category: IFilters["category"]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: IFilters = { category: "all" };

export const useFiltersStore = create(
  immer<FiltersStore>((set) => ({
    filters: DEFAULT_FILTERS,
    setCategory: (category) =>
      set((state) => {
        state.filters.category = category;
      }),
    resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  }))
);
