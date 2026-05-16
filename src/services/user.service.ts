import { ApiSavedRestaurant, PaginatedResponse } from "@/src/types/api";
import { api } from "./api";

export type ApiSurveyPreferences = {
  cuisine: string[];
  vibe: string[];
  budget: number;
};

export type UserSurveyResponse = {
  id: string;
  email: string;
  preferences: ApiSurveyPreferences | null;
};

export type UserProfileResponse = {
  id: string;
  email: string;
  hasSurvey: boolean;
  preferences: ApiSurveyPreferences | null;
  createdAt: string;
};

export type SavedRestaurantQuery = {
  page?: number;
  limit?: number;
};

function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export const userService = {
  getSurvey: (userId: string) =>
    api.get<UserSurveyResponse>(`/user/${userId}/survey`),

  saveSurvey: (userId: string, prefs: ApiSurveyPreferences) =>
    api.put<UserSurveyResponse>(`/user/${userId}/survey`, prefs),

  getProfile: (userId: string) =>
    api.get<UserProfileResponse>(`/user/${userId}/profile`),

  getSavedRestaurants: (userId: string, query: SavedRestaurantQuery = {}) =>
    api.get<PaginatedResponse<ApiSavedRestaurant>>(
      `/user/${userId}/saved-restaurants${buildQueryString(query)}`,
    ),

  saveRestaurant: (userId: string, restaurantId: string) =>
    api.post<{ message: string }>(`/user/${userId}/saved-restaurants`, { restaurantId }),

  unsaveRestaurant: (userId: string, restaurantId: string) =>
    api.delete<{ message: string }>(`/user/${userId}/saved-restaurants/${restaurantId}`),
};
