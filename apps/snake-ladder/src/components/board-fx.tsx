import type { ReactNode } from "react";
import type { CraftPalette } from "@/game/constants/palettes";

import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type BoardFxKind = "snake" | "ladder";

type BoardFxProps = {
  /** Kind of the connection being traversed; null when idle. */
  kind: BoardFxKind | null;
  /** Increment to fire the effect again (one slide = one tick). */
  tick: number;
  palette: CraftPalette;
  children: ReactNode;
};

const SHAKE_MS = 420;
const FLASH_MS = 480;

/**
 * Impact dressing around the board: a decaying shake + red flash when a
 * snake bites, a soft golden-green flash when a ladder lifts.
 */
export function BoardFx({ kind, tick, palette, children }: BoardFxProps) {
  const shake = useSharedValue(1);
  const flash = useSharedValue(1);
  const flashColor = kind === "snake" ? palette.snake : palette.orbGlow;

  useEffect(() => {
    if (tick === 0 || kind === null) return;
    flash.set(0);
    flash.set(
      withTiming(1, { duration: FLASH_MS, easing: Easing.out(Easing.quad) }),
    );
    if (kind === "snake") {
      shake.set(0);
      shake.set(withTiming(1, { duration: SHAKE_MS, easing: Easing.linear }));
    }
  }, [tick, kind, shake, flash]);

  const shakeStyle = useAnimatedStyle(() => {
    const p = shake.get();
    if (p >= 1) return { transform: [{ translateX: 0 }, { translateY: 0 }] };
    const decay = 1 - p;
    const amp = 8 * decay * decay;
    return {
      transform: [
        { translateX: Math.sin(p * Math.PI * 10) * amp },
        { translateY: Math.cos(p * Math.PI * 8) * amp * 0.55 },
      ],
    };
  });

  const flashStyle = useAnimatedStyle(() => {
    const p = flash.get();
    const peak = kind === "snake" ? 0.26 : 0.16;
    return {
      opacity: p >= 1 ? 0 : interpolate(p, [0, 0.18, 1], [0, peak, 0]),
    };
  });

  return (
    <Animated.View style={shakeStyle}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: flashColor, borderRadius: 26, zIndex: 20 },
          flashStyle,
        ]}
      />
    </Animated.View>
  );
}
