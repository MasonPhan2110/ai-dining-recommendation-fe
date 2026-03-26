import { ChoiceChip } from "@/src/components/ChoiceChip";
import { useAuthStore, type Preferences } from "@/src/store/useAuthStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { fontSizes, fontWeights, lineHeights } from "@/src/theme/typography";
import { CUISINE_CONFIG } from "@/src/utils/cuisineConfig";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Step data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "cuisines",
    emoji: "🍜",
    title: "What cuisines\ndo you love?",
    subtitle: "Pick as many as you like",
    multi: true,
  },
  {
    id: "budget",
    emoji: "💰",
    title: "What's your\ntypical budget?",
    subtitle: "Per person, per meal",
    multi: false,
  },
  {
    id: "vibes",
    emoji: "✨",
    title: "What's your\ndining vibe?",
    subtitle: "Pick everything that fits you",
    multi: true,
  },
] as const;

const CUISINE_OPTIONS = Object.entries(CUISINE_CONFIG).map(([name, cfg]) => ({
  label: name,
  emoji: cfg.emoji,
  accentColor: cfg.color,
  softBg: cfg.softBg,
}));

const BUDGET_OPTIONS = [
  { label: "Under 200k", emoji: "💸", accentColor: colors.accentEmerald, softBg: "#ECFDF5" },
  { label: "200k – 400k", emoji: "🍽️", accentColor: colors.primary, softBg: colors.primarySoft },
  { label: "400k+", emoji: "👑", accentColor: colors.accentViolet, softBg: "#F3EEFF" },
];

const VIBE_OPTIONS = [
  { label: "Date night", emoji: "🕯️" },
  { label: "Group dining", emoji: "👥" },
  { label: "Quick bite", emoji: "⚡" },
  { label: "Late night", emoji: "🌙" },
  { label: "Outdoor", emoji: "🌿" },
  { label: "Solo", emoji: "🎧" },
  { label: "Quiet & cozy", emoji: "🛋️" },
  { label: "Lively", emoji: "🎉" },
].map((v) => ({ ...v, accentColor: colors.primary, softBg: colors.primarySoft }));

// ── Screen ───────────────────────────────────────────────────────────────────

export default function SurveyScreen() {
  const completeSurvey = useAuthStore((s) => s.completeSurvey);

  const [step, setStep] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  // Slide + fade animation between steps
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (direction: "forward" | "back", callback: () => void) => {
    const outX = direction === "forward" ? -40 : 40;
    const inX = direction === "forward" ? 40 : -40;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: outX, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(inX);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => {
    if (step < STEPS.length - 1) {
      animateTransition("forward", () => setStep((s) => s + 1));
    } else {
      const prefs: Preferences = {
        cuisines: selectedCuisines,
        budget: selectedBudget,
        vibes: selectedVibes,
      };
      completeSurvey(prefs);
    }
  };

  const goBack = () => {
    if (step > 0) {
      animateTransition("back", () => setStep((s) => s - 1));
    }
  };

  const toggleMulti = (
    value: string,
    current: string[],
    setter: (v: string[]) => void,
  ) => {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const toggleSingle = (value: string, setter: (v: string) => void) => {
    setter(value);
  };

  const canContinue = () => {
    if (step === 0) return selectedCuisines.length > 0;
    if (step === 1) return selectedBudget !== "";
    return selectedVibes.length > 0;
  };

  const currentStep = STEPS[step];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        {step > 0 ? (
          <Pressable onPress={goBack} style={styles.backBtn} hitSlop={10}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text style={styles.stepCounter}>
          {step + 1} / {STEPS.length}
        </Text>
        <View style={styles.backBtn} />
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((step + 1) / STEPS.length) * 100}%` },
          ]}
        />
      </View>

      {/* ── Animated step content ── */}
      <Animated.View
        style={[
          styles.stepContainer,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Step heading */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepEmoji}>{currentStep.emoji}</Text>
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>
        </View>

        {/* Chips */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chipsArea}
        >
          <View style={styles.chipsWrap}>
            {step === 0 &&
              CUISINE_OPTIONS.map((o) => (
                <ChoiceChip
                  key={o.label}
                  label={o.label}
                  emoji={o.emoji}
                  selected={selectedCuisines.includes(o.label)}
                  onPress={() =>
                    toggleMulti(o.label, selectedCuisines, setSelectedCuisines)
                  }
                  accentColor={o.accentColor}
                  softBg={o.softBg}
                />
              ))}

            {step === 1 &&
              BUDGET_OPTIONS.map((o) => (
                <ChoiceChip
                  key={o.label}
                  label={o.label}
                  emoji={o.emoji}
                  selected={selectedBudget === o.label}
                  onPress={() => toggleSingle(o.label, setSelectedBudget)}
                  accentColor={o.accentColor}
                  softBg={o.softBg}
                />
              ))}

            {step === 2 &&
              VIBE_OPTIONS.map((o) => (
                <ChoiceChip
                  key={o.label}
                  label={o.label}
                  emoji={o.emoji}
                  selected={selectedVibes.includes(o.label)}
                  onPress={() =>
                    toggleMulti(o.label, selectedVibes, setSelectedVibes)
                  }
                  accentColor={o.accentColor}
                  softBg={o.softBg}
                />
              ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* ── Continue button ── */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueBtn,
            !canContinue() && styles.continueBtnDisabled,
            pressed && canContinue() && styles.btnPressed,
          ]}
          onPress={goNext}
          disabled={!canContinue()}
        >
          <Text style={styles.continueBtnText}>
            {step < STEPS.length - 1 ? "Continue" : "Let's eat! 🎉"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 64,
  },
  backText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  stepCounter: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },

  // ── Progress bar ──
  progressTrack: {
    height: 4,
    backgroundColor: colors.divider,
    marginHorizontal: 20,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },

  // ── Step content ──
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    gap: 6,
  },
  stepEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: fontSizes.xxl * lineHeights.snug,
  },
  stepSubtitle: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
  },

  // ── Chips ──
  chipsArea: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnDisabled: {
    backgroundColor: colors.borderStrong,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.977 }],
  },
  continueBtnText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: "#fff",
    letterSpacing: 0.2,
  },
});
