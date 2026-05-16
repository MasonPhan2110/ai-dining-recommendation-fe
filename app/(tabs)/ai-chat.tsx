import { ChatBubble, TypingIndicator } from "@/src/components/chat/ChatBubble";
import { OptionChips } from "@/src/components/chat/OptionChips";
import {
  colors,
  fonts,
  fontSizes,
  radius,
  textStyles,
} from "@/src/config/theme";
import { useLocation } from "@/src/hooks/useLocation";
import { useAIChatStore } from "@/src/store/useAIChatStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { ChatMessage } from "@/src/types/ai-chat";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AIChatScreen() {
  const messages = useAIChatStore((s) => s.messages);
  const isTyping = useAIChatStore((s) => s.isTyping);
  const sendMessage = useAIChatStore((s) => s.sendMessage);
  const clearChat = useAIChatStore((s) => s.clearChat);

  const userId = useAuthStore((s) => s.userId);
  const { location } = useLocation();

  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    const timer = setTimeout(
      () => flatListRef.current?.scrollToEnd({ animated: true }),
      80,
    );
    return () => clearTimeout(timer);
  }, [messages.length, isTyping]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;
      setInput("");
      sendMessage(trimmed, userId, location?.latitude, location?.longitude);
    },
    [isTyping, sendMessage, userId, location],
  );

  const lastMessage = messages[messages.length - 1];
  const currentOptions =
    !isTyping && lastMessage?.role === "ai" && lastMessage.options?.length
      ? lastMessage.options
      : [];

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => <ChatBubble message={item} />,
    [],
  );

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.flex} edges={["top"]}>
        {/* Header */}
        <Animated.View
          style={styles.header}
          entering={FadeInDown.duration(400).delay(80)}
        >
          <View style={styles.headerLeft}>
            <View style={styles.aiDot}>
              <Text style={styles.aiDotText}>{"\u2726"}</Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>AI Picks</Text>
              <Text style={styles.headerSub}>
                Your personal dining assistant
              </Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.clearBtn,
              pressed && styles.clearBtnPressed,
            ]}
            onPress={clearChat}
            hitSlop={10}
          >
            <Ionicons
              name="refresh-outline"
              size={16}
              color={colors.textTertiary}
            />
          </Pressable>
        </Animated.View>

        <View style={styles.flex}>
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListFooterComponent={
              isTyping ? (
                <View style={{ marginTop: 12, marginHorizontal: 16 }}>
                  <TypingIndicator />
                </View>
              ) : null
            }
          />

          {/* Option chips */}
          {currentOptions.length > 0 && (
            <OptionChips options={currentOptions} onSelect={handleSend} />
          )}

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask me anything..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={400}
              returnKeyType="send"
              blurOnSubmit
              onSubmitEditing={() => handleSend(input)}
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                (!input.trim() || isTyping) && styles.sendBtnDisabled,
                pressed &&
                  input.trim() &&
                  !isTyping &&
                  styles.sendBtnPressed,
              ]}
              onPress={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
            >
              <Ionicons
                name="arrow-up"
                size={17}
                color={
                  input.trim() && !isTyping
                    ? colors.textInverse
                    : colors.textTertiary
                }
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiDot: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  aiDotText: {
    fontSize: 14,
    color: colors.textInverse,
  },
  headerTextWrap: {
    gap: 1,
  },
  headerTitle: {
    ...textStyles.headingSmall,
    fontSize: fontSizes.base,
  },
  headerSub: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnPressed: {
    opacity: 0.6,
  },

  // Message list
  messageList: {
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 11 : 8,
    paddingBottom: Platform.OS === "ios" ? 11 : 8,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: colors.divider,
  },
  sendBtnPressed: {
    opacity: 0.85,
  },
});
