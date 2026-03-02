import type { ReactNode } from "react";

import { useEffect } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ToggleProps {
  isActive: boolean;
  onPress: () => void;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  backgroundColor?: string;
  duration?: number;
  easing?: "ease" | "spring";
}

export function Toggle({
  isActive,
  onPress,
  leftContent,
  rightContent,
  backgroundColor,
  duration = 300,
  easing = "ease",
}: ToggleProps) {
  const translateX = useSharedValue(isActive ? 24 : 0);

  useEffect(() => {
    const targetX = isActive ? 24 : 0;
    if (easing === "spring") {
      translateX.value = withSpring(targetX, { duration });
    } else {
      translateX.value = withTiming(targetX, {
        duration,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isActive, duration, easing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 0.4 : 1, { duration }),
  }));

  const rightAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0.4, { duration }),
  }));

  return (
    <View>
      <Pressable
        className="relative flex-row items-center overflow-hidden rounded-full"
        onPress={onPress}
        style={{
          width: 48,
          height: 24,
          padding: 2,
          backgroundColor,
        }}
      >
        <Animated.View
          className="absolute items-center justify-center"
          style={[
            {
              left: 4,
              zIndex: 1,
            },
            leftAnimatedStyle,
          ]}
        >
          {leftContent}
        </Animated.View>
        <Animated.View
          className="absolute items-center justify-center"
          style={[
            {
              right: 4,
              zIndex: 1,
            },
            rightAnimatedStyle,
          ]}
        >
          {rightContent}
        </Animated.View>
        <Animated.View
          className="absolute rounded-full"
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: Platform.OS === "ios" ? 0.4 : 0.2,
              shadowRadius: Platform.OS === "ios" ? 4 : 3,
              elevation: Platform.OS === "android" ? 6 : 4,
              zIndex: 0,
            },
            animatedStyle,
          ]}
        />
      </Pressable>
    </View>
  );
}
