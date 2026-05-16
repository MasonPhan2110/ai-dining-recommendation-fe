import { AuthInput } from "@/src/components/AuthInput";
import { useAuthStore } from "@/src/store/useAuthStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { shadows } from "@/src/theme/shadows";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { Href, useRouter } from "expo-router";
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

type Mode = "login" | "signup";

const COPY: Record<Mode, { heading: string; subheading: string; cta: string }> =
  {
    login: {
      heading: "Welcome back",
      subheading: "Sign in to continue",
      cta: "Sign In",
    },
    signup: {
      heading: "Create account",
      subheading: "Join AI Dining to get started",
      cta: "Sign Up",
    },
  };

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    const action = mode === "login" ? login : signup;
    const err = await action(email.trim(), password);

    setLoading(false);
    if (err) {
      setError(err);
    } else {
      const dest = useAuthStore.getState().surveyCompleted
        ? ("/(tabs)" as Href)
        : ("/survey" as Href);
      router.replace(dest);
    }
  };

  const { heading, subheading, cta } = COPY[mode];

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

          {/* ── Mode toggle ── */}
          <View style={styles.toggle}>
            <Pressable
              style={[styles.toggleBtn, mode === "login" && styles.toggleBtnActive]}
              onPress={() => switchMode("login")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "login" && styles.toggleTextActive,
                ]}
              >
                Sign In
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, mode === "signup" && styles.toggleBtnActive]}
              onPress={() => switchMode("signup")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "signup" && styles.toggleTextActive,
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* ── Form card ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.heading}>{heading}</Text>
              <Text style={styles.subheading}>{subheading}</Text>
            </View>

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
                onSubmitEditing={handleSubmit}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.btnPressed,
                loading && styles.btnLoading,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>{cta}</Text>
              )}
            </Pressable>
          </View>

          {/* ── Footer switch ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </Text>
            <Pressable
              onPress={() => switchMode(mode === "login" ? "signup" : "login")}
              hitSlop={8}
            >
              <Text style={styles.footerLink}>
                {mode === "login" ? "Sign Up" : "Sign In"}
              </Text>
            </Pressable>
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
    paddingTop: 40,
    paddingBottom: 28,
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

  // ── Mode toggle ──
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.divider,
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: "center",
  },
  toggleBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  toggleText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textTertiary,
  },
  toggleTextActive: {
    color: colors.textPrimary,
    fontWeight: fontWeights.bold,
  },

  // ── Card ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 24,
    gap: 16,
    ...shadows.md,
  },
  cardHeader: {
    gap: 4,
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
  },
  fields: {
    gap: 12,
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.error,
    fontWeight: fontWeights.medium,
  },

  // ── Submit button ──
  submitBtn: {
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
  submitText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: "#fff",
    letterSpacing: 0.2,
  },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
  },
  footerText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
});
