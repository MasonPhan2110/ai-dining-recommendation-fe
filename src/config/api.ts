import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Resolve the backend URL at runtime:
 *  - Web / iOS simulator  → localhost
 *  - Android emulator     → 10.0.2.2  (maps to host localhost)
 *  - Physical device      → same host that served the Expo bundle
 *                           (expo-constants gives us the dev-server IP)
 */
function getApiBaseUrl(): string {
  if (Platform.OS !== "android") return "http://localhost:3000";

  // Physical Android device — use the Expo dev-server host so the phone
  // can reach the backend on the same machine as the dev server.
  const debuggerHost =
    Constants.expoConfig?.hostUri ?? // Expo SDK 46+
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ?? // older fallback
    (Constants as any).manifest?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(":")[0]; // strip port
    return `http://${host}:3000`;
  }

  // Android emulator fallback
  return "http://10.0.2.2:3000";
}

export const API_BASE_URL = getApiBaseUrl();
