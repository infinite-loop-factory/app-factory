import type { DiceVariant } from "@/components/dice/dice-variant";

import { useCallback, useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { DiceResultPop } from "@/components/dice/dice-result-pop";
import { DiceRollGl } from "@/components/dice/dice-roll-gl";
import { resolveDiceAnimation } from "@/lib/dice-roll-bridge";

type DiceRollOverlayProps = {
  rolling: boolean;
  value: number | null;
  durationMs: number;
  /** Glass tint — matches whoever is rolling (player blue / cpu red / gold). */
  variant?: DiceVariant;
  /** Throw power 0..1 from the roll button hold. */
  charge?: number;
  /** Land the animation on this face (gold dice pre-rolled result). */
  forcedValue?: number | null;
  /** Bounce impact (strength 0..1) — wire haptics/sound on top of the shake. */
  onImpact?: (strength: number) => void;
};

const REVEAL_HOLD_MS = 680;

export function DiceRollOverlay({
  rolling,
  value,
  durationMs,
  variant = "default",
  charge = 0.5,
  forcedValue = null,
  onImpact: onImpactExternal,
}: DiceRollOverlayProps) {
  const { width, height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [rollKey, setRollKey] = useState(0);
  const [revealedValue, setRevealedValue] = useState<number | null>(null);
  const shakeX = useSharedValue(0);
  const shakeY = useSharedValue(0);

  // biome-ignore lint/suspicious/useAwait: dice bridge callers may await this
  const onRollComplete = useCallback(async (physicsValue: number) => {
    resolveDiceAnimation(physicsValue);
    setRevealedValue(physicsValue);
  }, []);

  const onImpact = useCallback(
    (strength: number) => {
      onImpactExternal?.(strength);
      const amp = 3 + strength * 9;
      shakeX.set(
        withSequence(
          withTiming((Math.random() - 0.5) * amp * 2, { duration: 40 }),
          withTiming((Math.random() - 0.5) * amp, { duration: 60 }),
          withTiming(0, { duration: 90 }),
        ),
      );
      shakeY.set(
        withSequence(
          withTiming(amp * 0.7, { duration: 40 }),
          withTiming(-amp * 0.35, { duration: 60 }),
          withTiming(0, { duration: 90 }),
        ),
      );
    },
    [onImpactExternal, shakeX, shakeY],
  );

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.get() }, { translateY: shakeY.get() }],
  }));

  useEffect(() => {
    if (!rolling) return;
    setVisible(true);
    setRevealedValue(null);
    setRollKey((key) => key + 1);
  }, [rolling]);

  useEffect(() => {
    if (rolling) return;
    if (value !== null) setRevealedValue(value);
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), REVEAL_HOLD_MS);
    return () => clearTimeout(timer);
  }, [rolling, value, visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={styles.scrim} />
      <Animated.View style={[styles.stage, shakeStyle]}>
        <DiceRollGl
          charge={charge}
          durationMs={durationMs}
          forcedValue={forcedValue}
          height={height * 0.62}
          key={`roll-${rollKey}`}
          onImpact={onImpact}
          onRollComplete={onRollComplete}
          variant={variant}
          width={width}
        />
      </Animated.View>
      {revealedValue !== null ? (
        <DiceResultPop
          gold={variant === "gold"}
          key={`pop-${rollKey}`}
          value={revealedValue}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    elevation: 40,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 16, 32, 0.2)",
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
