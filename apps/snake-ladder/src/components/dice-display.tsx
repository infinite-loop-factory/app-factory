import type { DiceFaceValue } from "@/components/dice/dice-orientations";
import type { CraftPalette } from "@/game/constants/palettes";

import { View } from "react-native";
import { DiceCubeGl } from "@/components/dice/dice-cube-gl";
import { DiceFace } from "@/components/dice/dice-face";

type DiceDisplayProps = {
  value: number | null;
  rolling?: boolean;
  palette: CraftPalette;
  reducedMotion?: boolean;
  gold?: boolean;
};

function toFaceValue(value: number | null): DiceFaceValue | null {
  if (value === null || value < 1 || value > 6) return null;
  return value as DiceFaceValue;
}

export function DiceDisplay({
  value,
  rolling,
  palette,
  reducedMotion = false,
  gold = false,
}: DiceDisplayProps) {
  const size = 72;
  const face = toFaceValue(value);
  const variant = gold ? "gold" : "default";

  if (reducedMotion) {
    return (
      <View style={{ width: size, height: size }}>
        <DiceFace
          face={face ?? 1}
          palette={palette}
          size={size}
          variant={variant}
        />
      </View>
    );
  }

  return (
    <DiceCubeGl
      palette={palette}
      reducedMotion={reducedMotion}
      rolling={rolling}
      size={size}
      value={value}
      variant={variant}
    />
  );
}
