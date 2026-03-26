import { RestaurantCard } from "@/src/components/RestaurantCard";
import { useAppStore } from "@/src/store/useAppStore";
import { colors } from "@/src/theme/colors";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { Restaurant } from "@/src/types/restaurant";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🔖</Text>
      <Text style={styles.emptyTitle}>No saved places yet</Text>
      <Text style={styles.emptyBody}>
        Tap the heart on any restaurant to save it here for later.
      </Text>
    </View>
  );
}

export default function SavedScreen() {
  const allRestaurants = useAppStore((s) => s.restaurants);
  const savedIds = useAppStore((s) => s.savedIds);
  // filter in component body, NOT inside the selector — selector must return a stable reference
  const restaurants = allRestaurants.filter((r) => savedIds.includes(r.id));

  const renderItem = ({
    item,
    index,
  }: {
    item: Restaurant;
    index: number;
  }) => <RestaurantCard item={item} index={index} />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        {restaurants.length > 0 && (
          <Text style={styles.count}>{restaurants.length} places</Text>
        )}
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={<View style={{ height: 32 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
  },
  count: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textTertiary,
  },
  content: {
    paddingHorizontal: 16,
  },
  empty: {
    alignItems: "center",
    paddingTop: 64,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 52,
  },
  emptyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptyBody: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: fontSizes.base * lineHeights.normal,
  },
});
