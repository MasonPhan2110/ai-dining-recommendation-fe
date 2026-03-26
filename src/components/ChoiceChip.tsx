import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { fontSizes, fontWeights } from "@/src/theme/typography";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  accentColor?: string;
  softBg?: string;
};

export function ChoiceChip({
  label,
  emoji,
  selected,
  onPress,
  accentColor = colors.primary,
  softBg = colors.primarySoft,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.91,
        useNativeDriver: true,
        speed: 80,
        bounciness: 0,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 14,
      }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.chip,
          { transform: [{ scale }] },
          selected && {
            backgroundColor: softBg,
            borderColor: accentColor,
          },
        ]}
      >
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <Text
          style={[
            styles.label,
            selected && { color: accentColor, fontWeight: fontWeights.bold },
          ]}
        >
          {label}
        </Text>
        {selected ? <Text style={[styles.check, { color: accentColor }]}>✓</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  check: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
});
