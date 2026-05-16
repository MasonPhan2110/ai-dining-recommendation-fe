import { colors, fonts, fontSizes } from "@/src/config/theme";
import { useAppStore } from "@/src/store/useAppStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  name,
  activeName,
  color,
  focused,
}: {
  name: IoniconName;
  activeName: IoniconName;
  color: string;
  focused: boolean;
}) {
  return (
    <Ionicons name={focused ? activeName : name} size={22} color={color} />
  );
}

export default function TabsLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const surveyCompleted = useAuthStore((s) => s.surveyCompleted);
  const userId = useAuthStore((s) => s.userId);
  const loadSaved = useAppStore((s) => s.loadSaved);

  useEffect(() => {
    if (isLoggedIn && userId) loadSaved(userId);
  }, [isLoggedIn, userId]);

  if (!isLoggedIn) return <Redirect href="/login" />;
  if (!surveyCompleted) return <Redirect href="/survey" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="home-outline"
              activeName="home"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="search-outline"
              activeName="search"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: "AI Picks",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="sparkles-outline"
              activeName="sparkles"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="heart-outline"
              activeName="heart"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="person-outline"
              activeName="person"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    height: Platform.OS === "ios" ? 82 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.3,
    marginTop: 2,
  },
});
