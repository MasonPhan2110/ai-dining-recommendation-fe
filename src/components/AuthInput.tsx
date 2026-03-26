import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { fontSizes, fontWeights } from "@/src/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type Props = TextInputProps & {
  icon: IoniconName;
  isPassword?: boolean;
};

export function AuthInput({ icon, isPassword, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;
  const borderColor = useRef(
    borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.borderStrong, colors.primary],
    }),
  ).current;

  const animateTo = (val: number) =>
    Animated.timing(borderAnim, {
      toValue: val,
      duration: 180,
      useNativeDriver: false,
    }).start();

  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      <Ionicons
        name={icon}
        size={18}
        color={focused ? colors.primary : colors.textTertiary}
        style={styles.leadIcon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={isPassword && !showPassword}
        onFocus={() => {
          setFocused(true);
          animateTo(1);
        }}
        onBlur={() => {
          setFocused(false);
          animateTo(0);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {isPassword && (
        <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={12}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={colors.textTertiary}
          />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 54,
    gap: 12,
  },
  leadIcon: {
    width: 20,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
});
