import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUpdateBanner } from "@/context/update-banner-context";

// ── Colour map ────────────────────────────────────────────────

const BG: Record<string, string> = {
  success: "#16a34a",
  info: "#2563eb",
  warning: "#d97706",
  error: "#dc2626",
};

const ICON: Record<string, string> = {
  success: "✓",
  info: "ℹ",
  warning: "⚠",
  error: "✕",
};

// ── Component ─────────────────────────────────────────────────

export function UpdateBanner() {
  const { visible, message, type, hideBanner } = useUpdateBanner();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 200,
      }).start();
      timerRef.current = setTimeout(hideBanner, 4500);
    } else {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, hideBanner, translateY]);

  return (
    <Animated.View
      style={{
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        transform: [{ translateY }],
        zIndex: 9999,
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: BG[type] ?? BG.info,
          flexDirection: "row",
          gap: 10,
          paddingBottom: 12,
          paddingHorizontal: 16,
          paddingTop: insets.top + 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
          {ICON[type]}
        </Text>
        <Text
          style={{
            color: "white",
            flex: 1,
            fontSize: 13,
            fontWeight: "500",
          }}
        >
          {message}
        </Text>
        <Pressable hitSlop={12} onPress={hideBanner}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
            ✕
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
