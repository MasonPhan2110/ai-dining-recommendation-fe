import { RestaurantCard } from "@/src/components/RestaurantCard";
import {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  textStyles,
} from "@/src/config/theme";
import { useAppStore } from "@/src/store/useAppStore";
import { Restaurant } from "@/src/types/restaurant";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

function EmptyState() {
  return (
    <Animated.View
      style={styles.empty}
      entering={FadeInUp.duration(500).delay(200)}
    >
      <Text style={styles.emptyEmoji}>{"\uD83D\uDD16"}</Text>
      <Text style={styles.emptyTitle}>No saved places yet</Text>
      <Text style={styles.emptyBody}>
        Tap the heart on any restaurant to save it here for later.
      </Text>
    </Animated.View>
  );
}

export default function SavedScreen() {
  const restaurants = useAppStore((s) => s.savedRestaurants);

  const renderItem = ({
    item,
    index,
  }: {
    item: Restaurant;
    index: number;
  }) => <RestaurantCard item={item} index={index} />;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header with staggered entrance */}
      <Animated.View
        style={styles.header}
        entering={FadeInDown.duration(400).delay(80)}
      >
        <Text style={styles.title}>Saved</Text>
        {restaurants.length > 0 && (
          <Text style={styles.count}>{restaurants.length} places</Text>
        )}
      </Animated.View>

      <View style={styles.rule} />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  title: {
    ...textStyles.displaySmall,
  },
  count: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.sm,
    color: colors.textTertiary,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 14,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    ...textStyles.headingLarge,
    textAlign: "center",
  },
  emptyBody: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: fontSizes.base * lineHeights.normal,
  },
});
