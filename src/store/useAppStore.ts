import { mockRestaurants } from "@/src/data/mockRestaurants";
import { restaurantService } from "@/src/services/restaurant.service";
import { userService } from "@/src/services/user.service";
import { Restaurant } from "@/src/types/restaurant";
import { CUISINE_CONFIG } from "@/src/utils/cuisineConfig";
import { mapApiRestaurant } from "@/src/utils/mappers";
import { create } from "zustand";

const CUISINE_NAMES = new Set(
  Object.keys(CUISINE_CONFIG).map((k) => k.toLowerCase()),
);

const PAGE_LIMIT = 10;

type FetchFeedParams = {
  query?: string;
  userId?: string;
  lat?: number;
  lng?: number;
};

type AppState = {
  query: string;
  restaurants: Restaurant[];
  savedRestaurants: Restaurant[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNext: boolean;
  currentPage: number;
  /** Cached params for fetchNextPage to re-use */
  _lastFeedParams: FetchFeedParams;
  error: string | null;

  setQuery: (query: string) => void;
  loadSaved: (userId: string) => Promise<void>;
  toggleSaved: (restaurantId: string, userId: string) => Promise<void>;
  /** Fetch page 1, replaces the list */
  fetchFeed: (params: FetchFeedParams) => Promise<void>;
  /** Append the next page — no-op if hasNext is false or already loading */
  fetchNextPage: () => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  query: "",
  restaurants: mockRestaurants,
  savedRestaurants: [],
  isLoading: false,
  isLoadingMore: false,
  hasNext: false,
  currentPage: 1,
  _lastFeedParams: {},
  error: null,

  setQuery: (query) => set({ query }),

  loadSaved: async (userId) => {
    try {
      const res = await userService.getSavedRestaurants(userId);
      set({ savedRestaurants: res.data.map((r) => mapApiRestaurant(r)) });
    } catch {
      // silently ignore
    }
  },

  toggleSaved: async (restaurantId, userId) => {
    const { savedRestaurants, restaurants } = get();
    const isSaved = savedRestaurants.some((r) => r.id === restaurantId);

    if (isSaved) {
      set({ savedRestaurants: savedRestaurants.filter((r) => r.id !== restaurantId) });
      try {
        await userService.unsaveRestaurant(userId, restaurantId);
      } catch {
        set({
          savedRestaurants: get().savedRestaurants.concat(
            savedRestaurants.filter((r) => r.id === restaurantId),
          ),
        });
      }
    } else {
      const restaurant = restaurants.find((r) => r.id === restaurantId);
      if (restaurant) {
        set({ savedRestaurants: [restaurant, ...savedRestaurants] });
      }
      try {
        await userService.saveRestaurant(userId, restaurantId);
      } catch (err) {
        const is409 = err instanceof Error && err.message.includes("409");
        if (!is409) {
          set({
            savedRestaurants: get().savedRestaurants.filter((r) => r.id !== restaurantId),
          });
        }
      }
    }
  },

  fetchFeed: async (params) => {
    const { query = "", userId, lat, lng } = params;
    set({ isLoading: true, error: null, _lastFeedParams: params });

    try {
      const filterParam = query.trim()
        ? (() => {
            const q = query.trim();
            const isCuisine = CUISINE_NAMES.has(q.toLowerCase());
            return isCuisine ? { cuisine: q } : { vibe: q };
          })()
        : {};

      const res = await restaurantService.list({
        userId,
        lat,
        lng,
        ...filterParam,
        page: 1,
        limit: PAGE_LIMIT,
      });

      set({
        restaurants: res.data.map((r) => mapApiRestaurant(r)),
        hasNext: res.meta.hasNext,
        currentPage: 1,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Could not load restaurants.",
      });
    }
  },

  fetchNextPage: async () => {
    const { isLoading, isLoadingMore, hasNext, currentPage, _lastFeedParams } = get();
    if (!hasNext || isLoading || isLoadingMore) return;

    const { query = "", userId, lat, lng } = _lastFeedParams;
    const nextPage = currentPage + 1;

    set({ isLoadingMore: true });

    try {
      const filterParam = query.trim()
        ? (() => {
            const q = query.trim();
            const isCuisine = CUISINE_NAMES.has(q.toLowerCase());
            return isCuisine ? { cuisine: q } : { vibe: q };
          })()
        : {};

      const res = await restaurantService.list({
        userId,
        lat,
        lng,
        ...filterParam,
        page: nextPage,
        limit: PAGE_LIMIT,
      });

      set((state) => ({
        restaurants: [...state.restaurants, ...res.data.map((r) => mapApiRestaurant(r))],
        hasNext: res.meta.hasNext,
        currentPage: nextPage,
        isLoadingMore: false,
      }));
    } catch {
      set({ isLoadingMore: false });
    }
  },
}));
