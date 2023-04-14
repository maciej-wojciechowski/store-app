import { type Producer, type Category } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IFilters {
  category: Category | "all";
  producer: Producer | null;
  priceRange: [number, number] | null;
}

interface FiltersStore {
  filters: IFilters;
  setCategory: (category: IFilters["category"]) => void;
  setProducer: (producer: IFilters["producer"]) => void;
  setPriceRange: (priceRange: IFilters["priceRange"]) => void;
  setFilters: <T extends keyof IFilters>(key: T, newValue: IFilters[T]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: IFilters = {
  category: "all",
  priceRange: null,
  producer: null,
};

export const useFiltersStore = create(
  immer<FiltersStore>((set) => ({
    filters: DEFAULT_FILTERS,
    setCategory: (category) =>
      set((state) => {
        state.filters.category = category;
      }),
    setProducer: (producer) =>
      set((state) => {
        state.filters.producer = producer;
      }),
    setPriceRange: (priceRange) =>
      set((state) => {
        state.filters.priceRange = priceRange;
      }),
    setFilters: (key, newValue) =>
      set((state) => {
        state.filters[key] = newValue;
      }),
    resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  }))
);
