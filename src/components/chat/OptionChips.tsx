import { colors, fonts, fontSizes, radius } from "@/src/config/theme";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";

type Props = {
  options: string[];
  onSelect: (value: string) => void;
};

export function OptionChips({ options, onSelect }: Props) {
  if (options.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={({ pressed }) => [
              styles.chip,
              pressed && styles.chipPressed,
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text style={styles.chipText}>{opt}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  row: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  chipPressed: {
    backgroundColor: colors.accentSoft,
    opacity: 0.85,
  },
  chipText: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.sm,
    color: colors.accent,
  },
});
