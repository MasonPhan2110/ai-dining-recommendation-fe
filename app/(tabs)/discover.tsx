import { useAppStore } from "@/src/store/useAppStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { CUISINE_CONFIG } from "@/src/utils/cuisineConfig";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Cuisine tiles ──────────────────────────────────────────────────────────
const CUISINES = Object.entries(CUISINE_CONFIG).map(([name, cfg]) => ({
  name,
  ...cfg,
}));

// ── Vibe chips ─────────────────────────────────────────────────────────────
const VIBES = [
  { label: "Romantic",    emoji: "🕯️", value: "Date night" },
  { label: "Group dining",emoji: "👥", value: "Group" },
  { label: "Quick bite",  emoji: "⚡", value: "Quick" },
  { label: "Late night",  emoji: "🌙", value: "Late night" },
  { label: "Outdoor",     emoji: "🌿", value: "Outdoor" },
  { label: "Solo",        emoji: "🎧", value: "Solo" },
];

// ── Budget bands ────────────────────────────────────────────────────────────
const BUDGETS = [
  { label: "Budget-friendly", sub: "Under 200k / person", emoji: "💸", value: "Under 200k" },
  { label: "Mid-range",       sub: "200k – 400k / person", emoji: "🍽️", value: "Mid range" },
  { label: "Premium",         sub: "400k+ / person",       emoji: "👑", value: "Premium" },
];

export default function DiscoverScreen() {
  const setQuery = useAppStore((s) => s.setQuery);
  const router = useRouter();

  const handleSelect = (value: string) => {
    setQuery(value);
    // Navigate to home tab so the user sees filtered results
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Browse & Explore</Text>
          <Text style={styles.subtitle}>
            Tap a category to see AI picks
          </Text>
        </View>

        {/* ── By Cuisine ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>🍴  By Cuisine</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tilesRow}
          >
            {CUISINES.map((c) => (
              <Pressable
                key={c.name}
                style={({ pressed }) => [
                  styles.cuisineTile,
                  { backgroundColor: c.softBg },
                  pressed && styles.tilePressed,
                ]}
                onPress={() => handleSelect(c.name)}
              >
                <Text style={styles.tileEmoji}>{c.emoji}</Text>
                <Text style={[styles.tileName, { color: c.color }]}>{c.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── By Vibe ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>✨  Find your vibe</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vibesRow}
          >
            {VIBES.map((v) => (
              <Pressable
                key={v.value}
                style={({ pressed }) => [
                  styles.vibeChip,
                  pressed && styles.tilePressed,
                ]}
                onPress={() => handleSelect(v.value)}
              >
                <Text style={styles.vibeEmoji}>{v.emoji}</Text>
                <Text style={styles.vibeLabel}>{v.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── By Budget ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>💰  Set your budget</Text>
          <View style={styles.budgetGrid}>
            {BUDGETS.map((b) => (
              <Pressable
                key={b.value}
                style={({ pressed }) => [
                  styles.budgetCard,
                  pressed && styles.tilePressed,
                ]}
                onPress={() => handleSelect(b.value)}
              >
                <Text style={styles.budgetEmoji}>{b.emoji}</Text>
                <Text style={styles.budgetLabel}>{b.label}</Text>
                <Text style={styles.budgetSub}>{b.sub}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 20,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 4,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
  },

  section: {
    marginTop: 24,
    gap: 14,
  },
  sectionLabel: {
    paddingHorizontal: 16,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },

  // ── Cuisine tiles (horizontal scroll) ──
  tilesRow: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: "row",
  },
  cuisineTile: {
    width: 96,
    height: 88,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...shadows.sm,
  },
  tilePressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
  tileEmoji: {
    fontSize: 26,
  },
  tileName: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.2,
  },

  // ── Vibe chips (horizontal scroll) ──
  vibesRow: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: "row",
  },
  vibeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  vibeEmoji: {
    fontSize: 15,
  },
  vibeLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },

  // ── Budget cards (3-column grid) ──
  budgetGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
  },
  budgetCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    gap: 4,
    alignItems: "flex-start",
    ...shadows.sm,
  },
  budgetEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  budgetLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  budgetSub: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
});
