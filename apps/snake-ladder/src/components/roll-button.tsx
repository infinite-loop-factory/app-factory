import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
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
import { GAME_FONT } from "@/game/constants/theme";
import { darkenColor, lightenColor } from "@/lib/color";

/** Hold this long for a full-power throw. */
export const FULL_CHARGE_MS = 900;
const EDGE_HEIGHT = 6;

type RollButtonProps = {
  label: string;
  /** Receives hold charge 0..1 — quick taps roll at low power. */
  onPress: (charge: number) => void;
  backgroundColor: string;
  /** Darker shade for the chunky 3D bottom edge — derived when omitted. */
  edgeColor?: string;
  accessibilityLabel: string;
  testID?: string;
  /** Gentle attention pulse while waiting for the player's input. */
  pulsing?: boolean;
};

export function RollButton({
  label,
  onPress,
  backgroundColor,
  edgeColor = darkenColor(backgroundColor, 0.6),
  accessibilityLabel,
  testID,
  pulsing = false,
}: RollButtonProps) {
  const pulse = useSharedValue(1);
  const sink = useSharedValue(0);
  const charge = useSharedValue(0);
  const pressStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!pulsing) {
      cancelAnimation(pulse);
      pulse.set(withTiming(1, { duration: 120 }));
      return;
    }
    pulse.set(
      withRepeat(
        withSequence(
          withTiming(1.05, {
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
  }, [pulse, pulsing]);

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.get() * (1 + charge.get() * 0.12) }],
  }));

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sink.get() }],
  }));

  const currentCharge = () => {
    if (pressStartRef.current === null) return 0;
    return Math.min(1, (Date.now() - pressStartRef.current) / FULL_CHARGE_MS);
  };

  return (
    <Animated.View style={wrapperStyle}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={() => onPress(currentCharge())}
        onPressIn={() => {
          pressStartRef.current = Date.now();
          cancelAnimation(pulse);
          pulse.set(withTiming(1, { duration: 80 }));
          sink.set(withTiming(EDGE_HEIGHT - 1, { duration: 80 }));
          charge.set(
            withTiming(1, {
              duration: FULL_CHARGE_MS,
              easing: Easing.out(Easing.quad),
            }),
          );
        }}
        onPressOut={() => {
          cancelAnimation(charge);
          charge.set(withTiming(0, { duration: 140 }));
          sink.set(withSpring(0, { damping: 14, stiffness: 360 }));
        }}
        testID={testID}
      >
        {/* edge layer — the face sinks onto it when pressed */}
        <View
          style={{
            backgroundColor: edgeColor,
            borderRadius: 18,
            paddingBottom: EDGE_HEIGHT,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
          }}
        >
          <Animated.View style={[{ borderRadius: 18 }, faceStyle]}>
            <LinearGradient
              colors={[
                lightenColor(backgroundColor, 0.3),
                backgroundColor,
                darkenColor(backgroundColor, 0.88),
              ]}
              style={{
                borderRadius: 18,
                paddingHorizontal: 34,
                paddingVertical: 14,
                alignItems: "center",
                borderTopWidth: 1.5,
                borderTopColor: "rgba(255,255,255,0.35)",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 21,
                  fontFamily: GAME_FONT,
                  letterSpacing: 1.5,
                  textShadowColor: "rgba(0,0,0,0.35)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 2,
                }}
              >
                {label}
              </Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
