import { colors, fonts, fontSizes, textStyles } from "@/src/config/theme";
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
    fontSize: 14,
    color: colors.accent,
  },
  title: {
    ...textStyles.headingSmall,
  },
  action: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.sm,
    color: colors.accent,
  },
});
