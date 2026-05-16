import { ApiRecommendationResponse } from "@/src/types/api";
import { api } from "./api";

export type RecommendationRequest = {
  lat: number;
  lng: number;
  preferences: {
    cuisine: string[];
    vibe: string[];
    budget: number;
  };
  query?: string;
};

export const recommendationService = {
  get: (body: RecommendationRequest) =>
    api.post<ApiRecommendationResponse>("/recommendation", body),
};
