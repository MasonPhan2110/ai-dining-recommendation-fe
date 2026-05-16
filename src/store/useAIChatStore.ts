import { aiChatService } from "@/src/services/ai-chat.service";
import { AIChatResponse, ChatMessage } from "@/src/types/ai-chat";
import { create } from "zustand";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "ai",
  text: "Hey! I'm your AI dining assistant 🍽️\nTell me what you're craving and I'll find the perfect spot.",
  options: ["Cozy date night 🕯️", "Quick lunch ⚡", "Group dinner 👥", "Late night bites 🌙"],
  timestamp: Date.now(),
};

type AIChatState = {
  messages: ChatMessage[];
  sessionId: string | null;
  isTyping: boolean;
  sendMessage: (text: string, userId: string, lat?: number, lng?: number) => Promise<void>;
  clearChat: () => void;
};

export const useAIChatStore = create<AIChatState>((set, get) => ({
  messages: [WELCOME],
  sessionId: null,
  isTyping: false,

  sendMessage: async (text, userId, lat, lng) => {
    const { sessionId, messages } = get();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      timestamp: Date.now(),
    };

    set({ messages: [...messages, userMsg], isTyping: true });

    try {
      const res: AIChatResponse = await aiChatService.send({
        userId,
        message: text,
        sessionId: sessionId ?? undefined,
        lat,
        lng,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: res.message,
        type: res.type,
        restaurants: res.restaurants ?? undefined,
        options: res.options,
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, aiMsg],
        sessionId: res.sessionId,
        isTyping: false,
      }));
    } catch {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "ai",
        text: "Sorry, I had trouble connecting. Please try again. 🙏",
        timestamp: Date.now(),
      };
      set((s) => ({
        messages: [...s.messages, errMsg],
        isTyping: false,
      }));
    }
  },

  clearChat: () =>
    set({ messages: [WELCOME], sessionId: null, isTyping: false }),
}));
