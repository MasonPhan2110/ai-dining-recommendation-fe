import { Restaurant } from "@/src/types/restaurant";

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "ABC Bistro",
    cuisine: "Thai",
    priceRange: "220k–280k",
    distanceKm: 1.5,
    tags: ["Quiet", "Cozy", "Date night"],
    matchScore: 91,
    explanation:
      "Nestled in Hoan Kiem, this spot nails your quiet-date brief — low lighting, intimate booths, and a menu that won't break your budget.",
    rating: 4.6,
    address: "12 Hàng Bạc, Hoàn Kiếm, Hà Nội",
  },
  {
    id: "2",
    name: "Sora Kitchen",
    cuisine: "Japanese",
    priceRange: "250k–320k",
    distanceKm: 2.1,
    tags: ["Cozy", "Indoor", "Couple"],
    matchScore: 88,
    explanation:
      "Consistent quality Japanese in a calm, wood-toned space. Great for a slow evening — the ramen here is genuinely worth the 2 km.",
    rating: 4.5,
    address: "28 Tràng Tiền, Hoàn Kiếm, Hà Nội",
  },
  {
    id: "3",
    name: "Bếp Nhà Hà Nội",
    cuisine: "Vietnamese",
    priceRange: "120k–180k",
    distanceKm: 0.8,
    tags: ["Local", "Casual", "Group"],
    matchScore: 85,
    explanation:
      "Under 200k, 5-minute walk, and genuinely good bún chả. This is the kind of spot locals keep to themselves.",
    rating: 4.4,
    address: "7 Lý Quốc Sư, Hoàn Kiếm, Hà Nội",
  },
  {
    id: "4",
    name: "Osteria Roma",
    cuisine: "Italian",
    priceRange: "350k–500k",
    distanceKm: 3.2,
    tags: ["Romantic", "Fine Dining", "Wine"],
    matchScore: 79,
    explanation:
      "A bit of a splurge and a longer ride, but if the occasion calls for pasta and atmosphere — this is the best Italian in the Old Quarter.",
    rating: 4.8,
    address: "45 Hàng Bông, Hoàn Kiếm, Hà Nội",
  },
  {
    id: "5",
    name: "Seoul Corner",
    cuisine: "Korean",
    priceRange: "180k–260k",
    distanceKm: 1.9,
    tags: ["KBBQ", "Group", "Late night"],
    matchScore: 83,
    explanation:
      "Open until midnight, large tables for groups, and solid KBBQ without the tourist markup. Bring 4+ people for the best experience.",
    rating: 4.3,
    address: "19 Bà Triệu, Hoàn Kiếm, Hà Nội",
  },
];
