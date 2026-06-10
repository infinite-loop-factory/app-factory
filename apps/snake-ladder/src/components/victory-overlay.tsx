import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const TROPHY = require("@/assets/images/art/victory-trophy.png");

type VictoryOverlayProps = {
  /** Show the trophy — player won and the game is over. */
  visible: boolean;
};

/** Trophy art that springs in over the board when the player wins. */
export function VictoryOverlay({ visible }: VictoryOverlayProps) {
  const scale = useSharedValue(0);
  const float = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      scale.set(0);
      float.set(0);
      return;
    }
    scale.set(withSpring(1, { damping: 11, stiffness: 160, mass: 0.9 }));
    float.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [visible, scale, float]);

  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, scale.get() * 1.4),
    transform: [{ scale: scale.get() }, { translateY: float.get() * -8 }],
  }));

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.center]}
      testID="victory-overlay"
    >
      <Animated.View style={style}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={TROPHY}
          style={styles.trophy}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 25,
  },
  trophy: {
    width: 190,
    height: 190,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
});
