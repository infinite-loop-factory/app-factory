import { memo, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const TwinklingStar = memo(
  ({
    top,
    left,
    size,
    delay,
    duration = 800,
  }: {
    top: number;
    left: number;
    size: number;
    delay: number;
    duration?: number;
  }) => {
    const opacity = useSharedValue(0);
    const activeDuration = duration * 2;
    const waitDuration = Math.random() * 3000 + 2000;

    useEffect(() => {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, {
              duration: activeDuration * 0.5,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0.3, {
              duration: activeDuration * 0.5,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0.3, {
              duration: waitDuration,
              easing: Easing.linear,
            }),
          ),
          -1,
          true,
        ),
      );
    }, [delay, waitDuration, activeDuration, opacity]);

    const style = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: opacity.value }],
    }));

    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            top,
            left,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#FFF",
            shadowColor: "#FFF",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          },
          style,
        ]}
      />
    );
  },
);
