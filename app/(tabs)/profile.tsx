import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

// ── Reusable row components ────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: IoniconName;
  label: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowBorder,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={16} color={colors.primary} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Avatar + identity ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>F</Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.displayName}>Foodie</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>🌟 Food Explorer</Text>
            </View>
          </View>
        </View>

        {/* ── Quick stats ── */}
        <View style={styles.statsRow}>
          {[
            { value: "3",  label: "Saved" },
            { value: "12", label: "Searches" },
            { value: "2",  label: "This week" },
          ].map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Preferences ── */}
        <SectionHeader title="Preferences" />
        <View style={styles.card}>
          <SettingRow icon="wallet-outline"    label="Default budget"  value="Under 300k" />
          <SettingRow icon="restaurant-outline" label="Cuisines"        value="Vietnamese, Japanese" />
          <SettingRow icon="sparkles-outline"  label="Vibe"            value="Quiet, Cozy" />
          <SettingRow icon="location-outline"  label="Location"        value="Hoan Kiem" last />
        </View>

        {/* ── App settings ── */}
        <SectionHeader title="App" />
        <View style={styles.card}>
          <SettingRow icon="notifications-outline" label="Notifications" value="On" />
          <SettingRow icon="language-outline"      label="Language"      value="English" />
          <SettingRow icon="information-circle-outline" label="About"    last />
        </View>

        {/* Version footer */}
        <Text style={styles.version}>Version 1.0.0 · AI Dining</Text>
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
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },

  // ── Avatar section ──
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  avatarInitials: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.extrabold,
    color: "#fff",
  },
  identity: {
    gap: 6,
  },
  displayName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  levelBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },

  // ── Stats row ──
  statsRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 16,
    ...shadows.sm,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Section header ──
  sectionHeader: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginTop: 8,
    marginBottom: 2,
  },

  // ── Settings card ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowPressed: {
    backgroundColor: colors.divider,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowValue: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
    maxWidth: 160,
    textAlign: "right",
  },

  // ── Footer ──
  version: {
    textAlign: "center",
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    marginTop: 16,
  },
});
