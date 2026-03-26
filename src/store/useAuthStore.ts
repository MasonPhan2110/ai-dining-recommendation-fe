import { create } from "zustand";

export type Preferences = {
  cuisines: string[];
  budget: string;
  vibes: string[];
};

type AuthState = {
  isLoggedIn: boolean;
  surveyCompleted: boolean;
  userEmail: string;
  preferences: Preferences;
  login: (email: string) => void;
  logout: () => void;
  completeSurvey: (prefs: Preferences) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  surveyCompleted: false,
  userEmail: "",
  preferences: { cuisines: [], budget: "", vibes: [] },
  login: (email) => set({ isLoggedIn: true, userEmail: email }),
  logout: () =>
    set({
      isLoggedIn: false,
      surveyCompleted: false,
      userEmail: "",
      preferences: { cuisines: [], budget: "", vibes: [] },
    }),
  completeSurvey: (prefs) => set({ surveyCompleted: true, preferences: prefs }),
}));
