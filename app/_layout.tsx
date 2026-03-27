import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: "none" }} />
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
