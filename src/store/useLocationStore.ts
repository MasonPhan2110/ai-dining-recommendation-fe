import * as ExpoLocation from "expo-location";
import { create } from "zustand";
import { Platform } from "react-native";
import { AppLocation, PermissionStatus } from "@/src/types/location";

type LocationState = {
  location: AppLocation | null;
  permissionStatus: PermissionStatus;
  isLoading: boolean;
  error: string | null;
  /** Prevents initialize() from running more than once */
  _initialized: boolean;

  /** Called once on app start — checks permission silently, fetches if granted */
  initialize: () => Promise<void>;
  /** Prompts for permission (if needed) then fetches GPS coords + reverse geocode */
  requestPermissionAndFetch: () => Promise<void>;
  /** Overwrites location with a user-chosen value, source = 'manual' */
  setManualLocation: (location: AppLocation) => void;
  /** Clears manual override, re-fetches GPS */
  resetToGPS: () => Promise<void>;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  location: null,
  permissionStatus: "undetermined",
  isLoading: false,
  error: null,
  _initialized: false,

  // ── Initialize ──────────────────────────────────────────────────────────────
  initialize: async () => {
    if (get()._initialized) return;
    set({ _initialized: true });

    // Check existing permission WITHOUT showing the system dialog
    const { status } = await ExpoLocation.getForegroundPermissionsAsync();
    set({ permissionStatus: status as PermissionStatus });

    if (status === "granted") {
      await get().requestPermissionAndFetch();
    }
  },

  // ── GPS fetch ───────────────────────────────────────────────────────────────
  requestPermissionAndFetch: async () => {
    set({ isLoading: true, error: null });

    // This shows the system dialog if status is undetermined
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    set({ permissionStatus: status as PermissionStatus });

    if (status !== "granted") {
      set({ isLoading: false, error: "Location permission denied." });
      return;
    }

    try {
      const pos = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      // reverseGeocodeAsync uses the device's native geocoder (iOS/Android only).
      // On web it is not supported, so we skip it entirely.
      let city: string | undefined;
      let district: string | undefined;
      if (Platform.OS !== "web") {
        try {
          const [geo] = await ExpoLocation.reverseGeocodeAsync({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          city = geo.city ?? geo.region ?? undefined;
          district = geo.district ?? geo.subregion ?? undefined;
        } catch {
          // Not fatal — location still usable without city name
        }
      }

      const parts = [district, city].filter(Boolean);
      const label = parts.length > 0 ? parts.join(" · ") : "Current location";

      set({
        location: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city,
          district,
          label,
          source: "gps",
        },
        isLoading: false,
        error: null,
      });
    } catch {
      set({
        isLoading: false,
        error: "Could not retrieve your location. Please try again.",
      });
    }
  },

  // ── Manual override ─────────────────────────────────────────────────────────
  setManualLocation: (location) => {
    set({ location, error: null });
  },

  // ── Reset to GPS ─────────────────────────────────────────────────────────────
  resetToGPS: async () => {
    set({ location: null });
    await get().requestPermissionAndFetch();
  },
}));
