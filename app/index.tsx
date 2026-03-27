import { useAuthStore } from "@/src/store/useAuthStore";
import { Redirect } from "expo-router";

// Gateway: redirect to the correct screen based on auth state.
// Renders nothing — <Redirect> does an immediate replace with no flash.
export default function Index() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const surveyCompleted = useAuthStore((s) => s.surveyCompleted);

  if (!isLoggedIn) return <Redirect href="/login" />;
  if (!surveyCompleted) return <Redirect href="/survey" />;
  return <Redirect href="/(tabs)" />;
}
