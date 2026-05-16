export type AIChatMessageType = "question" | "recommendation" | "followup";

export type AIChatRestaurant = {
  id: string;
  name: string;
  cuisine: string;
  distance: number;
  rating?: number;
  priceRange?: number;
};

export type AIChatContext = {
  cuisine: string | null;
  vibe: string | null;
  budget: number | null;
  gatheringComplete: boolean;
};

export type AIChatResponse = {
  sessionId: string;
  message: string;
  type: AIChatMessageType;
  restaurants: AIChatRestaurant[] | null;
  context?: AIChatContext;
  options?: string[];
};

export type AIChatRequest = {
  userId: string;
  message: string;
  sessionId?: string;
  lat?: number;
  lng?: number;
};

export type AIChatSessionMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AIChatSessionResponse = {
  sessionId: string;
  messages: AIChatSessionMessage[];
  context: AIChatContext;
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  type?: AIChatMessageType;
  restaurants?: AIChatRestaurant[];
  options?: string[];
  timestamp: number;
};
