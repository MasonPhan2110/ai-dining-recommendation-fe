import { Restaurant } from "@/src/types/restaurant";
import { ApiRecommendationRestaurant, ApiRestaurant } from "@/src/types/api";
import { Preferences } from "@/src/store/useAuthStore";
import { ApiSurveyPreferences } from "@/src/services/user.service";

// ── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ── Price range ───────────────────────────────────────────────────────────────

const PRICE_LABELS: Record<number, string> = {
  1: "Under 200k",
  2: "200k–400k",
  3: "400k–600k",
  4: "600k+",
};

// ── Core mapper ───────────────────────────────────────────────────────────────

export function mapApiRestaurant(r: ApiRestaurant): Restaurant {
  const primaryCuisine = r.cuisine ? capitalize(r.cuisine) : "Other";
  const tags = r.vibe ? [capitalize(r.vibe)] : [];
  const priceLabel = PRICE_LABELS[r.priceRange] ?? "–";
  const effectiveScore = r.percentMatch ?? 0;

  const explanation =
    effectiveScore > 0
      ? buildExplanation(effectiveScore, primaryCuisine)
      : `${primaryCuisine} cuisine · ${priceLabel} per person`;

  return {
    id: r.id,
    name: r.name,
    cuisine: primaryCuisine,
    priceRange: priceLabel,
    distanceKm: r.distance != null ? Math.round(r.distance * 10) / 10 : 0,
    tags,
    matchScore: Math.round(effectiveScore),
    explanation,
    rating: r.rating,
    address: r.address,
  };
}

export function mapRecommendationRestaurant(r: ApiRecommendationRestaurant): Restaurant {
  const primaryCuisine = r.cuisine ? capitalize(r.cuisine) : "Other";
  const tags = r.vibe ? [capitalize(r.vibe)] : [];
  const priceLabel = PRICE_LABELS[r.priceRange] ?? "–";

  return {
    id: r.id,
    name: r.name,
    cuisine: primaryCuisine,
    priceRange: priceLabel,
    distanceKm: r.distance != null ? Math.round(r.distance * 10) / 10 : 0,
    tags,
    matchScore: r.aiScore,
    explanation: r.reason,
    rating: r.rating,
    address: r.address,
  };
}

// ── Explanation generator ─────────────────────────────────────────────────────

function buildExplanation(score: number, cuisine: string): string {
  if (score >= 88)
    return `Top pick — this ${cuisine} spot hits all your criteria perfectly.`;
  if (score >= 75)
    return `A strong match for your taste in ${cuisine} cuisine and your vibe preferences.`;
  if (score >= 60)
    return `Solid option that aligns well with your dining preferences.`;
  return `Worth exploring based on your cuisine and budget preferences.`;
}

// ── Preference mappers ────────────────────────────────────────────────────────

const BUDGET_TO_INT: Record<string, number> = {
  "Under 200k": 1,
  "200k – 400k": 2,
  "200k–400k": 2,
  "400k+": 3,
  "600k+": 4,
  Premium: 4,
};

export function mapPreferencesToApi(prefs: Preferences) {
  return {
    cuisine: prefs.cuisines.map((c) => c.toLowerCase()),
    vibe: prefs.vibes.map((v) => v.toLowerCase()),
    budget: BUDGET_TO_INT[prefs.budget] ?? 2,
  };
}

const INT_TO_BUDGET: Record<number, string> = {
  1: "Under 200k",
  2: "200k–400k",
  3: "400k+",
  4: "600k+",
};

export function mapApiPreferencesToFrontend(prefs: ApiSurveyPreferences): Preferences {
  return {
    cuisines: prefs.cuisine.map(capitalize),
    vibes: prefs.vibe.map(capitalize),
    budget: INT_TO_BUDGET[prefs.budget] ?? "200k–400k",
  };
}
