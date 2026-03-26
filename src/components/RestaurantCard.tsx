import { useAppStore } from "@/src/store/useAppStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { Restaurant } from "@/src/types/restaurant";
import { getCuisineConfig } from "@/src/utils/cuisineConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: Restaurant;
  index?: number;
};

export function RestaurantCard({ item, index = 0 }: Props) {
  const router = useRouter();
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const isSaved = savedIds.includes(item.id);
  const { color, softBg, emoji } = getCuisineConfig(item.cuisine);

  // ── Entrance animation (staggered fade + slide up) ──
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(
    entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }),
  ).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 380,
      delay: index * 90,
      useNativeDriver: true,
    }).start();
  }, [entranceAnim, index]);

  // ── Save button spring ──
  const saveScale = useRef(new Animated.Value(1)).current;

  const handleSave = () => {
    toggleSaved(item.id);
    Animated.sequence([
      Animated.spring(saveScale, {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 60,
        bounciness: 14,
      }),
      Animated.spring(saveScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 35,
        bounciness: 8,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity: entranceAnim, transform: [{ translateY }] },
      ]}
    >
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => router.push(`/restaurant/${item.id}`)}
      >
        {/* ── Cuisine-colored header ── */}
        <View style={[styles.cardHeader, { backgroundColor: softBg }]}>
          <Text style={styles.headerEmoji}>{emoji}</Text>
          {/* Cuisine badge: accent-color border + text */}
          <View style={[styles.cuisinePill, { borderColor: color + "50" }]}>
            <Text style={[styles.cuisinePillText, { color }]}>
              {item.cuisine}
            </Text>
          </View>
        </View>

        {/* ── Card body ── */}
        <View style={styles.body}>
          {/* Name + Save */}
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Pressable onPress={handleSave} hitSlop={12}>
              <Animated.View style={{ transform: [{ scale: saveScale }] }}>
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={21}
                  color={isSaved ? colors.primary : colors.textTertiary}
                />
              </Animated.View>
            </Pressable>
          </View>

          {/* Meta row: rating · price · distance */}
          <View style={styles.metaRow}>
            <Text style={styles.rating}>★ {item.rating.toFixed(1)}</Text>
            <Text style={styles.metaSep}>·</Text>
            <Text style={styles.metaText}>{item.priceRange}</Text>
            <Text style={styles.metaSep}>·</Text>
            <Text style={styles.metaText}>{item.distanceKm} km</Text>
          </View>

          {/* Match badge */}
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>✦ {item.matchScore}% match</Text>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* AI explanation callout */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText} numberOfLines={2}>
              {item.explanation}
            </Text>
          </View>
        </View>
      </Pressable>
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
  },
  pressed: {
    opacity: 0.93,
    transform: [{ scale: 0.984 }],
  },

  // ── Cuisine header ──
  cardHeader: {
    height: 68,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerEmoji: {
    fontSize: 28,
  },
  cuisinePill: {
    borderRadius: radius.full,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cuisinePillText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
  },

  // ── Body ──
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 9,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rating: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.warning,
  },
  metaSep: {
    fontSize: fontSizes.sm,
    color: colors.textTertiary,
  },
  metaText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  matchBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  matchText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    letterSpacing: 0.2,
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
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
  },
  explanationBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 2,
  },
  explanationText: {
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
});
