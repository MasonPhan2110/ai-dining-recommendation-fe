import { colors, fonts, fontSizes, radius } from "@/src/config/theme";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

const CHIPS: { label: string; emoji: string; value: string }[] = [
  { label: "Near me", emoji: "📍", value: "Near me" },
  { label: "Quiet", emoji: "🤫", value: "Quiet" },
  { label: "Date night", emoji: "🕯️", value: "Date night" },
  { label: "Under 200k", emoji: "💸", value: "Under 200k" },
  { label: "Group", emoji: "👥", value: "Group" },
  { label: "Late night", emoji: "🌙", value: "Late night" },
  { label: "Outdoor", emoji: "🌿", value: "Outdoor" },
];

type Props = {
  onSelect: (value: string) => void;
};

export function QuickChips({ onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePress = (value: string) => {
    const next = selected === value ? null : value;
    setSelected(next);
    onSelect(next ?? "");
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CHIPS.map((chip) => {
        const isActive = selected === chip.value;
        return (
          <Pressable
            key={chip.value}
            style={({ pressed }) => [
              styles.chip,
              isActive && styles.chipActive,
              pressed && styles.chipPressed,
            ]}
            onPress={() => handlePress(chip.value)}
          >
            <Text style={styles.chipEmoji}>{chip.emoji}</Text>
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipEmoji: {
    fontSize: 13,
  },
  chipText: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textInverse,
  },
});
