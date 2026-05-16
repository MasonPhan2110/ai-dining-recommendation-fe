import { colors, fonts, fontSizes, radius } from "@/src/config/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  accentColor?: string;
  softBg?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ChoiceChip({
  label,
  emoji,
  selected,
  onPress,
  accentColor = colors.accent,
  softBg = colors.accentSoft,
}: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withTiming(0.94, { duration: 80 }, () => {
      scale.value = withTiming(1, { duration: 150 });
    });
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animStyle}>
      <View
        style={[
          styles.chip,
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
            selected && { color: accentColor },
          ]}
        >
          {label}
        </Text>
        {selected ? (
          <Text style={[styles.check, { color: accentColor }]}>{"\u2713"}</Text>
        ) : null}
      </View>
    </AnimatedPressable>
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  check: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
  },
});
