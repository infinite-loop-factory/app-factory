import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { ThemedText } from "@/components/themed-text";

export function HelloWave() {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotationAnim, {
          toValue: 25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 4 },
    );
    animation.start();
  }, [rotationAnim]);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 25],
    outputRange: ["0deg", "25deg"],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate }] }]}>
      <ThemedText className="mt-[-6px] text-[28px] leading-[32px]">
        👋
      </ThemedText>
    </Animated.View>
  );
}
