import {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  radius,
} from "@/src/config/theme";
import { ChatMessage } from "@/src/types/ai-chat";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { ChatRestaurantCard } from "./ChatRestaurantCard";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = { message: ChatMessage };

export function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const animStyle = {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[styles.row, isUser ? styles.rowUser : styles.rowAi, animStyle]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{"\u2726"}</Text>
        </View>
      )}

      <View style={[styles.column, isUser && styles.columnUser]}>
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}
        >
          <Text style={[styles.text, isUser ? styles.textUser : styles.textAi]}>
            {message.text}
          </Text>
        </View>

        {!isUser && message.restaurants && message.restaurants.length > 0 && (
          <View style={styles.restaurants}>
            {message.restaurants.map((r) => (
              <ChatRestaurantCard key={r.id} item={r} />
            ))}
          </View>
        )}

        <Text style={[styles.time, isUser && styles.timeUser]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
}

export function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, {
            toValue: 1,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.delay((2 - i) * 160),
        ]),
      ),
    );
    Animated.parallel(animations).start();
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarEmoji}>{"\u2726"}</Text>
      </View>
      <View style={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
        <View style={styles.dots}>
          {dots.map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: dot,
                  transform: [
                    {
                      translateY: dot.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -3],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginHorizontal: 20,
  },
  rowUser: {
    flexDirection: "row-reverse",
  },
  rowAi: {},
  column: {
    maxWidth: "78%",
    gap: 4,
  },
  columnUser: {
    alignItems: "flex-end",
  },

  // Avatar
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatarEmoji: {
    fontSize: 12,
    color: colors.textInverse,
  },

  // Bubble
  bubble: {
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: radius.xs,
  },
  bubbleAi: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  text: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  textUser: {
    color: colors.textInverse,
  },
  textAi: {
    color: colors.textPrimary,
  },
  time: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  timeUser: {
    marginLeft: 0,
    marginRight: 4,
  },

  // Restaurant list
  restaurants: {
    gap: 8,
    width: "100%",
    maxWidth: 320,
  },

  // Typing indicator
  typingBubble: {
    paddingVertical: 14,
  },
  dots: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    height: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.textTertiary,
  },
});
