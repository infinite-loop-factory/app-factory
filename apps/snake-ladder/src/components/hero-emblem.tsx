import type { CraftPalette } from "@/game/constants/palettes";

import Svg from "react-native-svg";
import { LadderPath, SnakePath } from "@/components/board-connections";

type HeroEmblemProps = {
  palette: CraftPalette;
  width: number;
};

/**
 * Lobby hero: a ladder climbing to the top-right with a snake
 * winding down across it — the whole game in one glance.
 */
export function HeroEmblem({ palette, width }: HeroEmblemProps) {
  const height = width * 0.58;
  const scale = width * 0.16;

  return (
    <Svg height={height} pointerEvents="none" width={width}>
      <LadderPath
        cellSize={scale}
        from={{ x: width * 0.24, y: height * 0.94 }}
        stroke={palette.ladder}
        to={{ x: width * 0.76, y: height * 0.08 }}
      />
      <SnakePath
        cellSize={scale}
        from={{ x: width * 0.82, y: height * 0.82 }}
        id="hero-snake"
        stroke={palette.snake}
        to={{ x: width * 0.16, y: height * 0.1 }}
      />
    </Svg>
  );
}
