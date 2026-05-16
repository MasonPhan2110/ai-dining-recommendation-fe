import { LocationPill } from "@/src/components/LocationPill";
import { PermissionBanner } from "@/src/components/PermissionBanner";
import { QuickChips } from "@/src/components/QuickChips";
import { RestaurantCard } from "@/src/components/RestaurantCard";
import { SearchBox } from "@/src/components/SearchBox";
import { SectionTitle } from "@/src/components/SectionTitle";
import {
  colors,
  fonts,
  fontSizes,
  radius,
  textStyles,
} from "@/src/config/theme";
import { useLocation } from "@/src/hooks/useLocation";
import { useAppStore } from "@/src/store/useAppStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Restaurant } from "@/src/types/restaurant";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export default function HomeScreen() {
  const query = useAppStore((s) => s.query);
  const setQuery = useAppStore((s) => s.setQuery);
  const restaurants = useAppStore((s) => s.restaurants);
  const isLoading = useAppStore((s) => s.isLoading);
  const error = useAppStore((s) => s.error);
  const fetchFeed = useAppStore((s) => s.fetchFeed);
  const fetchNextPage = useAppStore((s) => s.fetchNextPage);
  const isLoadingMore = useAppStore((s) => s.isLoadingMore);

  const userId = useAuthStore((s) => s.userId);
  const { location, isPermissionDenied } = useLocation();

  useEffect(() => {
    fetchFeed({
      query,
      userId,
      lat: location?.latitude,
      lng: location?.longitude,
    });
  }, [query, userId, location?.latitude, location?.longitude, fetchFeed]);

  const renderItem = useCallback(
    ({ item, index }: { item: Restaurant; index: number }) => (
      <RestaurantCard item={item} index={index} />
    ),
    [],
  );

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeed({
      query,
      userId,
      lat: location?.latitude,
      lng: location?.longitude,
    });
    setRefreshing(false);
  }, [fetchFeed, query, userId, location?.latitude, location?.longitude]);

  const handleChipSelect = useCallback(
    (value: string) => setQuery(value),
    [setQuery],
  );

  const greetText = getGreeting();

  const sectionTitle = query.trim()
    ? `Results for \u201C${query}\u201D`
    : location
      ? "AI picks for you"
      : "Popular near you";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Location pill — staggered entrance */}
            <Animated.View entering={FadeInDown.duration(400).delay(80)}>
              <LocationPill />
            </Animated.View>

            {isPermissionDenied && (
              <Animated.View entering={FadeInDown.duration(350).delay(120)}>
                <PermissionBanner />
              </Animated.View>
            )}

            {/* Hero — the single dominant element */}
            <Animated.View
              style={styles.heroText}
              entering={FadeInDown.duration(500).delay(160)}
            >
              <Text style={styles.greeting}>{greetText}</Text>
              <Text style={styles.headline}>
                {"What are you\ncraving today?"}
              </Text>
            </Animated.View>

            {/* Search + chips */}
            <Animated.View entering={FadeInDown.duration(400).delay(280)}>
              <SearchBox value={query} onChangeText={setQuery} />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(360)}>
              <QuickChips onSelect={handleChipSelect} />
            </Animated.View>

            {/* Divider rule */}
            <View style={styles.rule} />

            {/* Section header */}
            <Animated.View
              style={styles.sectionRow}
              entering={FadeInUp.duration(350).delay(420)}
            >
              <SectionTitle title={sectionTitle} icon="✦" />
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Text style={styles.resultCount}>
                  {restaurants.length} spots
                </Text>
              )}
            </Animated.View>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              color={colors.accent}
              style={{ paddingVertical: 24 }}
            />
          ) : (
            <View style={{ height: 40 }} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    gap: 18,
    paddingTop: 16,
    marginBottom: 8,
  },
  heroText: {
    gap: 4,
    paddingTop: 8,
  },
  greeting: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.sm,
    color: colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  headline: {
    ...textStyles.displayMedium,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultCount: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.sm,
    color: colors.textTertiary,
  },
  errorBanner: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentMuted,
  },
  errorText: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.sm,
    color: colors.error,
  },
});
