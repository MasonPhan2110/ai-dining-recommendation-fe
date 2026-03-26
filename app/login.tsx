import { AuthInput } from "@/src/components/AuthInput";
import { useAuthStore } from "@/src/store/useAuthStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    // Mock auth — auto-succeeds after a short delay
    setTimeout(() => {
      setLoading(false);
      login(email.trim());
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand hero ── */}
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🍽️</Text>
            </View>
            <Text style={styles.appName}>AI Dining</Text>
            <Text style={styles.tagline}>Discover your perfect meal</Text>
          </View>

          {/* ── Form card ── */}
          <View style={styles.card}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Sign in to continue</Text>

            <View style={styles.fields}>
              <AuthInput
                icon="mail-outline"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                returnKeyType="next"
              />
              <AuthInput
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.signInBtn,
                pressed && styles.btnPressed,
                loading && styles.btnLoading,
              ]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </Pressable>

            <Text style={styles.hint}>
              Any email + password works — this is a demo app.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // ── Hero ──
  hero: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 40,
    gap: 10,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: radius.xxl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    ...shadows.lg,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.black,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.normal,
  },

  // ── Card ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 24,
    gap: 16,
    ...shadows.md,
  },
  heading: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
    marginTop: -8,
  },
  fields: {
    gap: 12,
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.error,
    fontWeight: fontWeights.medium,
  },

  // ── CTA ──
  signInBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.977 }],
  },
  btnLoading: {
    opacity: 0.8,
  },
  signInText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: "#fff",
    letterSpacing: 0.2,
  },

  // ── Footer hint ──
  hint: {
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    textAlign: "center",
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
});
