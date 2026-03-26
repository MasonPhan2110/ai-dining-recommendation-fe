import { useAppStore } from "@/src/store/useAppStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { getCuisineConfig } from "@/src/utils/cuisineConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const restaurant = useAppStore((s) => s.restaurants.find((r) => r.id === id));
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSaved = useAppStore((s) => s.toggleSaved);

  // One scale drives the CTA bar save button
  const ctaScale = useRef(new Animated.Value(1)).current;

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.errorBtn}>
          <Text style={styles.errorBtnText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isSaved = savedIds.includes(restaurant.id);
  const { color: accentColor, softBg, emoji } = getCuisineConfig(restaurant.cuisine);

  const triggerSave = (scaleAnim: Animated.Value) => {
    toggleSaved(restaurant.id);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.35,
        useNativeDriver: true,
        speed: 60,
        bounciness: 14,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 35,
        bounciness: 8,
      }),
    ]).start();
  };

  return (
    // edges={["bottom"]} only — hero goes full-bleed to top of screen
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Full-bleed hero ── */}
        <View style={[styles.hero, { backgroundColor: accentColor }]}>
          {/* Back button — offset by status bar height */}
          <Pressable
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>

          {/* Large cuisine emoji — visual focal point */}
          <Text style={styles.heroEmoji}>{emoji}</Text>

          {/* Restaurant name + meta overlaid at bottom of hero */}
          <View style={styles.heroOverlay}>
            <Text style={styles.heroName} numberOfLines={2}>
              {restaurant.name}
            </Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>
                  ★ {restaurant.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={styles.heroMetaText}>{restaurant.cuisine}</Text>
              <Text style={styles.heroMetaDot}>·</Text>
              <Text style={styles.heroMetaText}>{restaurant.distanceKm} km away</Text>
            </View>
          </View>
        </View>

        {/* ── Content card (overlaps hero) ── */}
        <View style={styles.card}>
          {/* Price · Match · Tags row */}
          <View style={styles.topRow}>
            <Text style={styles.price}>{restaurant.priceRange} / person</Text>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>✦ {restaurant.matchScore}% match</Text>
            </View>
          </View>

          <View style={styles.tags}>
            {restaurant.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: softBg }]}>
                <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* AI explanation */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>✦  Why AI picked this</Text>
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>{restaurant.explanation}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📍  Address</Text>
            <Text style={styles.addressText}>{restaurant.address}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky CTA bar ── */}
      <View style={styles.ctaBar}>
        {/* Save button */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaSecondary,
            pressed && styles.ctaPressed,
          ]}
          onPress={() => triggerSave(ctaScale)}
        >
          <Animated.View
            style={[styles.ctaBtnInner, { transform: [{ scale: ctaScale }] }]}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={18}
              color={isSaved ? colors.primary : colors.textPrimary}
            />
            <Text
              style={[
                styles.ctaSecondaryText,
                isSaved && styles.ctaSecondaryTextSaved,
              ]}
            >
              {isSaved ? "Saved" : "Save"}
            </Text>
          </Animated.View>
        </Pressable>

        {/* Maps button */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaPrimary,
            { backgroundColor: accentColor },
            pressed && styles.ctaPressed,
          ]}
        >
          <Ionicons name="map-outline" size={18} color="#fff" />
          <Text style={styles.ctaPrimaryText}>Open in Maps</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },

  // ── Error ──
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  errorBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  errorBtnText: {
    color: "#fff",
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.base,
  },

  // ── Hero (full-bleed, no safe area top) ──
  hero: {
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "rgba(0,0,0,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: {
    fontSize: 72,
    marginBottom: 40,
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.32)",
    paddingHorizontal: 20,
    paddingTop: 24,       // was 14 — breathing room above name
    paddingBottom: 42,    // was 20 — card overlaps by 24px, so this gives ~18px visual space below meta
    gap: 10,              // was 6 — more air between name and meta row
  },
  heroName: {
    fontSize: fontSizes.xxl,   // was xl (24) — bigger, more presence
    fontWeight: fontWeights.extrabold,
    color: "#fff",
    letterSpacing: -0.4,
    lineHeight: fontSizes.xxl * lineHeights.snug,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: "#fff",
  },
  heroMetaText: {
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.85)",
    fontWeight: fontWeights.medium,
  },
  heroMetaDot: {
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.5)",
  },

  // ── Content card (overlaps hero by 24px) ──
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
    gap: 16,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  price: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  matchBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  matchText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    letterSpacing: 0.2,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  explanationBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: 16,
  },
  explanationText: {
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  addressText: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    lineHeight: fontSizes.base * lineHeights.normal,
  },

  // ── CTA bar ──
  ctaBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  ctaSecondary: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  ctaSecondaryText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  ctaSecondaryTextSaved: {
    color: colors.primary,
  },
  ctaPrimary: {
    flex: 2,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaPrimaryText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: "#fff",
  },
  ctaPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.977 }],
  },
});
