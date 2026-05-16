import {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  radius,
  shadows,
  textStyles,
} from "@/src/config/theme";
import { useAuthStore } from "@/src/store/useAuthStore";
import {
  userService,
  UserProfileResponse,
} from "@/src/services/user.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingRow({
  icon,
  label,
  value,
  last = false,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  value?: string;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowBorder,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={15} color={colors.accent} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Ionicons
          name="chevron-forward"
          size={14}
          color={colors.textTertiary}
        />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const userId = useAuthStore((s) => s.userId);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    userService
      .getProfile(userId)
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const initials = profile?.email?.charAt(0).toUpperCase() ?? "?";
  const email = profile?.email ?? "";
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear().toString()
    : "";

  const cuisines =
    profile?.preferences?.cuisine
      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
      .join(", ") ?? "\u2013";
  const vibes =
    profile?.preferences?.vibe
      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
      .join(", ") ?? "\u2013";
  const budgetMap: Record<number, string> = {
    1: "Under 200k",
    2: "200k\u2013400k",
    3: "400k+",
    4: "600k+",
  };
  const budget =
    profile?.preferences != null
      ? (budgetMap[profile.preferences.budget] ?? "\u2013")
      : "\u2013";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {loading ? (
          <ActivityIndicator
            color={colors.accent}
            style={{ marginTop: 48 }}
          />
        ) : (
          <>
            {/* Avatar + identity — hero element */}
            <Animated.View
              style={styles.avatarSection}
              entering={FadeInDown.duration(450).delay(80)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <View style={styles.identity}>
                <Text style={styles.displayName}>{email}</Text>
                {memberSince ? (
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>
                      Member since {memberSince}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Animated.View>

            <View style={styles.rule} />

            {/* Preferences */}
            <Animated.View entering={FadeInDown.duration(400).delay(180)}>
              <SectionHeader title="Preferences" />
              <View style={styles.card}>
                <SettingRow
                  icon="wallet-outline"
                  label="Budget"
                  value={budget}
                />
                <SettingRow
                  icon="restaurant-outline"
                  label="Cuisines"
                  value={cuisines}
                />
                <SettingRow
                  icon="sparkles-outline"
                  label="Vibe"
                  value={vibes}
                  last
                />
              </View>
            </Animated.View>

            {/* App settings */}
            <Animated.View entering={FadeInDown.duration(400).delay(280)}>
              <SectionHeader title="App" />
              <View style={styles.card}>
                <SettingRow
                  icon="notifications-outline"
                  label="Notifications"
                  value="On"
                />
                <SettingRow
                  icon="language-outline"
                  label="Language"
                  value="English"
                />
                <SettingRow
                  icon="information-circle-outline"
                  label="About"
                  last
                />
              </View>
            </Animated.View>

            {/* Logout */}
            <Animated.View entering={FadeInDown.duration(350).delay(360)}>
              <Pressable
                style={({ pressed }) => [
                  styles.logoutBtn,
                  pressed && styles.logoutPressed,
                ]}
                onPress={handleLogout}
              >
                <Ionicons
                  name="log-out-outline"
                  size={17}
                  color={colors.error}
                />
                <Text style={styles.logoutText}>Sign Out</Text>
              </Pressable>
            </Animated.View>

            <Text style={styles.version}>Version 1.0.0</Text>
          </>
        )}
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },

  // Avatar section — hero
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: fonts.display.bold,
    fontSize: fontSizes.xxl,
    color: colors.textInverse,
  },
  identity: {
    gap: 6,
    flex: 1,
  },
  displayName: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  levelBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelText: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.xs,
    color: colors.accent,
    letterSpacing: 0.3,
  },

  // Divider
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },

  // Section header
  sectionHeader: {
    ...textStyles.label,
    marginTop: 4,
    marginBottom: 6,
  },

  // Settings card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowValue: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: fontSizes.sm * lineHeights.normal,
    maxWidth: 160,
    textAlign: "right",
  },

  // Logout
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 16,
    marginTop: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  logoutPressed: {
    opacity: 0.7,
  },
  logoutText: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.base,
    color: colors.error,
  },

  // Footer
  version: {
    textAlign: "center",
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    marginTop: 4,
  },
});
