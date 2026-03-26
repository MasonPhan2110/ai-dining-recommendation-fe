import { colors } from "@/src/theme/colors";
import { fontSizes, fontWeights } from "@/src/theme/typography";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  icon?: string;
  action?: { label: string; onPress: () => void };
};

export function SectionTitle({ title, icon, action }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={8}>
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  action: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
});
