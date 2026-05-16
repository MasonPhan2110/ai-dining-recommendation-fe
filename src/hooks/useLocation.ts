import { useEffect } from "react";
import { useLocationStore } from "@/src/store/useLocationStore";

/**
 * Thin wrapper over useLocationStore.
 * Handles initialization on first mount and exposes derived display values.
 * Use this hook in UI components — use the store directly for actions.
 */
export function useLocation() {
  const location = useLocationStore((s) => s.location);
  const permissionStatus = useLocationStore((s) => s.permissionStatus);
  const isLoading = useLocationStore((s) => s.isLoading);
  const error = useLocationStore((s) => s.error);
  const initialize = useLocationStore((s) => s.initialize);
  const requestPermissionAndFetch = useLocationStore(
    (s) => s.requestPermissionAndFetch,
  );
  const setManualLocation = useLocationStore((s) => s.setManualLocation);
  const resetToGPS = useLocationStore((s) => s.resetToGPS);

  // Kick off permission check + silent GPS fetch on first mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // ── Derived display values ───────────────────────────────────────────────
  const displayLabel = (() => {
    if (isLoading) return "Detecting location...";
    if (location?.label) {
      return location.source === "manual"
        ? `${location.label} · Manual`
        : location.label;
    }
    if (permissionStatus === "denied") return "Location unavailable";
    if (permissionStatus === "undetermined") return "Set your location";
    return "Set your location";
  })();

  const isPermissionDenied = permissionStatus === "denied";
  const isPermissionGranted = permissionStatus === "granted";
  const hasLocation = location !== null;
  const isManual = location?.source === "manual";

  return {
    location,
    permissionStatus,
    isLoading,
    error,
    displayLabel,
    isPermissionDenied,
    isPermissionGranted,
    hasLocation,
    isManual,
    // Actions
    requestPermissionAndFetch,
    setManualLocation,
    resetToGPS,
  };
}
