import { api } from "./api";
import { ApiSurveyPreferences } from "./user.service";

export type AuthResponse = {
  id: string;
  email: string;
  token: string;
  hasSurvey: boolean;
  preferences: ApiSurveyPreferences | null;
};

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  signup: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/signup", { email, password }),
};
