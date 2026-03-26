export type CuisineConfig = {
  color: string;
  softBg: string;
  emoji: string;
};

// Single source of truth for cuisine visual identity.
// Used by RestaurantCard, Detail screen, and Discover screen.
export const CUISINE_CONFIG: Record<string, CuisineConfig> = {
  Japanese:   { color: "#6366F1", softBg: "#EEF2FF", emoji: "🍱" },
  Korean:     { color: "#8B5CF6", softBg: "#F3EEFF", emoji: "🥩" },
  Thai:       { color: "#EC4899", softBg: "#FDF2F8", emoji: "🥘" },
  Italian:    { color: "#10B981", softBg: "#ECFDF5", emoji: "🍝" },
  Vietnamese: { color: "#F59E0B", softBg: "#FFFBEB", emoji: "🍜" },
  Chinese:    { color: "#EF4444", softBg: "#FEF2F2", emoji: "🥡" },
  American:   { color: "#3B82F6", softBg: "#EFF6FF", emoji: "🍔" },
  Fusion:     { color: "#14B8A6", softBg: "#F0FDFA", emoji: "🍽️" },
};

const DEFAULT_CONFIG: CuisineConfig = {
  color: "#E76F51",
  softBg: "#FDF1EC",
  emoji: "🍽️",
};

export const getCuisineConfig = (cuisine: string): CuisineConfig =>
  CUISINE_CONFIG[cuisine] ?? DEFAULT_CONFIG;
