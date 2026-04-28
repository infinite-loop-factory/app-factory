import { Pressable, Text, View } from "react-native";
import { ClipPath, Defs, Path, Rect, Svg } from "react-native-svg";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { haptic } from "@/lib/haptics";

const GLASS_PATH = "M6 4h12l-1 14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3L6 4z";

type GlassState = "full" | "half" | "empty";

function Glass({ state, size = 28 }: { state: GlassState; size?: number }) {
  const colors = useThemeColors();
  const fillColor = state === "empty" ? "transparent" : colors.brand;
  const strokeColor = state === "empty" ? colors.textFaint : colors.brand;

  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Defs>
        <ClipPath id={`half-${state}`}>
          <Rect height={24} width={12} x={0} y={0} />
        </ClipPath>
      </Defs>
      <Path
        d={GLASS_PATH}
        fill={state === "half" ? "transparent" : fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
      {state === "half" && (
        <Path
          clipPath={`url(#half-${state})`}
          d={GLASS_PATH}
          fill={colors.brand}
        />
      )}
    </Svg>
  );
}

export type ScoreSliderProps = {
  value: number;
  onChange: (next: number) => void;
  size?: number;
};

/**
 * Each glass has two hit zones (left = +0.5, right = +1.0).
 * Tapping a glass at its current value clears it (drops to that index minus 0.5).
 */
export function ScoreSlider({ value, onChange, size = 28 }: ScoreSliderProps) {
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
          let state: GlassState;
          if (value >= fullScore) state = "full";
          else if (value >= halfScore) state = "half";
          else state = "empty";

          return (
            <View className="flex-row" key={i}>
              <Pressable
                accessibilityLabel={`${halfScore} 점`}
                accessibilityRole="button"
                onPress={() => handle(halfScore)}
                style={{ width: size / 2 }}
              >
                <View pointerEvents="none">
                  <Glass size={size} state={state} />
                </View>
              </Pressable>
              <Pressable
                accessibilityLabel={`${fullScore} 점`}
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
