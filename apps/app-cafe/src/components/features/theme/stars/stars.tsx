import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const stars = [
  { top: 20, left: 15, size: 1.5, delay: 0 },
  { top: 35, left: 75, size: 1.3, delay: 0 },
  { top: 50, left: 35, size: 1.8, delay: 600 },
  { top: 70, left: 55, size: 1.2, delay: 1200 },
];

function TwinklingStar({
  top,
  left,
  size,
  delay,
}: {
  top: number;
  left: number;
  size: number;
  delay: number;
}) {
  const opacity = useSharedValue(size > 1.5 ? 0.4 : 0.6);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: 1500,
          }),
          withTiming(0.2, {
            duration: 1500,
          }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, {
            duration: 1500,
          }),
          withTiming(1, {
            duration: 1500,
          }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity, scale]);

  const starStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: `${top}%`,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: 999,
          backgroundColor: "#FFF",
        },
        starStyle,
      ]}
    />
  );
}

function ShootingStar() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      translateX.value = withSequence(
        withTiming(-150, {
          duration: 1000,
        }),
        withTiming(0, {
          duration: 0,
        }),
      );
      translateY.value = withSequence(
        withTiming(150, {
          duration: 1000,
        }),
        withTiming(0, {
          duration: 0,
        }),
      );
      opacity.value = withSequence(
        withTiming(1, {
          duration: 100,
        }),
        withTiming(0, {
          duration: 900,
        }),
      );
    };

    const timer = setInterval(animate, 7000);
    const initialDelay = setTimeout(animate, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(initialDelay);
    };
  }, [opacity, translateX, translateY]);

  const shootingStarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: "-45deg" },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 80,
          left: "80%",
          width: 40,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.5)",
          transform: [{ rotate: "-45deg" }],
          shadowColor: "rgba(255,255,255,0.8)",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 2,
        },
        shootingStarStyle,
      ]}
    />
  );
}

import { THEME_STYLE_ENUM } from "@/hooks/use-theme";

export function Stars({
  isDark,
  themeStyle,
}: {
  isDark: boolean;
  themeStyle: string;
}) {
  const shouldRender = isDark && themeStyle === THEME_STYLE_ENUM.STARS;

  return (
    <View
      className={`pointer-events-none absolute top-0 right-0 left-0 z-[1] h-[400px] ${!shouldRender ? "hidden" : ""}`}
    >
      {stars.map((star, index) => (
        <TwinklingStar
          delay={star.delay}
          key={String(index)}
          left={star.left}
          size={star.size}
          top={star.top}
        />
      ))}
      <ShootingStar />
    </View>
  );
}
