import { useAuthStore } from "@/src/store/useAuthStore";
import { colors } from "@/src/theme/colors";
import { fontSizes, fontWeights } from "@/src/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";

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
    <Ionicons name={focused ? activeName : name} size={24} color={color} />
  );
}

export default function TabsLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const surveyCompleted = useAuthStore((s) => s.surveyCompleted);

  if (!isLoggedIn) return <Redirect href="/login" />;
  if (!surveyCompleted) return <Redirect href="/survey" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 80 : 64,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 24 : 10,
          shadowColor: "#2C1810",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.07,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: fontSizes.xs,
          fontWeight: fontWeights.semibold,
          marginTop: 2,
        },
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
