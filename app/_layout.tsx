import { useAuthStore } from "@/src/store/useAuthStore";
import { type Href, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function useAuthRedirect() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const surveyCompleted = useAuthStore((s) => s.surveyCompleted);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!segments.length) return;

    const seg = segments[0] as string;
    const atLogin = seg === "login";
    const atSurvey = seg === "survey";

    if (!isLoggedIn && !atLogin) {
      router.replace("/login" as Href);
    } else if (isLoggedIn && !surveyCompleted && !atSurvey) {
      router.replace("/survey" as Href);
    } else if (isLoggedIn && surveyCompleted && (atLogin || atSurvey)) {
      router.replace("/(tabs)" as Href);
    }
  }, [isLoggedIn, surveyCompleted, segments, router]);
}

export default function RootLayout() {
  useAuthRedirect();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ animation: "none" }} />
        <Stack.Screen name="survey" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
        <Stack.Screen
          name="restaurant/[id]"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
