import { AIChatRequest, AIChatResponse, AIChatSessionResponse } from "@/src/types/ai-chat";
import { api } from "./api";

export const aiChatService = {
  send: (payload: AIChatRequest) =>
    api.post<AIChatResponse>("/ai-chat", payload),

  getSession: (sessionId: string) =>
    api.get<AIChatSessionResponse>(`/ai-chat/${sessionId}`),
};
