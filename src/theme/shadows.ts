import { Platform } from "react-native";
import type { ViewStyle } from "react-native";

const makeShadow = (
  offsetY: number,
  radius: number,
  opacity: number,
  androidElevation: number,
): ViewStyle =>
  Platform.select({
    ios: {
      // Warm near-black — avoids the cold blue tint of #000 shadows on iOS
      shadowColor: "#2C1810",
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation: androidElevation },
    default: {},
  }) as ViewStyle;

export const shadows = {
  sm: makeShadow(1,  3,  0.07, 2),
  md: makeShadow(3,  10, 0.09, 5),
  lg: makeShadow(6,  18, 0.11, 10),
  xl: makeShadow(12, 28, 0.13, 18),
} as const;
