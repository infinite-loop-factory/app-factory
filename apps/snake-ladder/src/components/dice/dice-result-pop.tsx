import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { GAME_FONT } from "@/game/constants/theme";

type DiceResultPopProps = {
  value: number;
  gold?: boolean;
};

/** Big result number that pops in the moment the die settles. */
export function DiceResultPop({ value, gold = false }: DiceResultPopProps) {
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.set(withTiming(1, { duration: 110 }));
    scale.set(
      withSequence(
        withTiming(1.28, {
          duration: 150,
          easing: Easing.out(Easing.back(2.4)),
        }),
        withSpring(1, { damping: 12, stiffness: 260 }),
      ),
    );
  }, [opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Animated.Text
      pointerEvents="none"
      style={[styles.number, gold ? styles.gold : styles.default, style]}
    >
      {value}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  number: {
    position: "absolute",
    alignSelf: "center",
    top: "18%",
    fontSize: 104,
    fontFamily: GAME_FONT,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    zIndex: 50,
  },
  default: {
    color: "#ffffff",
    textShadowColor: "rgba(12, 36, 84, 0.7)",
  },
  gold: {
    color: "#ffd54f",
    textShadowColor: "rgba(96, 64, 6, 0.75)",
  },
});
