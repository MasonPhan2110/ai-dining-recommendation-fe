import { ApiRestaurant, PaginatedResponse } from "@/src/types/api";
import { api } from "./api";

export type RestaurantQuery = {
  userId?: string;
  cuisine?: string;
  vibe?: string;
  budget?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
};

export type NearbyQuery = {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
};

function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export const restaurantService = {
  list: (query: RestaurantQuery = {}) =>
    api.get<PaginatedResponse<ApiRestaurant>>(`/restaurant${buildQueryString(query)}`),

  getById: (id: string) => api.get<ApiRestaurant>(`/restaurant/${id}`),

  nearby: (query: NearbyQuery) =>
    api.get<ApiRestaurant[]>(`/restaurant/nearby${buildQueryString(query)}`),
};
