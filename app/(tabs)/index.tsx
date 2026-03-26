import { QuickChips } from "@/src/components/QuickChips";
import { RestaurantCard } from "@/src/components/RestaurantCard";
import { SearchBox } from "@/src/components/SearchBox";
import { SectionTitle } from "@/src/components/SectionTitle";
import { useAppStore } from "@/src/store/useAppStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { Restaurant } from "@/src/types/restaurant";
import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getGreeting = (): { text: string; emoji: string } => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
};

export default function HomeScreen() {
  const query = useAppStore((s) => s.query);
  const setQuery = useAppStore((s) => s.setQuery);
  const restaurants = useAppStore((s) => s.restaurants);

  // Stable callbacks — prevent FlatList from re-rendering items on every parent render
  const renderItem = useCallback(
    ({ item, index }: { item: Restaurant; index: number }) => (
      <RestaurantCard item={item} index={index} />
    ),
    [],
  );

  const handleChipSelect = useCallback(
    (value: string) => setQuery(value),
    [setQuery],
  );

  const { text: greetText, emoji: greetEmoji } = getGreeting();

  return (
    // edges={["top"]} — tab bar handles bottom safe area itself
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Location pill */}
            <View style={styles.locationPill}>
              <Text style={styles.locationDot}>📍</Text>
              <Text style={styles.locationText}>Hoan Kiem, Hanoi</Text>
            </View>

            {/* Greeting + headline */}
            <View style={styles.heroText}>
              <Text style={styles.greeting}>
                {greetText} {greetEmoji}
              </Text>
              <Text style={styles.headline}>
                {"What are you\ncraving today?"}
              </Text>
            </View>

            {/* AI search bar */}
            <SearchBox value={query} onChangeText={setQuery} />

            {/* Quick filter chips */}
            <QuickChips onSelect={handleChipSelect} />

            {/* Section header */}
            <View style={styles.sectionRow}>
              <SectionTitle title="AI picks for you" icon="✦" />
              <Text style={styles.resultCount}>{restaurants.length} spots</Text>
            </View>
          </View>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListFooterComponent={<View style={{ height: 40 }} />}
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
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    gap: 18,
    paddingTop: 16,
    marginBottom: 4,
  },

  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationDot: {
    fontSize: 12,
  },
  locationText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },

  heroText: {
    gap: 6,
  },
  greeting: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  headline: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.black,
    color: colors.textPrimary,
    lineHeight: fontSizes.xxxl * lineHeights.tight,
    letterSpacing: -0.5,
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  resultCount: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textTertiary,
  },
});
