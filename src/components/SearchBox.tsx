import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes } from "@/src/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBox({ value, onChangeText }: Props) {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const borderColor = useRef(
    borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.primary],
    }),
  ).current;

  const handleFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()}>
      <Animated.View style={[styles.container, { borderColor }]}>
        <Ionicons
          name="search-outline"
          size={18}
          color={colors.textSecondary}
          style={styles.icon}
        />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Quiet, under 300k, close by..."
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText("")} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textTertiary}
            />
          </Pressable>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...shadows.sm,
  },
  icon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.textPrimary,
    fontSize: fontSizes.base,
  },
});
