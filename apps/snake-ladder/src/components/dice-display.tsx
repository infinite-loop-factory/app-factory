import type { CraftPalette } from "@/game/constants/palettes";

import { DiceCubeGl } from "@/components/dice/dice-cube-gl";

type DiceDisplayProps = {
  value: number | null;
  rolling?: boolean;
  palette: CraftPalette;
  gold?: boolean;
};

export function DiceDisplay({
  value,
  rolling,
  palette,
  gold = false,
}: DiceDisplayProps) {
  const size = 72;
  const variant = gold ? "gold" : "default";

  return (
    <DiceCubeGl
      palette={palette}
      rolling={rolling}
      size={size}
      value={value}
      variant={variant}
    />
  );
}
