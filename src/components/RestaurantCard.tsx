import {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  radius,
  shadows,
} from "@/src/config/theme";
import { useAppStore } from "@/src/store/useAppStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Restaurant } from "@/src/types/restaurant";
import { getCuisineConfig } from "@/src/utils/cuisineConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  item: Restaurant;
  index?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RestaurantCard({ item, index = 0 }: Props) {
  const router = useRouter();
  const savedRestaurants = useAppStore((s) => s.savedRestaurants);
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const userId = useAuthStore((s) => s.userId);
  const isSaved = savedRestaurants.some((r) => r.id === item.id);
  const { color, softBg, emoji } = getCuisineConfig(item.cuisine);

  // Restrained save feedback — scale to 1.15, no spring bounce
  const saveScale = useSharedValue(1);
  const saveAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const handleSave = useCallback(() => {
    toggleSaved(item.id, userId);
    saveScale.value = withTiming(1.15, { duration: 100 }, () => {
      saveScale.value = withTiming(1, { duration: 180 });
    });
  }, [item.id, userId, toggleSaved, saveScale]);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 70)}
      style={styles.wrapper}
    >
      <AnimatedPressable
        style={styles.card}
        onPress={() => router.push(`/restaurant/${item.id}`)}
      >
        {/* Cuisine-colored header strip */}
        <View style={[styles.cardHeader, { backgroundColor: softBg }]}>
          <Text style={styles.headerEmoji}>{emoji}</Text>
          <View style={[styles.cuisinePill, { borderColor: color + "40" }]}>
            <Text style={[styles.cuisinePillText, { color }]}>
              {item.cuisine}
            </Text>
          </View>
        </View>

        {/* Card body */}
        <View style={styles.body}>
          {/* Name + Save */}
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Pressable onPress={handleSave} hitSlop={12}>
              <Animated.View style={saveAnimStyle}>
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={20}
                  color={isSaved ? colors.accent : colors.textTertiary}
                />
              </Animated.View>
            </Pressable>
          </View>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{item.priceRange}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{item.distanceKm} km</Text>
          </View>

          {/* Match badge */}
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{item.matchScore}% match</Text>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* AI explanation */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText} numberOfLines={2}>
              {item.explanation}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.xl,
    ...shadows.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },

  // Cuisine header
  cardHeader: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerEmoji: {
    fontSize: 26,
  },
  cuisinePill: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cuisinePillText: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.4,
    textTransform: "uppercase" as const,
  },

  // Body
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    fontFamily: fonts.display.semiBold,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rating: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.sm,
    color: colors.warning,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
  },
  metaText: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  matchBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  matchText: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.xs,
    color: colors.accent,
    letterSpacing: 0.3,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: colors.divider,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  explanationBox: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  explanationText: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
});
