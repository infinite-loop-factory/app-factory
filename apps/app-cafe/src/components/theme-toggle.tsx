import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, View } from "react-native";
import { useThemeStore } from "@/hooks/use-theme";

export function ThemeToggle() {
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

  const toggleTheme = () => {
    toggleMode();
  };

  return (
    <View>
      <Pressable
        className={
          "relative max-w-[52px] flex-row items-center overflow-hidden rounded-full bg-gray-700"
        }
        onPress={toggleTheme}
        style={[
          {
            width: 48,
            height: 24,
            padding: 2,
          },
        ]}
      >
        <Animated.View
          className="absolute rounded-full"
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 10,
              transform: [{ translateX }],
              backgroundColor: "#795548",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: Platform.OS === "ios" ? 0.4 : 0.2,
              shadowRadius: Platform.OS === "ios" ? 4 : 3,
              elevation: Platform.OS === "android" ? 6 : 4,
            },
          ]}
        >
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ borderRadius: 10 }}
          >
            <Ionicons
              color="#FFFFFF"
              name={isDark ? "moon" : "sunny"}
              size={12}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
                shadowRadius: Platform.OS === "ios" ? 2 : 1,
                elevation: Platform.OS === "android" ? 3 : 2,
              }}
            />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
