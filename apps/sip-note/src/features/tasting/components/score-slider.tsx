import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { GlassVessel } from "@/components/ui-domain/glass-vessel";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";

const WAVE_PERIOD = 2400;

export type ScoreSliderProps = {
  value: number;
  onChange: (next: number) => void;
  size?: number;
};

/**
 * Each glass has two hit zones (left = +0.5, right = +1.0).
 * Tapping a glass at its current value clears it (drops to that index minus 0.5).
 *
 * A single sinusoidal phase is shared across all 5 glasses for visual sync
 * + minimal worklet overhead.
 */
export function ScoreSlider({ value, onChange, size = 28 }: ScoreSliderProps) {
  const reduce = useReducedMotion();
  const phase = useSharedValue(0);
  const hasPartial = [0, 1, 2, 3, 4].some((i) => {
    const f = value - i;
    return f > 0 && f < 1;
  });
  const wavy = !reduce && hasPartial;

  useEffect(() => {
    if (wavy) {
      phase.value = 0;
      phase.value = withRepeat(
        withTiming(Math.PI * 2, {
          duration: WAVE_PERIOD,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    }
  }, [wavy, phase]);

  const handle = (next: number) => {
    haptic.selection();
    if (Math.abs(next - value) < 0.001) {
      onChange(Math.max(0, next - 0.5));
    } else {
      onChange(next);
    }
  };

  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row gap-1">
        {[0, 1, 2, 3, 4].map((i) => {
          const fullScore = i + 1;
          const halfScore = i + 0.5;
          const fill = Math.max(0, Math.min(1, value - i));

          return (
            <View className="flex-row" key={i}>
              <Pressable
                accessibilityLabel={i18n.t("tasting.a11y.scorePoint", {
                  score: halfScore,
                })}
                accessibilityRole="button"
                onPress={() => handle(halfScore)}
                style={{ width: size / 2 }}
              >
                <View pointerEvents="none">
                  <GlassVessel fill={fill} phase={phase} size={size} />
                </View>
              </Pressable>
              <Pressable
                accessibilityLabel={i18n.t("tasting.a11y.scorePoint", {
                  score: fullScore,
                })}
                accessibilityRole="button"
                onPress={() => handle(fullScore)}
                style={{ width: size / 2, marginLeft: -size / 2 }}
              />
            </View>
          );
        })}
      </View>
      <Text className="font-display font-semibold text-brand text-h3">
        {value > 0 ? value.toFixed(1) : "—"}
      </Text>
    </View>
  );
}
