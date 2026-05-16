import { authService } from "@/src/services/auth.service";
import { userService } from "@/src/services/user.service";
import { mapApiPreferencesToFrontend, mapPreferencesToApi } from "@/src/utils/mappers";
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
  userId: string;
  token: string;
  preferences: Preferences;
  /** Returns error message on failure, null on success */
  login: (email: string, password: string) => Promise<string | null>;
  /** Returns error message on failure, null on success */
  signup: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  completeSurvey: (prefs: Preferences) => void;
};

const EMPTY_PREFS: Preferences = { cuisines: [], budget: "", vibes: [] };

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  surveyCompleted: false,
  userEmail: "",
  userId: "",
  token: "",
  preferences: EMPTY_PREFS,

  login: async (email, password) => {
    try {
      const res = await authService.login(email, password);
      set({
        isLoggedIn: true,
        userEmail: res.email,
        userId: res.id,
        token: res.token,
        surveyCompleted: res.hasSurvey,
        preferences: res.preferences
          ? mapApiPreferencesToFrontend(res.preferences)
          : EMPTY_PREFS,
      });
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Login failed. Please try again.";
    }
  },

  signup: async (email, password) => {
    try {
      const res = await authService.signup(email, password);
      set({
        isLoggedIn: true,
        userEmail: res.email,
        userId: res.id,
        token: res.token,
        surveyCompleted: res.hasSurvey,
        preferences: res.preferences
          ? mapApiPreferencesToFrontend(res.preferences)
          : EMPTY_PREFS,
      });
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Sign up failed. Please try again.";
    }
  },

  logout: () =>
    set({
      isLoggedIn: false,
      surveyCompleted: false,
      userEmail: "",
      userId: "",
      token: "",
      preferences: EMPTY_PREFS,
    }),

  completeSurvey: (prefs) => {
    set({ surveyCompleted: true, preferences: prefs });
    const { userId } = useAuthStore.getState();
    if (userId) {
      userService.saveSurvey(userId, mapPreferencesToApi(prefs)).catch(() => {
        // fire-and-forget
      });
    }
  },
}));
