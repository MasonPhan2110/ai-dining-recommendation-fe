import { Platform } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

// ─── Font Families ───────────────────────────────────────────────────────────
// Display: Playfair Display — transitional serif, editorial presence
// Body: DM Sans — refined geometric sans, optically corrected

export const fonts = {
  display: {
    regular: "PlayfairDisplay_400Regular",
    medium: "PlayfairDisplay_500Medium",
    semiBold: "PlayfairDisplay_600SemiBold",
    bold: "PlayfairDisplay_700Bold",
    extraBold: "PlayfairDisplay_800ExtraBold",
    black: "PlayfairDisplay_900Black",
  },
  body: {
    regular: "DMSans_400Regular",
    medium: "DMSans_500Medium",
    semiBold: "DMSans_600SemiBold",
    bold: "DMSans_700Bold",
  },
} as const;

// ─── Colors ──────────────────────────────────────────────────────────────────
// Near-monochrome warm ivory base + one sharp accent (refined terracotta)

export const colors = {
  // Accent — the single point of chromatic energy
  accent: "#C2452D",
  accentSoft: "#F5E6E2",
  accentMuted: "#E8CCC5",

  // Legacy aliases (keeps existing code working during migration)
  primary: "#C2452D",
  primaryLight: "#D4715E",
  primarySoft: "#F5E6E2",
  primaryMuted: "#E8CCC5",

  // Backgrounds
  background: "#FAF9F7",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",

  // Text
  textPrimary: "#1C1C1E",
  textSecondary: "#6B6B6F",
  textTertiary: "#A0A0A5",
  textInverse: "#FFFFFF",

  // Borders & dividers — hairline precision
  border: "#ECEAE6",
  borderStrong: "#DDDBD6",
  divider: "#F2F1EE",

  // Semantic
  success: "#2D6A4F",
  successSoft: "#E9F5EE",
  warning: "#B07D2B",
  warningSoft: "#FBF3E0",
  error: "#B91C1C",

  // Cuisine accents (retained for RestaurantCard identity strips)
  accentIndigo: "#4F46E5",
  accentRose: "#DB2777",
  accentEmerald: "#059669",
  accentAmber: "#D97706",
  accentBlue: "#2563EB",
  accentViolet: "#7C3AED",
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,
  display: 42,
} as const;

export const fontWeights: Record<string, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
};

export const lineHeights = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const letterSpacing = {
  tight: -0.5,
  snug: -0.3,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
  widest: 1.5,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  hero: 64,
} as const;

// ─── Radius ──────────────────────────────────────────────────────────────────

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

const makeShadow = (
  offsetY: number,
  blurRadius: number,
  opacity: number,
  androidElevation: number,
): ViewStyle =>
  Platform.select({
    ios: {
      shadowColor: "#1C1C1E",
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blurRadius,
    },
    android: { elevation: androidElevation },
    default: {},
  }) as ViewStyle;

export const shadows = {
  sm: makeShadow(1, 3, 0.06, 2),
  md: makeShadow(3, 10, 0.08, 5),
  lg: makeShadow(6, 18, 0.10, 10),
  xl: makeShadow(12, 28, 0.12, 18),
} as const;

// ─── Convenience: text style presets ─────────────────────────────────────────

export const textStyles = {
  displayLarge: {
    fontFamily: fonts.display.bold,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    color: colors.textPrimary,
  } as TextStyle,
  displayMedium: {
    fontFamily: fonts.display.bold,
    fontSize: fontSizes.xxxl,
    lineHeight: fontSizes.xxxl * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    color: colors.textPrimary,
  } as TextStyle,
  displaySmall: {
    fontFamily: fonts.display.semiBold,
    fontSize: fontSizes.xxl,
    lineHeight: fontSizes.xxl * lineHeights.snug,
    letterSpacing: letterSpacing.snug,
    color: colors.textPrimary,
  } as TextStyle,
  headingLarge: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.snug,
    letterSpacing: letterSpacing.snug,
    color: colors.textPrimary,
  } as TextStyle,
  headingSmall: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.snug,
    letterSpacing: letterSpacing.snug,
    color: colors.textPrimary,
  } as TextStyle,
  bodyLarge: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    color: colors.textPrimary,
  } as TextStyle,
  bodySmall: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    color: colors.textSecondary,
  } as TextStyle,
  caption: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    color: colors.textTertiary,
  } as TextStyle,
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: "uppercase" as const,
    color: colors.textTertiary,
  } as TextStyle,
} as const;
