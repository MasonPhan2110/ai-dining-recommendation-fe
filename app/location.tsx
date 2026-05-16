import {
  PREDEFINED_LOCATIONS,
  type PredefinedLocation,
} from "@/src/data/predefinedLocations";
import { useLocation } from "@/src/hooks/useLocation";
import { useLocationStore } from "@/src/store/useLocationStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationScreen() {
  const router = useRouter();
  const { location, isLoading, error, isPermissionDenied } = useLocation();
  const requestPermissionAndFetch = useLocationStore(
    (s) => s.requestPermissionAndFetch,
  );
  const setManualLocation = useLocationStore((s) => s.setManualLocation);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const handleUseCurrentLocation = async () => {
    setGpsLoading(true);
    setGpsError("");
    await requestPermissionAndFetch();
    setGpsLoading(false);
    // Read fresh state after fetch
    const newStatus = useLocationStore.getState().permissionStatus;
    const newLoc = useLocationStore.getState().location;
    if (newStatus === "denied") {
      setGpsError("Location permission denied. Please enable it in Settings.");
    } else if (newLoc?.source === "gps") {
      router.back();
    }
  };

  const handleSelectPredefined = (place: PredefinedLocation) => {
    setManualLocation({
      latitude: place.latitude,
      longitude: place.longitude,
      city: place.city,
      district: place.district,
      label: place.label,
      source: "manual",
    });
    router.back();
  };

  const activeId = (() => {
    if (!location) return null;
    if (location.source === "gps") return "gps";
    return (
      PREDEFINED_LOCATIONS.find(
        (p) =>
          p.city === location.city && p.district === location.district,
      )?.id ?? null
    );
  })();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose your location</Text>
        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Use GPS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MY LOCATION</Text>
          <Pressable
            style={({ pressed }) => [
              styles.row,
              activeId === "gps" && styles.rowActive,
              pressed && styles.rowPressed,
            ]}
            onPress={handleUseCurrentLocation}
            disabled={gpsLoading || isLoading}
          >
            <View
              style={[
                styles.iconBox,
                activeId === "gps" && styles.iconBoxActive,
              ]}
            >
              {gpsLoading || (isLoading && location?.source === "gps") ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name="navigate"
                  size={16}
                  color={
                    activeId === "gps" ? colors.primary : colors.textSecondary
                  }
                />
              )}
            </View>

            <View style={styles.rowBody}>
              <Text
                style={[
                  styles.rowTitle,
                  activeId === "gps" && styles.rowTitleActive,
                ]}
              >
                Use current location
              </Text>
              {activeId === "gps" && location?.label ? (
                <Text style={styles.rowSub}>{location.label}</Text>
              ) : (
                <Text style={styles.rowSub}>
                  {isPermissionDenied
                    ? "Permission denied — tap to open Settings"
                    : "Detect via GPS"}
                </Text>
              )}
              {gpsError ? (
                <Text style={styles.errorText}>{gpsError}</Text>
              ) : null}
            </View>

            {activeId === "gps" && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
              />
            )}
          </Pressable>
        </View>

        {/* ── Predefined locations ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>POPULAR AREAS</Text>
          <View style={styles.card}>
            {PREDEFINED_LOCATIONS.map((place, idx) => {
              const isActive = activeId === place.id;
              const isLast = idx === PREDEFINED_LOCATIONS.length - 1;

              return (
                <Pressable
                  key={place.id}
                  style={({ pressed }) => [
                    styles.row,
                    styles.listRow,
                    !isLast && styles.rowBorder,
                    isActive && styles.rowActive,
                    pressed && styles.rowPressed,
                  ]}
                  onPress={() => handleSelectPredefined(place)}
                >
                  <View
                    style={[styles.iconBox, isActive && styles.iconBoxActive]}
                  >
                    <Ionicons
                      name="location"
                      size={14}
                      color={
                        isActive ? colors.primary : colors.textTertiary
                      }
                    />
                  </View>

                  <View style={styles.rowBody}>
                    <Text
                      style={[
                        styles.rowTitle,
                        isActive && styles.rowTitleActive,
                      ]}
                    >
                      {place.district}
                    </Text>
                    <Text style={styles.rowSub}>{place.city}</Text>
                  </View>

                  {isActive ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
                    />
                  ) : (
                    <View style={styles.radioEmpty} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Scroll ──
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 24,
  },

  // ── Section ──
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.textTertiary,
    letterSpacing: 0.9,
  },

  // ── Card (for the list) ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadows.sm,
  },

  // ── Row ──
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 14,
    ...shadows.sm,
  },
  listRow: {
    borderRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowActive: {
    backgroundColor: colors.primarySoft,
  },
  rowPressed: {
    opacity: 0.75,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  rowTitleActive: {
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  rowSub: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colors.error,
    marginTop: 2,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },

  // ── Icon box ──
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxActive: {
    backgroundColor: colors.primaryMuted,
  },

  // ── Radio indicator ──
  radioEmpty: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
});
