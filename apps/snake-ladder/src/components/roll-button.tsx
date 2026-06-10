import { useEffect, useRef } from "react";
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

/** Hold this long for a full-power throw. */
export const FULL_CHARGE_MS = 900;

type RollButtonProps = {
  label: string;
  /** Receives hold charge 0..1 — quick taps roll at low power. */
  onPress: (charge: number) => void;
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
  const charge = useSharedValue(0);
  const pressStartRef = useRef<number | null>(null);

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
    transform: [
      { scale: pulse.get() * press.get() * (1 + charge.get() * 0.16) },
    ],
  }));

  const currentCharge = () => {
    if (pressStartRef.current === null) return 0;
    return Math.min(1, (Date.now() - pressStartRef.current) / FULL_CHARGE_MS);
  };

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="rounded-2xl px-6 py-4"
      onPress={() => onPress(currentCharge())}
      onPressIn={() => {
        pressStartRef.current = Date.now();
        if (reducedMotion) return;
        cancelAnimation(pulse);
        pulse.set(withTiming(1, { duration: 80 }));
        press.set(withTiming(0.95, { duration: 80 }));
        charge.set(
          withTiming(1, {
            duration: FULL_CHARGE_MS,
            easing: Easing.out(Easing.quad),
          }),
        );
      }}
      onPressOut={() => {
        if (reducedMotion) {
          press.set(1);
          charge.set(0);
          return;
        }
        cancelAnimation(charge);
        charge.set(withTiming(0, { duration: 140 }));
        press.set(withSpring(1, { damping: 14, stiffness: 320 }));
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
