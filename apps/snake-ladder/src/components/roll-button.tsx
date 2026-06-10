import { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type RollButtonProps = {
  label: string;
  onPress: () => void;
  backgroundColor: string;
  accessibilityLabel: string;
  testID?: string;
  /** Gentle attention pulse while waiting for the player's input. */
  pulsing?: boolean;
  reducedMotion?: boolean;
};

export function RollButton({
  label,
  onPress,
  backgroundColor,
  accessibilityLabel,
  testID,
  pulsing = false,
  reducedMotion = false,
}: RollButtonProps) {
  const pulse = useSharedValue(1);
  const press = useSharedValue(1);

  useEffect(() => {
    if (!pulsing || reducedMotion) {
      cancelAnimation(pulse);
      pulse.set(withTiming(1, { duration: 120 }));
      return;
    }
    pulse.set(
      withRepeat(
        withSequence(
          withTiming(1.06, {
            duration: 620,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(1, { duration: 620, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(pulse);
  }, [pulse, pulsing, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.get() * press.get() }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="rounded-2xl px-6 py-4"
      onPress={onPress}
      onPressIn={() => {
        press.set(reducedMotion ? 1 : withTiming(0.93, { duration: 90 }));
      }}
      onPressOut={() => {
        press.set(
          reducedMotion ? 1 : withSpring(1, { damping: 14, stiffness: 320 }),
        );
      }}
      style={[{ backgroundColor }, style]}
      testID={testID}
    >
      <Text className="font-extrabold text-base" style={{ color: "#fff" }}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
