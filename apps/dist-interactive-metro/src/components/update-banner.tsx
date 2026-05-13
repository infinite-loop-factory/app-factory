import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUpdateBanner } from "@/context/update-banner-context";

// ── Colour map ────────────────────────────────────────────────

const BG: Record<string, string> = {
  success: "#10B981", // Emerald 500
  info: "#3B82F6", // Blue 500
  warning: "#F59E0B", // Amber 500
  error: "#EF4444", // Red 500
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
  const translateY = useRef(new Animated.Value(-150)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
      timerRef.current = setTimeout(hideBanner, 4000);
    } else {
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
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
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: BG[type] ?? BG.info,
          flexDirection: "row",
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
            {ICON[type]}
          </Text>
        </View>
        <Text
          style={{
            color: "white",
            flex: 1,
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          {message}
        </Text>
        <Pressable
          hitSlop={12}
          onPress={hideBanner}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            padding: 4,
          })}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            ✕
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
