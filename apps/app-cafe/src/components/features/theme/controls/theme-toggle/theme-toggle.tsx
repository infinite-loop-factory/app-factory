import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Moon } from "@/components/features/theme/controls/theme-toggle/moon.tsx";
import { Sun } from "@/components/features/theme/controls/theme-toggle/sun.tsx";
import { useThemeStore } from "@/hooks/use-theme";

function ThemeToggle() {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  const sunTranslateX = useSharedValue(isDark ? 64 : 0);
  const sunTranslateY = useSharedValue(isDark ? -64 : 0);
  const moonTranslateX = useSharedValue(isDark ? 0 : 64);
  const moonTranslateY = useSharedValue(isDark ? 0 : -64);
  const sunRotation = useSharedValue(0);

  useEffect(() => {
    const sunConfig = isDark
      ? { x: 64, y: -64, delay: 0 }
      : { x: 0, y: 0, delay: 0 };
    const moonConfig = isDark
      ? { x: 0, y: 0, delay: 0 }
      : { x: 64, y: -64, delay: 0 };

    sunTranslateX.value = withDelay(
      sunConfig.delay,
      withTiming(sunConfig.x, {
        duration: 650,
        easing: Easing.out(Easing.ease),
      }),
    );
    sunTranslateY.value = withDelay(
      sunConfig.delay,
      withTiming(sunConfig.y, {
        duration: 650,
        easing: Easing.out(Easing.ease),
      }),
    );
    moonTranslateX.value = withDelay(
      moonConfig.delay,
      withTiming(moonConfig.x, {
        duration: 650,
        easing: Easing.out(Easing.ease),
      }),
    );
    moonTranslateY.value = withDelay(
      moonConfig.delay,
      withTiming(moonConfig.y, {
        duration: 650,
        easing: Easing.out(Easing.ease),
      }),
    );

    sunRotation.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
    );
  }, [
    isDark,
    moonTranslateX,
    moonTranslateY,
    sunRotation,
    sunTranslateX,
    sunTranslateY,
  ]);

  const toggleTheme = () => {
    toggleMode();
  };

  const sunContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: sunTranslateX.value },
      { translateY: sunTranslateY.value },
    ],
    opacity: withTiming(isDark ? 0 : 1, {
      duration: 650,
      easing: Easing.out(Easing.ease),
    }),
  }));

  const moonContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: moonTranslateX.value },
      { translateY: moonTranslateY.value },
    ],
  }));

  return (
    <View
      style={{
        width: 80,
        height: 80,
        position: "absolute",
        top: -70,
        right: -30,
        zIndex: 50,
        overflow: "hidden",
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <Pressable
        onPress={toggleTheme}
        style={{
          width: 20,
          height: 20,
          position: "relative",
          top: 16,
          right: 16,
        }}
      >
        <Animated.View style={sunContainerStyle}>
          <Sun rotation={sunRotation} />
        </Animated.View>

        <Animated.View style={moonContainerStyle}>
          <Moon isDark={isDark} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default ThemeToggle;
