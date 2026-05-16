import { colors, fonts, fontSizes, radius } from "@/src/config/theme";
import { useLocation } from "@/src/hooks/useLocation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type Href, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export function LocationPill() {
  const { displayLabel, isLoading, isPermissionDenied, isManual } =
    useLocation();
  const router = useRouter();

  const iconName = isPermissionDenied
    ? "location-outline"
    : isManual
      ? "navigate-outline"
      : "location";

  const iconColor = isPermissionDenied ? colors.textTertiary : colors.accent;

  return (
    <Pressable
      style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
      onPress={() => router.push("/location" as Href)}
      hitSlop={6}
    >
      {isLoading ? (
        <ActivityIndicator size={12} color={colors.accent} />
      ) : (
        <Ionicons name={iconName} size={13} color={iconColor} />
      )}

      <Text
        style={[styles.label, isPermissionDenied && styles.labelMuted]}
        numberOfLines={1}
      >
        {displayLabel}
      </Text>

      <View style={styles.chevronWrap}>
        <Ionicons name="chevron-down" size={11} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    maxWidth: 240,
  },
  pillPressed: {
    opacity: 0.78,
  },
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  labelMuted: {
    color: colors.textTertiary,
  },
  chevronWrap: {
    marginLeft: 1,
  },
});
