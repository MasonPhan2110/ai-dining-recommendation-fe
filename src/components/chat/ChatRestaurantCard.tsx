import {
  colors,
  fonts,
  fontSizes,
  radius,
  shadows,
} from "@/src/config/theme";
import { AIChatRestaurant } from "@/src/types/ai-chat";
import { getCuisineConfig } from "@/src/utils/cuisineConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PRICE_LABEL: Record<number, string> = {
  1: "\u20AB",
  2: "\u20AB\u20AB",
  3: "\u20AB\u20AB\u20AB",
  4: "\u20AB\u20AB\u20AB\u20AB",
};

export function ChatRestaurantCard({ item }: { item: AIChatRestaurant }) {
  const router = useRouter();
  const primaryCuisine = item.cuisine.split(",")[0].trim();
  const capitalised =
    primaryCuisine.charAt(0).toUpperCase() +
    primaryCuisine.slice(1).toLowerCase();
  const { color, softBg, emoji } = getCuisineConfig(capitalised);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <View style={[styles.badge, { backgroundColor: softBg }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.cuisine, { color }]}>{capitalised}</Text>
      </View>

      <View style={styles.meta}>
        {item.rating != null && (
          <View style={styles.metaRow}>
            <Ionicons name="star" size={10} color={colors.warning} />
            <Text style={styles.metaText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
        {item.distance != null && (
          <View style={styles.metaRow}>
            <Ionicons
              name="navigate-outline"
              size={10}
              color={colors.textTertiary}
            />
            <Text style={styles.metaText}>
              {item.distance.toFixed(1)} km
            </Text>
          </View>
        )}
        {item.priceRange != null && (
          <Text style={styles.price}>
            {PRICE_LABEL[item.priceRange] ?? "\u20AB\u20AB"}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 12,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.82,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  cuisine: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.3,
  },
  meta: {
    alignItems: "flex-end",
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
  },
  price: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
});
