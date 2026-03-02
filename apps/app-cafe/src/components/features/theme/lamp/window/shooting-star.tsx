import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const ShootingStar = memo(
  ({
    isDark,
    isCrescentMoon = true,
  }: {
    isDark: boolean;
    isCrescentMoon?: boolean;
  }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const gradientColors = isCrescentMoon
      ? ([
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.5)",
          "rgba(255, 255, 255, 0.8)",
          "rgba(255, 255, 255, 1)",
        ] as const)
      : ([
          "rgba(255, 100, 100, 0)",
          "rgba(255, 150, 100, 0.3)",
          "rgba(255, 200, 100, 0.6)",
          "rgba(255, 255, 200, 1)",
        ] as const);

    const glowColor = isCrescentMoon ? "#FFFFFF" : "#FFB347";
    const tailGlowColor = isCrescentMoon ? "#FFFFFF" : "#FF8C00";

    useEffect(() => {
      if (!isDark) return;
      const animate = () => {
        translateX.value = 0;
        translateY.value = 0;
        opacity.value = 0;
        opacity.value = withSequence(
          withTiming(1, { duration: 200 }),
          withDelay(2000, withTiming(0, { duration: 500 })),
        );
        translateX.value = withTiming(-100, {
          duration: 3500,
          easing: Easing.out(Easing.ease),
        });
        translateY.value = withTiming(100, {
          duration: 3500,
          easing: Easing.out(Easing.ease),
        });
      };
      const schedule = () => {
        animate();
        timerRef.current = setInterval(animate, 15_000);
      };

      const timeoutId = setTimeout(schedule, 5000);
      return () => {
        clearTimeout(timeoutId);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [isDark, opacity, translateX, translateY]);

    const style = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: "135deg" },
      ],
    }));

    if (!isDark) return null;
    return (
      <Animated.View style={[styles.shootingStar, style]}>
        <LinearGradient
          colors={gradientColors}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.gradient}
        />
        <Animated.View style={[styles.glow, { shadowColor: glowColor }]} />
        <Animated.View
          style={[styles.tailGlow, { shadowColor: tailGlowColor }]}
        />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  shootingStar: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 15,
    height: 1.5,
    zIndex: 100,
  },
  gradient: {
    flex: 1,
    borderRadius: 1,
  },
  glow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: "transparent",
    shadowColor: "#FFB347",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  tailGlow: {
    position: "absolute",
    top: -2,
    left: -8,
    right: 0,
    bottom: -2,
    backgroundColor: "transparent",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 5,
  },
});
