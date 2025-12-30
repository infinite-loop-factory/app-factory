import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";
import { useThemeStore } from "@/hooks/use-theme";

export function ThemeSwitch() {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";
  const translateX = useRef(new Animated.Value(isDark ? 24 : 2)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDark ? 24 : 2,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isDark, translateX]);

  const handleThemeChange = () => {
    toggleMode();
  };

  return (
    <View>
      <Pressable
        className="relative max-w-[52px] flex-row items-center overflow-hidden rounded-full"
        onPress={handleThemeChange}
        style={{
          width: 48,
          height: 24,
          padding: 2,
          backgroundColor:
            mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
        }}
      >
        <Animated.View
          className="absolute rounded-full"
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 10,
              transform: [{ translateX }],
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.15,
              shadowRadius: Platform.OS === "ios" ? 3 : 2,
              elevation: Platform.OS === "android" ? 5 : 3,
            },
          ]}
        >
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ borderRadius: 10 }}
          >
            <Text
              className="text-[12px]"
              style={{
                color: mode === "dark" ? "#FF8C00" : "#FFD700",
              }}
            >
              {isDark ? "🌙" : "☀️"}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
