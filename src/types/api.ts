/** Raw restaurant shape returned by GET /restaurant */
export type ApiRestaurant = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  /** 1 = street food, 2 = casual/mid-range, 3 = upscale casual, 4 = fine dining */
  priceRange: number;
  vibe: string;
  cuisine: string;
  rating: number;
  /** Distance in km — present when lat/lng provided in query */
  distance?: number;
  /** 0–100 match score returned by GET /restaurant */
  percentMatch?: number;
};

/** Restaurant shape in POST /recommendation response */
export type ApiRecommendationRestaurant = ApiRestaurant & {
  aiScore: number;
  reason: string;
};

/** Response from POST /recommendation */
export type ApiRecommendationResponse = {
  restaurants: ApiRecommendationRestaurant[];
  summary: string;
  aiUsed: boolean;
};

/** Saved restaurant includes savedAt timestamp */
export type ApiSavedRestaurant = ApiRestaurant & {
  savedAt: string;
};

/** Pagination metadata used across paginated endpoints */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

/** Paginated response wrapper */
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
