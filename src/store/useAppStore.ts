import { mockRestaurants } from "@/src/data/mockRestaurants";
import { Restaurant } from "@/src/types/restaurant";
import { create } from "zustand";

type AppState = {
  query: string;
  savedIds: string[];
  restaurants: Restaurant[];
  setQuery: (query: string) => void;
  toggleSaved: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  query: "",
  savedIds: [],
  restaurants: mockRestaurants,
  setQuery: (query) => set({ query }),
  toggleSaved: (id) =>
    set((state) => ({
      savedIds: state.savedIds.includes(id)
        ? state.savedIds.filter((x) => x !== id)
        : [...state.savedIds, id],
    })),
}));
