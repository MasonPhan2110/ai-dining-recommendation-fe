import { colors, fonts, fontSizes, lineHeights, radius } from "@/src/config/theme";
import { useLocationStore } from "@/src/store/useLocationStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";

export function PermissionBanner() {
  const requestPermissionAndFetch = useLocationStore(
    (s) => s.requestPermissionAndFetch,
  );

  const handleEnable = async () => {
    await requestPermissionAndFetch();
    if (Platform.OS !== "web") {
      Linking.openSettings();
    }
  };

  const subText =
    Platform.OS === "web"
      ? "Click the lock icon in your browser\u2019s address bar to allow location."
      : "Allow access for better restaurant picks near you.";

  return (
    <View style={styles.banner}>
      <View style={styles.iconWrap}>
        <Ionicons name="location-outline" size={18} color={colors.warning} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Location access needed</Text>
        <Text style={styles.sub}>{subText}</Text>
      </View>
      {Platform.OS !== "web" && (
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={handleEnable}
        >
          <Text style={styles.btnText}>Enable</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.warningSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  sub: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
  btn: {
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  btnPressed: {
    opacity: 0.82,
  },
  btnText: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.textInverse,
  },
});
