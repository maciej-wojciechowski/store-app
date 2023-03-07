import { type Category } from "@prisma/client";
import { create } from "zustand";

interface Filters {
  category: Category | null;
}

interface FiltersStore {
  filters: Filters;
  setCategory: (category: Filters["category"]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: Filters = { category: null };

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setCategory: (category) =>
    set((state) => ({ ...state, filters: { ...state.filters, category } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
