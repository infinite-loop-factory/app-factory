import type {
  AnimatedValue,
  AnimatedValueXY,
} from "react-native/Libraries/Animated/Animated";

import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Pressable, View } from "react-native";
import { Circle, G, Line, Svg } from "react-native-svg";
import { useThemeStore } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  const sunTranslateX = useRef(new Animated.Value(isDark ? 64 : 0)).current;
  const sunTranslateY = useRef(new Animated.Value(isDark ? -64 : 0)).current;
  const moonTranslateX = useRef(new Animated.Value(isDark ? 0 : 64)).current;
  const moonTranslateY = useRef(new Animated.Value(isDark ? 0 : -64)).current;
  const sunRotate = useRef(new Animated.Value(0)).current;
  const moonScale = useRef(new Animated.Value(1)).current;
  const sunRotationAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const moonGlowAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const currentRotation = useRef(0);

  useEffect(() => {
    const rotate = () => {
      currentRotation.current += 360;
      Animated.timing(sunRotate, {
        toValue: currentRotation.current,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(rotate);
    };

    sunRotationAnimation.current = Animated.timing(sunRotate, {
      toValue: 360,
      duration: 12000,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    sunRotationAnimation.current.start(rotate);

    return () => {
      sunRotationAnimation.current?.stop();
    };
  }, [sunRotate]);

  useEffect(() => {
    moonGlowAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(moonScale, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(moonScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    moonGlowAnimation.current.start();

    return () => {
      moonGlowAnimation.current?.stop();
    };
  }, [moonScale]);

  useEffect(() => {
    const commonOptions = {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    };

    const createTiming = (
      value: AnimatedValue | AnimatedValueXY,
      toValue: number,
      duration: number,
      delay: number,
    ) => {
      return Animated.timing(value, {
        toValue,
        duration,
        delay,
        ...commonOptions,
      });
    };

    const sunConfig = isDark
      ? { x: 64, y: -64, durX: 1000, durY: 1100, delay: 0 }
      : { x: 0, y: 0, durX: 1100, durY: 1000, delay: 500 };

    const moonConfig = isDark
      ? { x: 0, y: 0, durX: 1100, durY: 1000, delay: 500 }
      : { x: 64, y: -64, durX: 1000, durY: 1100, delay: 0 };

    Animated.parallel([
      createTiming(sunTranslateX, sunConfig.x, sunConfig.durX, sunConfig.delay),
      createTiming(sunTranslateY, sunConfig.y, sunConfig.durY, sunConfig.delay),
      createTiming(
        moonTranslateX,
        moonConfig.x,
        moonConfig.durX,
        moonConfig.delay,
      ),
      createTiming(
        moonTranslateY,
        moonConfig.y,
        moonConfig.durY,
        moonConfig.delay,
      ),
    ]).start();
  }, [isDark, sunTranslateX, sunTranslateY, moonTranslateX, moonTranslateY]);

  const toggleTheme = () => {
    toggleMode();
  };

  return (
    <View
      style={{
        width: 80,
        height: 80,
        position: "absolute",
        top: -24,
        right: -47,
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
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -32,
              left: -32,
              width: 64,
              height: 64,
              alignItems: "center",
              justifyContent: "center",
              transform: [
                { translateX: sunTranslateX },
                { translateY: sunTranslateY },
              ],
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: sunRotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <Svg height={28} viewBox="0 0 100 100" width={28}>
              <G
                fill="none"
                stroke="#FF8C00"
                strokeLinecap="round"
                strokeWidth="5"
              >
                <Line x1="50" x2="50" y1="12" y2="16" />
                <Line
                  transform="rotate(30 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(60 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(90 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(120 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(150 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(180 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(210 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(240 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(270 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(300 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
                <Line
                  transform="rotate(330 50 50)"
                  x1="50"
                  x2="50"
                  y1="12"
                  y2="16"
                />
              </G>
              <Circle cx="50" cy="50" fill="#FF8C00" r="26" />
            </Svg>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              top: -32,
              left: -32,
              width: 64,
              height: 64,
              alignItems: "center",
              justifyContent: "center",
              transform: [
                { translateX: moonTranslateX },
                { translateY: moonTranslateY },
                { scale: moonScale },
              ],
              opacity: isDark ? 1 : 0.8,
            },
          ]}
        >
          <Image
            resizeMode="contain"
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/581/581601.png",
            }}
            style={{
              width: 22,
              height: 22,
            }}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}
