import type { TextStyle } from "react-native";

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,
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
  snug: 1.35,
  normal: 1.55,
  relaxed: 1.7,
} as const;
